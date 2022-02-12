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
!["ERD"](https://github.com/BlakeSartin/Mid-Term-Project/tree/master/planning/img)

1. users
- id	--PK
- name
- email
- -password (uncrypted)

2. quizes
- id --PK
- questions_id
- cut_note (to know if passed or not)
- owner_id -- FK
- time (time to do the quiz - pending) * I had a bad experience in timed tests. I did a proeficiency test and their timer didn't expect asyncrounous aspect in audio questions. When youtube was not working yet the timer was running out.

3. questions
- id --PK
- questions (one or more per quiz)
- url_questions_picture (optional)
- options (one or more for each questions)
- correct answer (1 or more)

4. tests quiz_answers
- id --PK
- user_id  -- FK
- quiz_id  -- FK
- answer_id -- FK

5. answers
- id --PK
- question_id
- user_answer

### notes
- Quizes (create/update questions, delete quizes)
- Quiz_answers (With them we could know what question is more easy, wich is harder.)
- Could show how many times that user did the same quiz (like in lighthouse)
- Users that did the quiz could know the percentage that they did.
- The average of correct answers 
- how many people are above the average
- how many are below (These stats help the owner balance the Quiz)
- The easiest questions (more correct answers)
- The hard questions (more mistakes)


## Interface



## Routes


# Github strategies

