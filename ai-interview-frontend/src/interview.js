import { useState } from "react";

function Interview() {

    const [studentName, setStudentName] = useState("");
    const [regNo, setRegNo] = useState("");
    const [branch, setBranch] = useState("");

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [answer, setAnswer] = useState("");

    const [totalScore, setTotalScore] = useState(0);

    const [allAnswers, setAllAnswers] = useState([]);

    const [started, setStarted] = useState(false);
    const [completed, setCompleted] = useState(false);

    const startInterview = async () => {

        if (
            studentName.trim() === "" ||
            regNo.trim() === "" ||
            branch.trim() === ""
        ) {
            alert(
                "Please enter Name, Register Number and Branch"
            );
            return;
        }
        const res = await fetch(
            "http://localhost:5000/generateQuestions"
        );
        const data = await res.json();
        setQuestions(data);
        setStarted(true);
        setCurrentQuestion(0);
        setTotalScore(0);
        setAllAnswers([]);
        setAnswer("");
    };
    const submitAnswer = async () => {
        const currentQ =
            questions[currentQuestion];
        const res = await fetch(
            "http://localhost:5000/submitAnswer",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    question:
                        currentQ.question,
                    answer
                })
            }
        );
        const data = await res.json();
        const score =
            data.score;
        const updatedAnswers = [
            ...allAnswers,
            {
                question:
                    currentQ.question,
                answer,
                score
            }
        ];
        setAllAnswers(
            updatedAnswers
        );
        const updatedTotal =
            totalScore + score;
        setTotalScore(
            updatedTotal
        );
        setAnswer("");
        if (
            currentQuestion <
            questions.length - 1
        ) {
            setCurrentQuestion(
                currentQuestion + 1
            );
        }
        else {
            await fetch(
                "http://localhost:5000/saveInterview",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        studentName,
                        regNo,
                        branch,
                        answers:
                            updatedAnswers,
                        finalScore:
                            updatedTotal
                    })
                });
            setCompleted(true);
        }
    };
    return (
        <div
            style={{
                padding: "30px",
                textAlign: "center"
            }}
        >
            <h1>
                AI Interview Evaluation System
            </h1>
            {!started && (
                <div>
                    <input
                        type="text"
                        placeholder="Student Name"
                        value={studentName}
                        onChange={(e) =>
                            setStudentName(
                                e.target.value
                            )
                        }
                    />
                    <br /><br />
                    <input
                        type="text"
                        placeholder="Register Number"
                        value={regNo}
                        onChange={(e) =>
                            setRegNo(
                                e.target.value
                            )
                        }
                    />
                    <br /><br />
                    <input
                        type="text"
                        placeholder="Branch"
                        value={branch}
                        onChange={(e) =>
                            setBranch(
                                e.target.value
                            )
                        }
                    />
                    <br /><br />
                    <button
                        onClick={
                            startInterview
                        }
                    >
                        Start Interview
                    </button>
                </div>
            )}
            {started &&
                !completed &&
                questions.length > 0 && (
                    <div>
                        <h2>
                            Question
                            {" "}
                            {currentQuestion + 1}
                            {" "}
                            of
                            {" "}
                            5
                        </h2>
                      <h3>
                            {
                                questions[
                                    currentQuestion
                                ].question
                            }
                        </h3>
                        <textarea
                            rows="5"
                            cols="50"
                            value={answer}
                            onChange={(e) =>
                                setAnswer(
                                    e.target.value
                                )
                            }
                            placeholder=
                            "Type your answer here..."
                        />
                        <br /><br />
                        <button
                            onClick={
                                submitAnswer
                            }
                        >
                            Submit Answer
                        </button>
                    </div>
                )}
            {completed && (
                <div>
                    <h2>
                        Interview Completed
                    </h2>
                    <h2>
                        Final Score :
                        {" "}
                        {totalScore}
                        / 50
                    </h2>
                    <h3>
                        Thank You
                    </h3>
                </div>
            )}
       </div>
    );
}

export default Interview;
