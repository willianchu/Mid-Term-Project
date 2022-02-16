# QUIZ APP - Brainstorm

Here are some notes to help develop our **QUIZ** app. Fell free to share any info about. 


# Files



## Create files and folders



## Database
 - I missed something or modeling wrong?
#### Login
- Users (we only create the users as so far in the bootcamp/ we dont edit or delete accounts)
- The passwords will be decrypted for study purposes

#### Entities
In user-stories we found **nouns:**  user, quiz, questions, answers (quiz), results.
It will be created 5 entities as below (grouped quiz and questions), the sixth option result will be calculated.
!["ERD"](https://github.com/BlakeSartin/Mid-Term-Project/blob/master/planning/img/ERD.jpg)

1. users
- id	--PK
- name
- email
- -password (uncrypted)

2. quizzes
- id --PK
- cut_note (to know if passed or not)
- owner_id -- FK
- title
- description
- time_limit (time to do the quiz - pending) * I had a bad experience in timed tests. I did a proficiency test and their timer didn't expect asynchronous aspect in audio questions. When youtube was not working yet the timer was running out.
- url_quiz_image

3. questions
- id --PK
- question (one or more per quiz)
- url_picture_link (optional)
- quiz_id -- FK

4. alternatives
- id --PK
- alternative
- is_correct (boolean)
- question_id -- FK

5. tests (quiz_answers)
- id --PK
- user_id  -- FK
- quiz_id  -- FK
- date_created
- finish_date

5. answers
- id --PK
- question_id
- user_answer
- test_id -- FK

### notes
- Quizzes (create/update questions, delete quizzes)
- Quiz_answers (With them we could know what question is more easy, which is harder.)
- Could show how many times that user did the same quiz (like in lighthouse)
- Users that did the quiz could know the percentage that they did.
- The average of correct answers 
- how many people are above the average
- how many are below (These stats help the owner balance the Quiz)
- The easiest questions (more correct answers)
- The hard questions (more mistakes)

#### Queries (updated february 15th)

- 01 search user by email
  getUserByEmail() - get a single user by its email

- 02 search user by id
  getUserById() - get a single user by its user id

- 03 search quizzes by owner (user)
  getQuizzesByUserId - get all quizzes by user id
  *3.1 - getAllQuizzes() - get all quizzes
  *3.2 - getQuizzesByUserId() - get all quizzes by user id
  *3.3 - insertQuiz() - insert a new quiz
  *3.4 - updateQuiz() - update a quiz
  *3.5 - deleteQuiz() - delete a quiz

- 04 search questions by quizzes
  4.1 - getAllQuestions() - get all questions
  4.2 - insertQuestion() - insert a new question
  4.3 - updateQuestion() - update a question
  4.4 - deleteQuestion() - delete a question

- 05 getAlternativesByQuestionId() - get the alternatives by question id
  *5.1 - getAllAlternatives() - get all alternatives
  *5.2 - getAlternativesByAlternativeId() - get all alternatives by alternative id
  *5.3 - insertAlternative() - insert a new alternative
  *5.4 - updateAlternative() - update a alternative
  *5.5 - deleteAlternative() - delete a alternative

- 07 getQuizCorrectAlternatives() - get a complete quiz by quiz id (returns all questions and alternatives) - asked to final results

- 08 calculate average of the test for given quiz - quizAverage() - get the average of the test for given quiz made for all users.

- 09 search tests by users - getTestsByUser()
  *9.1 - getAllTests() - get all tests
  *9.2 - insertTest() - insert a new test
  *9.3 - updateTest() - update a test
  *9.4 - deleteTest() - delete a test

- 10 getEasyQuestions() - get the easiest questions for a quiz (get a list of questions with more correct answers)
- 11 getHardQuestions() - get the hard questions for a quiz (get a list of questions that have the most mistakes)
- 12 getUserScore() - get the user score for a quiz (returns the percentage of correct answers - 0 to 1)
- 13 getQuizScore() - get the quiz score for a quiz (returns a list of users and their score in percentage)


## Interface



## Routes


# Github strategies

