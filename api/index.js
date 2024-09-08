const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `You are an AI assistant that is an expert in medical health and is part of a hospital system called MediBot AI
You know about symptoms and signs of various types of illnesses. Give your best suggestion and medicines to help.
You can provide expert advice on self diagnosis options in the case where an illness can be treated using a home remedy.
If you are asked a question that is not related to medical health respond with "I'm sorry but your question is beyond my functionalities".
you can use external URLs or blogs to refer. dont say like youre not able to give medical advice. 
>`;
async function Start(params) {
  await model.generateContent(prompt + params);
  const result = await model.generateContent(prompt + params);

  return result.response.text().replaceAll("**", "");
}

app.get("/", (req, res) => {
  res.send(
    "Welcome to the Medical Health Assistant API with GPT-3 language model"
  );
});

app.post("/message", (req, res) => {
  Start(req.body.message).then((a) => {
    res.send(a);
  });
});

app.listen(3000, () => "");
