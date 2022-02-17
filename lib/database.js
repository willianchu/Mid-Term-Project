require("dotenv").config();

const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams); // Can anyone help me ?
db.connect(); // I would like to take the connection directly from the server.js but I don't want to pass it every time as parameter in each function.

/** 01_search_users_by_email.sql
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserByEmail = function(email) {
  let lowerCaseEmail = email.toLowerCase();
  return db
    .query(`SELECT id, name, email, password
            FROM users
            WHERE email = $1;`, [lowerCaseEmail])
    .then((result) => {
      let obj = result.rows[0].email;
      if (obj === undefined) {
        return null;
      } else {
        //console.log("database", result.rows);
        return result.rows;
      }
    })
    .catch((err) => {
      console.log('Error retrieving user details - email', err.message);
    });
};
exports.getUserByEmail = getUserByEmail;

/** 02_search_users_by_id.sql
 * Get a single user from the database given their id.
 * @param {String} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserById = function(id) {
  return db
    .query(`SELECT id, name, email, password
            FROM users
            WHERE id = $1;`, [id])
    .then((result) => {
      let obj = result.rows[0].id;
      if (obj === undefined) {
        return null;
      } else {
        //console.log("database", result.rows);
        return result.rows;
      }
    })
    .catch((err) => {
      console.log('Error retrieving user details - id', err.message);
    });
};
exports.getUserById = getUserById;

/** 03_search_quizzes_by_user_id.sql
 * Get a all user quizzes from the database given their id.
 * @param {String} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getQuizzesByUserId = function(id) {
  return db
    .query(`SELECT
             id,
             title,
             description,
             cut_note,
             time_limit,
             url_quiz_image,
             owner_id
            FROM quizzes
            WHERE owner_id = $1`, [id])
    .then((result) => {
      let obj = result.rows[0].id;
      if (obj === undefined) {
        return null;
      } else {
        //console.log("database", result.rows);
        return result.rows;
      }
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getQuizzesByUserId = getQuizzesByUserId;


// 3.1 - Get ALL quizzes
const getAllQuizzes = function() {
  return db
    .query(`SELECT
             quizzes.id,
             title,
             description,
             cut_note,
             time_limit,
             url_quiz_image,
             owner_id,
             users.name
            FROM quizzes
            INNER JOIN users ON quizzes.owner_id = users.id;
            `)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving all quizzes', err.message);
    });
};
exports.getAllQuizzes = getAllQuizzes;


// 3.2 - Get quizz by quiz id
const getQuizByQuizId = function(id) {
  //console.log("getQuizByQuizId", id);
  return db
    .query(`SELECT
             quizzes.id,
             title,
             description,
             cut_note,
             time_limit,
             url_quiz_image,
             owner_id,
             users.name
            FROM quizzes
            INNER JOIN users ON quizzes.owner_id = users.id
            WHERE quizzes.id = $1;`, [id])
    .then((result) => {
      let obj = result.rows[0].id;
      if (obj === undefined) {
        return null;
      } else {
        //console.log("database", result.rows);
        return result.rows;
      }
    })
    .catch((err) => {
      console.log('Error retrieving a quiz - id', err.message);
    });
};
exports.getQuizByQuizId = getQuizByQuizId;


/**
 * 3.3 - Insert a new quiz to the database
 * @param {{}} newQuiz An object containing all of the Quiz details.
 * @return {Promise<{}>} A promise to the quiz.
 */
const insertQuiz = function(newQuiz) {
  return db.query(`INSERT
                  INTO quizzes (title, description, cut_note, time_limit, url_quiz_image, owner_id)
                  VALUES ($1, $2, $3, $4, $5, $6)
                  RETURNING *;`, [newQuiz.title, newQuiz.description, newQuiz.cut_note, newQuiz.time_limit, newQuiz.url_quiz_image, newQuiz.owner_id]
  )
    .then(res => {
      //console.log(res.rows);
      return res.rows;
    })
    .catch(err => {
      console.log('Error adding a new quiz', err.message);
    }
    );
};
exports.insertQuiz = insertQuiz;

