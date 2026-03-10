import { useState, useEffect } from "react";
import axios from "axios";

function Interview() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    loadQuestion();
  }, [questionIndex]);

  const loadQuestion = () => {
    axios.get(`http://localhost:5000/question/${questionIndex}`).then((res) => {
      setQuestion(res.data.question);
    });
  };

  const submitAnswer = () => {
    axios
      .post("http://localhost:5000/answer", {
        answer: answer,
      })
      .then((response) => {
        const newScore = totalScore + response.data.score;

        setTotalScore(newScore);

        setAnswer("");

        if (questionIndex < 4) {
          setQuestionIndex(questionIndex + 1);
        } else {
          window.location.href = `/result?score=${newScore}`;
        }
      });
  };

  return (
    <div className="container">
      <h2>Question {questionIndex + 1} / 5</h2>

      <p>{question}</p>

      <textarea
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <br />
      <br />

      <button onClick={submitAnswer}>Next</button>
    </div>
  );
}

export default Interview;
