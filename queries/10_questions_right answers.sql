SELECT answers.question_id, COUNT(answers.question_id) AS easiest_questions
FROM answers
JOIN alternatives ON answers.alternative_id = alternatives.id
JOIN questions ON alternatives.question_id = questions.id
WHERE is_correct = true AND quiz_id = $1 -- quiz_id = $1
GROUP BY answers.question_id
ORDER BY COUNT(answers.question_id) DESC; 