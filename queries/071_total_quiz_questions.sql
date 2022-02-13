SELECT count(*) AS total_quiz_questions
FROM questions
WHERE quiz_id = $1;
