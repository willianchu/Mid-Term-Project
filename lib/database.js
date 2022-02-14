require("dotenv").config();

const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams); // Can anyone help me ?
db.connect(); // I would like to take the connection directly from the server.js 

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
        console.log("database", result.rows);
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
        console.log("database", result.rows);
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

const getQuizzesByUserById = function(id) {
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
        console.log("database", result.rows);
        return result.rows;
      }
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getQuizzesByUserById = getQuizzesByUserById;

/** 04_search_questions_by_quizzes.sql
 * Get a all questions from quiz id from the database.
 * @param {String} id The id of the quiz.
 * @return {Promise<{}>} A promise to the user.
 */
const getQuestionsByQuizId = function(id) {
  return db
    .query(`SELECT
            id, question, url_picture_link, quiz_id
            FROM questions
            WHERE quiz_id = $1`, [id])
    .then((result) => {
      let obj = result.rows[0].id;
      if (obj === undefined) {
        return null;
      } else {
        console.log("database", result.rows);
        return result.rows;
      }
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getQuestionsByQuizId = getQuestionsByQuizId;

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
      console.log("database", result.rows[0]);
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getAlternativesByQuestionId = getAlternativesByQuestionId;

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
      console.log("database", result.rows[0]);
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

 const getTestsByUser = function(id) {
  return db
    .query(`SELECT id, user_id, quiz_id, date_created, finish_date 
            FROM tests 
            WHERE user_id = $1;`, [id])
    .then((result) => {
      console.log("database", result.rows[0]);
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getTestsByUser = getTestsByUser;

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
      console.log("database", result.rows[0]);
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
      console.log("database", result.rows[0]);
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
    .query(`SELECT SUM(
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
            WHERE tests.user_id = $1 AND quiz_id = $2 AND alternatives.is_correct = true; `, [userId, quizId])
    .then((result) => {
      console.log("database", result.rows[0]);
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
      console.log("database", result.rows[0]);
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving user quizzes - id', err.message);
    });
};
exports.getQuizScore = getQuizScore;