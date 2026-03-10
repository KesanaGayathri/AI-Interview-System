import { useLocation } from "react-router-dom";

function Result() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const score = params.get("score");

  return (
    <div className="container">
      <h2>Interview Result</h2>

      <h1>{score} / 10</h1>

      <p>
        {score >= 8
          ? "Excellent Performance!"
          : score >= 5
            ? "Good job, but you can improve."
            : "Needs improvement. Practice more."}
      </p>
    </div>
  );
}

export default Result;
