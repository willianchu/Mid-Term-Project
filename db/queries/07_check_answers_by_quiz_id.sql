SELECT quizzes.title, quizzes.cut_note, quizzes.time_limit, questions.question, alternatives.alternative, alternatives.is_correct
FROM quizzes
JOIN questions ON quizzes.id = questions.quiz_id
JOIN alternatives ON questions.id = alternatives.question_id
WHERE is_correct = true AND quizzes.id = $1;
