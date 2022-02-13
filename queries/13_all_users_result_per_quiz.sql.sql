SELECT users.name, SUM(
    CASE WHEN alternatives.is_correct = true THEN (SELECT (SELECT 1 / count(*)::DECIMAL AS total_quiz_questions
FROM questions
WHERE quiz_id = tests.quiz_id) / COUNT(*)::DECIMAL AS answer_weight
FROM alternatives -- weight = 1 / number of correct alternatives
WHERE is_correct = true AND question_id = answers.question_id) ELSE 0 END
)
FROM answers
INNER JOIN tests ON answers.test_id = tests.id
INNER JOIN alternatives ON answers.alternative_id = alternatives.id
INNER JOIN users ON tests.user_id = users.id
WHERE quiz_id = 6 and alternatives.is_correct = true
GROUP BY users.name; -- $1 = quiz_id returns the percentage of correct answers 1 = 100%