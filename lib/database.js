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
        console.log("database", result.rows);
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
  console.log("getQuizByQuizId", id);
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
            WHERE quizzes.id = $1`, [id])
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
      console.log('Error retrieving a quiz - id', err.message);
    });
};
exports.getQuizByQuizId = getQuizByQuizId;


/**
 * 3.3 - Insert a new quiz to the database
 * @param {{}} newQuiz An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addNewQuiz = function(newQuiz) {
  return pool.query(`INSERT 
                     INTO properties (title, description, cut_note, time_limit, url_quiz_image, owner_id)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     RETURNING *;`, [newQuiz.title, newQuiz.description, newQuiz.cut_note, newQuiz.time_limit, newQuiz.url_quiz_image, newQuiz.owner_id]
  )
    .then(res => {
      console.log(res.rows[0]);
      return res.rows[0]})
    .catch(err => {
      console.log('Error adding a new quiz', err.message);
    }
    );
};
exports.addNewQuiz = addNewQuiz;

/**
 * 3.4 - Update a quiz to the database giving the quiz id
 * @param {{}} quizUpdate An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
 
const updateQuiz = function(quizUpdate) {
  return db.query(`UPDATE quizzes 
                   (title, description, cut_note, time_limit, url_quiz_image, owner_id)
                   VALUES ($1, $2, $3, $4, $5, $6)
                   WHERE id = $7
                   RETURNING *;`, [quizUpdate.title, quizUpdate.description, quizUpdate.cut_note, quizUpdate.time_limit, quizUpdate.url_quiz_image, quizUpdate.owner_id, quizUpdate.id])
    .then(res => {
      console.log(res.rows[0]);
      return res.rows[0];
    })
    .catch(err => {
      console.log('Error updating a quiz', err.message);
    }
    );
};
exports.updateQuiz = updateQuiz;

/**
 * 3.4 - Delete a quiz to the database by given quiz id
 * @param {{}} quizId An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
 
const deleteQuiz = function(quizId) {
  return db.query(`DELETE FROM quizzes
                  WHERE id = $1;`, [quizId])
    .then(res => {
      console.log(res.rows[0]);
      return res.rows[0];
    })
    .catch(err => {
      console.log('Error deleting a quiz', err.message);
    }
    );
};
exports.deleteQuiz = deleteQuiz;

/** 04_search_questions_by_quizzes.sql
 * Get a all questions from quiz id from the database.
 * @param {String} id The id of the quiz.
 * @return {Promise<{}>} A promise to the user.
 */
const getQuestionsByQuizId = function(id) {
  return db
    .query(`SELECT
            questions.id, question, url_picture_link, quiz_id,
            quizzes.title
            FROM questions
            INNER JOIN quizzes ON questions.quiz_id = quizzes.id
            WHERE quiz_id = $1`, [id])
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
            id, question, url_picture_link, quiz_id
            FROM questions`)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log('Error retrieving all questions', err.message);
    });
};
exports.getAllQuestions = getAllQuestions;

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
  console.log("users", users);
  console.log("user", user);
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