/**
 * 3.4 - Update a quiz to the database giving the quiz id
 * @param {{}} quizUpdate An object containing all of the quiz details.
 * @return {Promise<{}>} A promise to the quiz.
 */

const updateQuiz = function(quizId, quizUpdate) {
  return db.query(`UPDATE quizzes
                   SET title=$1, description=$2, cut_note=$3, time_limit=$4, url_quiz_image=$5, owner_id=$6
                   WHERE id = $7
                   RETURNING *;`, [quizUpdate.title, quizUpdate.description, quizUpdate.cut_note, quizUpdate.time_limit, quizUpdate.url_quiz_image, quizUpdate.owner_id, quizId])
    .then(res => {
      //console.log(res.rows[0]);
      return res.rows[0];
    })
    .catch(err => {
      console.log('Error updating a quiz', err.message);
    }
    );
};
exports.updateQuiz = updateQuiz;

/**
 * 3.4 - Delete a quiz from the database by given quiz id
 * @param {{}} quizId An object containing all of the Quiz details.
 * @return {Promise<{}>} A promise to the quiz.
 */

const deleteQuiz = function(quizId) {
  return db.query(`DELETE FROM quizzes
                   WHERE id = $1;`, [quizId])
    .then(res => {
      if (res.rowCount === 0) {
        return null;
      } else {
        return 1;
      }
    })
    .catch(err => {
      console.log('Error deleting a quiz', err.message);
    }
    );
};
exports.deleteQuiz = deleteQuiz;

/** 04_search_questions_by_quizzes.sql
 * Get a all questions from quiz id from the database. (with alternatives)
 * @param {String} id The id of the quiz.
 * @return {Promise<{}>} A promise to the user.
 */
const getQuestionsByQuizId = function(id) {
  return db
    .query(`SELECT\
            quizzes.title, url_picture_link, questions.id, question
            FROM questions
            INNER JOIN quizzes ON questions.quiz_id = quizzes.id
            WHERE quiz_id = $1
            ORDER BY questions.id`, [id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving question - quiz.id', err.message);
    });
};
exports.getQuestionsByQuizId = getQuestionsByQuizId;

/** 04.1 Search All Questions
 * Get a all questions from all quizzes .
 * @param {String} id The id of the quiz.
 * @return {Promise<{}>} A promise to the user.
 */
const getAllQuestions = function() {
  return db
    .query(`SELECT
            questions.id, question, url_picture_link, quiz_id, quizzes.title
            FROM questions
            INNER JOIN quizzes ON questions.quiz_id = quizzes.id;`)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving all questions', err.message);
    });
};
exports.getAllQuestions = getAllQuestions;

/** 04.2 Insert a new question to the database
 * create a new question linked to specific quiz in database.
 * @param {String} newQuestion is an object with all data.
 * @return {Promise<{}>} A promise to the user.
 */
const insertQuestion = function(newQuestion) {
  return db
    .query(`INSERT INTO questions (question, url_picture_link, quiz_id)
            VALUES ($1, $2, $3)
            RETURNING *;`, [newQuestion.question, newQuestion.url_picture_link, newQuestion.quiz_id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error inserting question - quiz.id', err.message);
    });
};
exports.insertQuestion = insertQuestion;

/**
 * 4.3 - Update a question to the database giving the question id
 * @param {{}} questionUpdate An object containing all of the question details.
 * @return {Promise<{}>} A promise to the question.
 */

const updateQuestion = function(questionId, questionUpdate) {
  return db.query(`UPDATE questions
                  SET question=$1, url_picture_link=$2, quiz_id=$3
                  WHERE id = $4
                  RETURNING *;`, [questionUpdate.question, questionUpdate.url_picture_link, questionUpdate.quiz_id, questionId])
    .then(res => {
      //console.log(res.rows[0]);
      return res.rows[0];
    })
    .catch(err => {
      console.log('Error updating a question', err.message);
    }
    );
};
exports.updateQuestion = updateQuestion;

