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

#### Queries

- 01 search user by email 
- 02 search user by id
- 03 search quizzes by owner (user)
- 04 search questions by quizzes
- 05 search alternatives by question
- 06 calculate correct answer for given question
- 061 total question alternatives
- 062 total question correct alternatives 
- 07 calculate correct questions for given quiz
- 08 calculate average of the test for given quiz
- 09 search tests by users
- 10 calculate the easiest question of the quiz
- 11 calculate the hard question of the quiz
- 12 calculate a single user result by quiz;
- 13 search all users results by quiz (order by result)


## Interface



## Routes


# Github strategies

