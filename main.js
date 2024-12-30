import { Telegraf } from "telegraf";
import axios from "axios";
require("dotenv").config();

// Tokens
const TELEGRAM_TOKEN = process.env.TELEGRAM_API_KEY;
const COHERE_API_KEY = process.env.AI_API_KEY;
const bot = new Telegraf(TELEGRAM_TOKEN);

// Get answer from gpt
async function getBotReply(prompt) {
  if (!prompt || prompt.trim() === "") {
    return "You didn't ask a question. Please write something.";
  }

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command",
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.1,
        top_p: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API Response:", response.data);

    if (
      response.data &&
      response.data.generations &&
      response.data.generations[0].text
    ) {
      return response.data.generations[0].text; // Извлекаем текст из генерации
    } else {
      return "Sorry, I couldn't process your request. Please try again later. Or contact my creator: https://t.me/moutains_sport";
    }
  } catch (error) {
    console.error("Error fetching response from COHERE API:", error);
    return "Sorry, I couldn't process your request. Please try again later. Or contact my creator: https://t.me/moutains_sport";
  }
}

// Processing command
bot.start((ctx) =>
  ctx.reply(
    "Hello! I will be your loyal assistant! I was created by ASD, and I will help you with any of your questions!, I would like to point out that this bot answers your questions, best of all in English language, and it is quite simple, as it can only handle "
  )
);
bot.help((ctx) =>
  ctx.reply(
    "If you have any questions or preferences regarding the bot, please contact my creator: https://t.me/moutains_sport"
  )
);
bot.on("text", async (ctx) => {
  ctx.reply("Gathering information from AI...");
  const userMessage = ctx.message.text; // Get user message
  const botReply = await getBotReply(userMessage); // Get answer
  ctx.reply(botReply); // Send answer to user
});

// Start BOT
bot.launch().then(() => console.log("Bot started!"));
