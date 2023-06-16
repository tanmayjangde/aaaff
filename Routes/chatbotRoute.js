const express = require("express");
const router = express.Router();

const {
  generateText
} = require("../Controller/chatbotController");

router.post("/generateText", generateText);

module.exports = router;