/**
 * 4.4 - Delete a question from the database by given quiz id
 * @param {{}} questionId An object containing all of the Quiz details.
 * @return {Promise<{}>} A promise to the quiz.
 */

const deleteQuestion = function(questionId) {
  return db.query(`DELETE FROM questions
                  WHERE id = $1;`, [questionId])
    .then(res => {
      if (res.rowCount === 0) {
        return null;
      } else {
        return 1;
      }
    })
    .catch(err => {
      console.log('Error deleting a question', err.message);
    }
    );
};
exports.deleteQuestion = deleteQuestion;

/** 05_search_alternatives_by_question_id.sql
 * Get a all questions from quiz id from the database.
 * @param {String} id The id of the quiz.
 * @return {Promise<{}>} A promise to the user.
 */
const getAlternativesByQuestionId = function(id) {
  return db
    .query(`SELECT id, question_id, alternative, is_correct
            FROM alternatives
            WHERE question_id = $1;`, [id])
    .then((result) => {
      //console.log("database", result.rows[0]);
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getAlternativesByQuestionId = getAlternativesByQuestionId;

/** 05.1 Search All alternatives by question
 ** Get a all alternatives from question id from the database.
 *
 * @return {Promise<{}>} A promise to the question.
 */
const getAllAlternatives = function() {
  return db
    .query(`SELECT questions.question, alternatives.id, question_id, alternative, is_correct
            FROM alternatives
            INNER JOIN questions ON questions.id = alternatives.question_id;`)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving alternatives', err.message);
    });
};
exports.getAllAlternatives = getAllAlternatives;

/** 05.2 search_alternatives_by_alternative_id.sql
 * Get a all questions from quiz id from the database.
 * @param {String} id The id of the quiz.
 * @return {Promise<{}>} A promise to the user.
 */
const getAlternativesByAlternativeId = function(id) {
  return db
    .query(`SELECT questions.question,alternatives.id, question_id, alternative, is_correct
            FROM alternatives
            INNER JOIN questions ON questions.id = alternatives.question_id
            WHERE alternatives.id = $1;`, [id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getAlternativesByAlternativeId = getAlternativesByAlternativeId;
/** 5.3 Insert a new alternative to the database
 * create a new alternative linked to specific question in database.
 * @param {String} newAlternative is an object with all data.
 * @return {Promise<{}>} A promise to the user.
 */
const insertAlternative = function(newAlternative) {
  //console.log("newAlternative", newAlternative);
  return db
    .query(`INSERT INTO alternatives (question_id, alternative, is_correct)
            VALUES ($1, $2, $3)
            RETURNING *;`, [newAlternative.question_id, newAlternative.alternative, Boolean(newAlternative.is_correct)])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error inserting Alternative', err.message);
    });
};
exports.insertAlternative = insertAlternative;

/**
 * 5.4 - Update a alternative to the database giving the alternative id
 * @param {{}} alternativeUpdate An object containing all of the question details.
 * @return {Promise<{}>} A promise to the question.
 */

const updateAlternative = function(alternativeId, alternativeUpdate) {
  return db.query(`UPDATE alternatives
                  SET question_id=$1, alternative=$2, is_correct=$3
                  WHERE id = $4
                  RETURNING *;`, [alternativeUpdate.question_id, alternativeUpdate.alternative, alternativeUpdate.is_correct, alternativeId])
    .then(res => {
      //console.log(res.rows[0]);
      return res.rows[0];
    })
    .catch(err => {
      console.log('Error updating a question', err.message);
    }
    );
};
exports.updateAlternative = updateAlternative;

/**
 * 5.5 - Delete a alternative from the database by given alternative id
 * @param {{}} alternativeId An integer with alternative id.
 * @return {Promise<{}>} A promise to the alternative.
 */

const deleteAlternative = function(alternativeId) {
  return db.query(`DELETE FROM alternatives
                  WHERE id = $1;`, [alternativeId])
    .then(res => {
      if (res.rowCount === 0) {
        return null;
      } else {
        return 1;
      }
    })
    .catch(err => {
      console.log('Error deleting an alternative', err.message);
    }
    );
};
exports.deleteAlternative = deleteAlternative;


/** 07 Check correct answers by quiz id
 ** Get a all questions and correct alternatives from the database by quiz id.
 * @param {String} quizId The id of the quiz.
 * @return {Promise<{}>} A promise to the question.
 */
const getQuizCorrectAlternatives = function(quizId) {
  return db
    .query(`SELECT questions.question, alternatives.id, question_id, alternative, is_correct
            FROM alternatives
            INNER JOIN questions ON questions.id = alternatives.question_id
            WHERE questions.quiz_id = $1;`, [quizId])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving alternatives', err.message);
    });
};
exports.getQuizCorrectAlternatives = getQuizCorrectAlternatives;

