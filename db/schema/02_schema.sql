DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS alternatives CASCADE;
DROP TABLE IF EXISTS tests CASCADE;
DROP TABLE IF EXISTS answers CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cut_note INTEGER,
  time_limit INTEGER,
  url_quiz_image VARCHAR(255),
  owner_id INTEGER REFERENCES users(id)
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY NOT NULL,
  question TEXT NOT NULL,
  url_picture_link TEXT NOT NULL,
  quiz_id INTEGER REFERENCES quizzes(id)
);

CREATE TABLE alternatives (
  id SERIAL PRIMARY KEY NOT NULL,
  alternative TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  question_id INTEGER REFERENCES questions(id)
);

CREATE TABLE tests (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  quiz_id INTEGER REFERENCES quizzes(id),
  date_created TIMESTAMP,
  finish_date TIMESTAMP
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY NOT NULL,
  question_id INTEGER NOT NULL,
  alternative_id INTEGER NOT NULL,
  test_id INTEGER REFERENCES tests(id)
);


