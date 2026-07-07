const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
.connect("mongodb://localhost:27017/InterviewDBNew")
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

const InterviewSchema = new mongoose.Schema({
    studentName: String,
    regNo: String,
    branch: String,
    answers: [
        {
            question: String,
            answer: String,
            score: Number
        }
    ],
    finalScore: Number
});
const Interview = mongoose.model(
    "Interview",
    InterviewSchema
);
const questions = [
{
    question: "What is React?",
    keywords: ["component", "javascript", "ui", "virtual"]
},
{
    question: "What is Node.js?",
    keywords: ["javascript", "runtime", "server"]
},
{
    question: "What is Express.js?",
    keywords: ["framework", "node", "routing", "middleware"]
},
{
    question: "What is MongoDB?",
    keywords: ["database", "nosql", "document", "collection"]
},
{
    question: "What is the difference between SQL and NoSQL?",
    keywords: ["structured", "schema", "table", "nosql", "mongodb"]
},
{
    question: "Explain OOP concepts.",
    keywords: [
        "class",
        "object",
        "inheritance",
        "polymorphism",
        "encapsulation"
    ]
}
];
app.get("/generateQuestions", (req, res) => {
    const shuffled =
        [...questions].sort(
            () => Math.random() - 0.5
        );
    const selectedQuestions =
        shuffled.slice(0, 5);
    res.json(selectedQuestions);
});
app.post("/submitAnswer", (req, res) => {
    try {
        const { question, answer } = req.body;
        const selectedQuestion =
            questions.find(
                q => q.question === question
            );
        if (!selectedQuestion) {
            return res.status(404).json({
                message: "Question not found"
            });
        }
        const keywords =
            selectedQuestion.keywords;
        const userAnswer =
            answer.toLowerCase();
        let matchedKeywords = 0;
        keywords.forEach(keyword => {
            if (
                userAnswer.includes(
                    keyword.toLowerCase()
                )
            ) {
                matchedKeywords++;
            }
        });
        let score = 2;
        if (matchedKeywords === 1)
            score = 4;
        else if (matchedKeywords === 2)
            score = 6;
        else if (matchedKeywords === 3)
            score = 8;
        else if (matchedKeywords >= 4)
            score = 10;
        res.status(200).json({
            message:
                "Answer Evaluated Successfully",
            score
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});
app.post("/saveInterview", async (req, res) => {
    try {
        const {
            studentName,
            regNo,
            branch,
            answers,
            finalScore
        } = req.body;
        const interview =
            await Interview.create({
                studentName,
                regNo,
                branch,
                answers,
                finalScore
            });
        res.status(201).json({
            message:
                "Interview Saved Successfully",
            interview
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});
app.get("/results", async (req, res) => {
    try {
        const results =
            await Interview.find();
        res.json(results);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});
app.listen(5000, () => {
    console.log(
        "Server Running on Port 5000"
    );   
});
