const express = require("express");
const router = express.Router();

const {
  generateText, testMessage, testAI
} = require("../Controller/chatbotController");

router.post("/generateText", generateText);
router.get("/test", testMessage);
router.post("/testAi", testAI);

module.exports = router;
