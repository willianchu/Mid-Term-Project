SELECT AVG(users_results) AS average_result
FROM (SELECT users.name, SUM(
    CASE
        WHEN alternatives.is_correct = true THEN 
        
            (SELECT (SELECT 1 / count(*)::DECIMAL AS total_quiz_questions
            FROM questions
            WHERE quiz_id = tests.quiz_id) / COUNT(*)::DECIMAL AS answer_weight
            FROM alternatives -- weight = 1 / number of correct alternatives
            WHERE is_correct = true AND question_id = answers.question_id) 
        ELSE 0 
    END
) AS users_results
FROM answers
INNER JOIN tests ON answers.test_id = tests.id
INNER JOIN alternatives ON answers.alternative_id = alternatives.id
INNER JOIN users ON tests.user_id = users.id
WHERE quiz_id = $1 and alternatives.is_correct = true
GROUP BY users.name) AS users_results; -- $1 = quiz_id 
