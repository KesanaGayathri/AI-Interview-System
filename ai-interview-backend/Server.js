const questions = [
  "Tell me about yourself.",
  "What are your strengths?",
  "Why do you want this job?",
  "Explain a challenging project you worked on.",
  "Where do you see yourself in 5 years?",
];

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Interview Backend Running");
});

app.get("/question/:id", (req, res) => {
  const id = req.params.id;

  res.json({
    question: questions[id],
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.post("/answer", (req, res) => {
  const userAnswer = req.body.answer;

  let score = 0;

  if (userAnswer.length > 80) {
    score = 2;
  } else if (userAnswer.length > 30) {
    score = 1;
  } else {
    score = 0;
  }

  res.json({
    score: score,
  });
});
