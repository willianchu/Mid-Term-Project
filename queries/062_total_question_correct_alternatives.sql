SELECT COUNT(*)
FROM alternatives
WHERE is_correct = true AND question_id = $1;