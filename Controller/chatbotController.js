const asyncHandler = require("express-async-handler");
const { ethers } = require("ethers")
const { Client } =  require("@xmtp/xmtp-js");
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv").config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

const generateText = asyncHandler(async (req, res) => {
  const xmtp = await Client.create(wallet);

  // load history of messages from xmtp
  const conversation = await getConversation(req.body.address.toString())
  // const opts = {
  //   // Only show messages from last 24 hours
  //   startTime: new Date(new Date().setDate(new Date().getDate() - 7)),
  //   endTime: new Date(),
  // };
  let messages = [{role: "system", content: "You are a web3 chatbot named Kabir"}];
  const messagesInConversation = await conversation.messages();
  for(const message of messagesInConversation){
    messages.push({
      role: message.senderAddress=="0x9D471c71dCb5cf9C63b0634061F0E941B452a832"?"assistant":"user",
      content: message.content
    });
  }

  messages.push({
    role: "user",
    content: req.body.message.toString()
  })

  console.log(messages);

  // send request to openai for autogenerated text
  // get autogenerated text from openai
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages
  });

  console.log("Generated Response : " + chatCompletion.data.choices[0].message.content);

  // // send msg from chatbot address to user via xmtp
  conversation.send(chatCompletion.data.choices[0].message.content);
  
  // send response back to client
  res.status(200)
      .json({
        sucess: true,
        text: chatCompletion.data.choices[0].message.content
      });
});

const getConversation = async (address) => {
  const xmtp = await Client.create(wallet);
  const allConversations = await xmtp.conversations.list();
  for (const conversation of allConversations) {
    if(conversation.peerAddress.toString() === address.toString()){
      return conversation;
    }
  }
  return null;
}

module.exports = { generateText};
