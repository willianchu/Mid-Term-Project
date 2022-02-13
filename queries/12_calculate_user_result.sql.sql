SELECT SUM(
    CASE 
    WHEN alternatives.is_correct = true THEN 
        (SELECT (SELECT 1 / count(*)::DECIMAL AS total_quiz_questions
        FROM questions
        WHERE quiz_id = tests.quiz_id) / COUNT(*)::DECIMAL AS answer_weight
        FROM alternatives -- weight = 1 / number of correct alternatives
        WHERE is_correct = true AND question_id = answers.question_id) 
    ELSE 0 
    END
)
FROM answers
INNER JOIN tests ON answers.test_id = tests.id
INNER JOIN alternatives ON answers.alternative_id = alternatives.id
WHERE tests.user_id = 2 AND quiz_id = 5 AND alternatives.is_correct = true; -- $1 = user_id, $2 = quiz_id returns the percentage of correct answers 1 = 100%