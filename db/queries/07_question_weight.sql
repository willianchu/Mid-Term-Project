SELECT 1 / count(*)::DECIMAL AS total_quiz_questions
FROM questions
WHERE quiz_id = $1;

-- this is an auxialiary query to get the results