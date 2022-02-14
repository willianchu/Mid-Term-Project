SELECT 1 / COUNT(*)::DECIMAL AS answer_weight
FROM alternatives 
WHERE is_correct = true AND question_id = 47; 
-- this is an auxialiary query to get the results

-- SELECT (SELECT 1 / count(*)::DECIMAL AS total_quiz_questions
-- FROM questions
-- WHERE quiz_id = $1) / COUNT(*)::DECIMAL AS answer_weight
-- FROM alternatives -- weight = 1 / number of correct alternatives
-- WHERE is_correct = true AND question_id = $2; -- quiz_id = $1 AND question_id = $2;