/** 07.1 Search All answers
 ** Get a all answers from test id from the database.
 *
 * @return {Promise<{}>} A promise to the answers.
 */
 const getAllAnswers = function() {
  return db
    .query(`SELECT question_id, alternative_id, test_id
            FROM answers
            ORDER BY question_id;`)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving alternatives', err.message);
    });
};
exports.getAllAnswers = getAllAnswers;

/** 07.2 get all answers by test id
 * Get a all answers from test id from the database.
 * @param {String} id The id of the quiz.
 * @return {Promise<{}>} A promise to the answer.
 */
const getAnswersByTestId = function(id) {
  return db
    .query(`SELECT question_id, alternative_id, test_id
            FROM answers
            WHERE test_id = $1
            ORDER BY question_id;`, [id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getAnswersByTestId = getAnswersByTestId;
/** 7.3 Insert a new answer to the test from database
 * create a new answer linked to test table in database.
 * @param {String} newAnswer is an object with all data.
 * @return {Promise<{}>} A promise to the user.
 */
const insertAnswer = function(newAnswer) {
  //console.log("newAnswer", newAnswer);
  return db
    .query(`INSERT INTO answers (question_id, alternative_id, test_id)
            VALUES ($1, $2, $3)
            RETURNING *;`, [newAnswer.question_id, newAnswer.alternative_id, newAnswer.test_id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error inserting Alternative', err.message);
    });
};
exports.insertAnswer = insertAnswer;

/**
 * 7.4 - Update a answer to the database giving the test_id and question_id
 * @param {{}} answerUpdate An object containing all of the question details.
 * @return {Promise<{}>} A promise to the question.
 */

const updateAnswer = function(answerUpdate) {
  return db.query(`UPDATE answers
                  SET question_id=$2
                  WHERE question_id = $1 and test_id = $3
                  RETURNING *;`, [answerUpdate.question_id, answerUpdate.alternative_id, answerUpdate.test_id])
    .then(res => {
      //console.log(res.rows[0]);
      return res.rows[0];
    })
    .catch(err => {
      console.log('Error updating a question', err.message);
    }
    );
};
exports.updateAnswer = updateAnswer;
/**
 * 7.5 - Delete a answer from the database by given answer id
 * @param {{}} answerId An integer with alternative id.
 * @return {Promise<{}>} A promise to the alternative.
 */

const deleteAnswers = function(answerId) {
  return db.query(`DELETE FROM answers
                  WHERE id = $1;`, [answerId])
    .then(res => {
      if (res.rowCount === 0) {
        return null;
      } else {
        return 1;
      }
    })
    .catch(err => {
      console.log('Error deleting an alternative', err.message);
    }
    );
};
exports.deleteAnswers = deleteAnswers;
/** 08_quiz_average.sql
 * Calculates the average of the all results from a specific quiz
 * given the quiz id. returns (1 = 100%)
 * @param {String} id The id of the quiz.
 * @return {Promise<{}>} A promise to the user.
 */
const quizAverage = function(quizId) {
  return db
    .query(`SELECT AVG(users_results) AS average_result
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
          GROUP BY users.name) AS users_results; `, [quizId])
    .then((result) => {
      //console.log("database", result.rows[0]);
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.quizAverage = quizAverage;

/** 09_search_tests_by_user_id.sql
 * Get a all user quizzes made by the user given their id.
 * @param {String} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getTestsByUser = function(userId) {
  //console.log("userId", userId);
  return db
    .query(`SELECT id, user_id, quiz_id, date_created, finish_date
            FROM tests
            WHERE user_id = $1;`, [userId])
    .then((result) => {
      //console.log("database", result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getTestsByUser = getTestsByUser;

/** 09.1 all tests
 * Get a all tests made by users.
 * @param {String} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getAllTests = function() {
  return db
    .query(`SELECT tests.id, user_id, quiz_id, date_created, finish_date,
            users.name, quizzes.title
            FROM tests
            INNER JOIN users ON tests.user_id = users.id
            INNER JOIN quizzes ON tests.quiz_id = quizzes.id;
            `)
    .then((result) => {
      //console.log("database", result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getAllTests = getAllTests;
/** 9.2 Insert a new test to the database
 * create a new test linked to specific question in database.
 * @param {String} newTest is an object with all data.
 * @return {Promise<{}>} A promise to the user.
 */
const insertTest = function(newTest) {
  //console.log("newTest", newTest);
  return db
    .query(`INSERT INTO tests (user_id, quiz_id, date_created)
            VALUES ($1, $2, current_timestamp)
            RETURNING *;`, [newTest.user_id, newTest.quiz_id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error inserting Alternative', err.message);
    });
};
exports.insertTest = insertTest;

/**
 * 9.3 - Update a test to the database giving the test id
 * @param {{}} testUpdate An object containing all of the question details.
 * @return {Promise<{}>} A promise to the question.
 */

const updateTest = function(testId,testUpdate) {
  return db.query(`UPDATE tests
                   SET user_id = $1, quiz_id = $2, date_created = $3, finish_date = $4
                   WHERE id = $5;`, [testUpdate.user_id, testUpdate.quiz_id, testUpdate.date_created, testUpdate.finish_date, testId])
    .then(res => {
      //console.log(res.rows[0]);
      return res.rows[0];
    })
    .catch(err => {
      console.log('Error updating a question', err.message);
    }
    );
};
exports.updateTest = updateTest;

/**
 * 9.3 - Update a test Finish date to the database giving the test id
 * @param {{}} testId An object containing all of the question details.
 * @return {Promise<{}>} A promise to the question.
 */

const SetFinishDate = function(testId) { // It shows how long the user took to finish the quiz
  return db.query(`UPDATE tests
                   SET finish_date = current_timestamp
                   WHERE id = $1;`, [testId])
    .then(res => {
      //console.log(res.rows[0]);
      return res.rows[0];
    })
    .catch(err => {
      console.log('Error updating a question', err.message);
    }
    );
};
exports.SetFinishDate = SetFinishDate;

/**
 * 9.4 - Delete a test from the database by given test id
 * @param {{}} testId An integer with alternative id.
 * @return {Promise<{}>} A promise to the alternative.
 */

const deleteTest = function(testId) {
  return db.query(`DELETE FROM tests
                  WHERE id = $1;`, [testId])
    .then(res => {
      //console.log("Database", res);
      if (res.rowCount === 0) {
        return null;
      } else {
        return 1;
      }
    })
    .catch(err => {
      console.log('Error deleting an alternative', err.message);
    }
    );
};
exports.deleteTest = deleteTest;
/** 10_questions_right_answered_by_test_id.sql (The most)
 * Get the score of the most correct answered questions by quiz id.
 * returns a list
 * @param {String} id The id of the quiz.
 * @return {Promise<{}>} A promise to the user.
 */

const getEasyQuestions = function(quizId) {
  return db
    .query(`SELECT answers.question_id, COUNT(answers.question_id) AS easiest_questions
            FROM answers
            JOIN alternatives ON answers.alternative_id = alternatives.id
            JOIN questions ON alternatives.question_id = questions.id
            WHERE is_correct = true AND quiz_id = $1
            GROUP BY answers.question_id
            ORDER BY COUNT(answers.question_id) DESC; `, [quizId])
    .then((result) => {
      //console.log("database", result.rows[0]);
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getEasyQuestions = getEasyQuestions;

/** 11_most_difficult_questions_by_quiz_id.sql
 * Get the score of the hard questions by quiz id.
 * @param {String} id The id of the quiz.
 * @return {Promise<{}>} A promise to the user.
 */

const getHardQuestions = function(id) {
  return db
    .query(`SELECT answers.question_id, COUNT(answers.question_id) AS most_difficult_questions
            FROM answers
            JOIN alternatives
            ON answers.alternative_id = alternatives.id
            JOIN questions ON alternatives.question_id = questions.id
            WHERE is_correct = false AND quiz_id = $1
            GROUP BY answers.question_id
            ORDER BY COUNT(answers.question_id) DESC; `, [id])
    .then((result) => {
      //console.log("database", result.rows[0]);
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getHardQuestions = getHardQuestions;

/** 12_Calculate_user_result.sql
 * Calculates the score of the Test for a specific user.
 * @param {String} id The id of the quiz and user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserScore = function(userId, quizId) {
  return db
    .query(`SELECT
          (result.quiz_result * 100 ) AS score,
          CASE
            WHEN (result.quiz_result * 100) >= (SELECT quizzes.cut_note FROM quizzes WHERE quizzes.id = $2)
              THEN 'pass'
              ELSE 'fail'
            END AS result
            FROM (SELECT SUM(
            CASE
              WHEN alternatives.is_correct = true
              THEN
                (SELECT (SELECT 1 / count(*)::DECIMAL AS quiz_result
                FROM questions
                WHERE quiz_id = tests.quiz_id) / COUNT(*)::DECIMAL AS answer_weight
                FROM alternatives -- weight = 1 / number of correct alternatives
                WHERE is_correct = true AND question_id = answers.question_id)
              ELSE 0
            END) AS quiz_result
    FROM answers
    INNER JOIN tests ON answers.test_id = tests.id
    INNER JOIN alternatives ON answers.alternative_id = alternatives.id
    WHERE tests.user_id = $1 AND quiz_id = $2 AND alternatives.is_correct = true) AS result;`, [userId, quizId])
    .then((result) => {
      //console.log("database", result.rows[0]);
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getUserScore = getUserScore;

/** 13_Calculate_users_result_quiz.sql
 * List the total score of all users in a specific quiz.
 * @param {String} id The id of the quiz.
 * @return {Promise<{}>} A promise to the user.
 */

const getQuizScore = function(quizId) {
  return db
    .query(`SELECT users.name, SUM(
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
              GROUP BY users.name
              ORDER BY users_results DESC; `, [quizId])
    .then((result) => {
      //console.log("database", result.rows[0]);
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getQuizScore = getQuizScore;

/* Function INSERT INTO database */

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  let users = user;
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  //console.log("users", users);
  //console.log("user", user);
  // return db
  //   .query(`
  //   INSERT INTO users (name, email, password)
  //   VALUES ($1, $2, $3) RETURNING *;`, [user.name, user.email, user.password])
  //   .then((result) => result.rows)
  //   .catch((err) => {
  //     console.log('Error adding user', err.message);
  //   });
};
exports.addUser = addUser;
