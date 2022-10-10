import { Box, Button, Typography } from "@mui/material";
import { decode } from "html-entities";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import useAxios from "../hooks/useAxios";
import { handleScoreChange } from "../redux/actions";

const getRandomInteger = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const Questions = () => {
  const {
    question_category,
    question_difficulty,
    question_type,
    amount_of_question,
    score,
  } = useSelector((state) => state);
  let apiUrl = `/api.php?amount=${amount_of_question}`;
  console.log(score);

  if (question_category)
    apiUrl = apiUrl.concat(`&category=${question_category}`);
  if (question_difficulty)
    apiUrl = apiUrl.concat(`&difficulty=${question_difficulty}`);
  if (question_type) apiUrl = apiUrl.concat(`&type=${question_type}`);

  const { response, loading } = useAxios({ url: apiUrl });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();
  const red = useSelector((state) => state);
  const dispatch = useDispatch();
  console.log(red);

  const handleClickAnswer = (e) => {
    const question = response.results[questionIndex];
    if (e.target.textContent === question.correct_answer) {
      dispatch(handleScoreChange(score + 1));
    }
    if (questionIndex + 1 < response.results.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      navigate("/score");
    }
  };

  useEffect(() => {
    if (response?.results.length) {
      const question = response.results[questionIndex];
      let answer = [...question.incorrect_answers];
      answer.splice(
        getRandomInteger(question.incorrect_answers.length),
        0,
        question?.correct_answer
      );
      setOptions(answer);
    }
  }, [response, questionIndex]);

  console.log(options);
  if (loading) return <Loader />;

  return (
    <Box>
      <Typography variant="h4">Question {questionIndex + 1}</Typography>
      <Typography mt={5}>
        {decode(response.results[questionIndex]?.question)}
      </Typography>
      {options.map((data, index) => (
        <Box mt={2} key={index}>
          <Button onClick={handleClickAnswer} variant="contained">
            {decode(data)}
          </Button>
        </Box>
      ))}

      <Box mt={5}>
        Score {score} / {response.results.length}
      </Box>
    </Box>
  );
};

export default Questions;
