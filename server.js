// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const database = require('./lib/database');

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();
// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const widgetsRoutes = require("./routes/widgets");
const quizzesRoutes = require("./routes/quizzes");
const testsRoutes = require("./routes/tests");
const alternativesRoutes = require("./routes/alternatives");
// const widgets = require("./routes/widgets"); same as above

const answersRoutes = require("./routes/answers");
const questionsRoutes = require("./routes/questions");
const { render } = require("express/lib/response");
const questions = require("./routes/questions");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/api/quizzes", quizzesRoutes(db));
app.use("/api/answers", answersRoutes(db));
app.use("/api/questions", questionsRoutes(db));
app.use("/api/tests", testsRoutes(db));
app.use("/api/alternatives", alternativesRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  Promise.all([
    database.getAllQuizzes(),
    database.getAllTests(),
  ])
  .then((data) => {
    const userId = req.session.user_id;
    const quizzes = data[0];
    const tests = data[1].filter(item => (item.user_id === Number(userId)));
    const templateVars = { quizzes, tests, userId };
    res.render("index", templateVars);
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

app.get("/quizzes/:id", (req, res) => {
  Promise.all([
    database.getQuizByQuizId(req.params.id),
    database.getQuestionsByQuizId(req.params.id),
    database.getAllAlternatives(),
  ])
  .then((data) => {
    const quiz = data[0];
    const questions  = data[1];
    const alternatives = data[2];
    const error = ""
    for(let question of questions){
      let currentAlternative = alternatives.filter(el =>el.question_id === question.id);
      question["alternatives"] = currentAlternative;
    }
    const userId = req.session.user_id;
    let templateVars = {quiz, questions, userId, error};
    res.render("quizzes", templateVars)
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });
});
app.post("/quizzes/:id", (req, res) => {
  let testId;
 database.getQuestionsByQuizId(req.params.id)
 .then(questions => {
   if(questions.length === Object.keys(req.body).length) {
     database.insertTest({
    'user_id': Number(req.session.user_id),
    'quiz_id': Number(req.params.id),
  })
  .then((newTest) => {
    testId = Number(newTest[0].id);
    for (const questionKey in req.body) {
      const questionId = Number(questionKey.split('-')[1]);
      const alternativeId = Number(req.body[questionKey]);
      const answers = {
        'question_id': questionId,
        'alternative_id': alternativeId,
        'test_id': testId,
      }
      console.log(answers)

      database.insertAnswer(answers);
    }
    res.redirect(`/results/${testId}`);
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });
   }else{
    Promise.all([
      database.getQuizByQuizId(req.params.id),
      database.getQuestionsByQuizId(req.params.id),
      database.getAllAlternatives(),
    ])
    .then((data) => {
      const quiz = data[0];
      const questions  = data[1];
      const alternatives = data[2];
      const error = "Please answer all questions!"
      for(let question of questions){
        let currentAlternative = alternatives.filter(el =>el.question_id === question.id);
        question["alternatives"] = currentAlternative;
      }
      const userId = req.session.user_id;
      let templateVars = {quiz, questions, userId, error};
      res.render("quizzes", templateVars)
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
   }
 })

});

app.get("/login/:id", (req, res) => {
  req.session.user_id = req.params.id;
  res.redirect("/");
});

app.get("/tests/:id", (req, res) => {
  database.getTestsByTestId(req.params.id)
    .then((data) => { // retrieve test data
      const test = data;
      const userId = test.user_id;
      Promise.all([ // get Stats
        database.getQuizByQuizId(test.quiz_id),// get quiz data
        database.quizAverage(test.quiz_id), //
        database.getQuizScore(test.quiz_id),// get quiz score of all users
        database.getUserScore(test.user_id, test.quiz_id), // get user score
        database.getQuizCorrectAlternatives(test.quiz_id) // get correct alternatives
      ])
        .then((data) => {
          const quizAverage = data[0];
          const quizScore = data[1];
          const userScore = data[2];
          const quiz = data[3];
          const correctAlternatives = data[4];
          const templateVars = {quizAverage, quizScore, userScore, quiz, correctAlternatives, userId};
          console.log(correctAlternatives);
          res.render("tests", templateVars);
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

app.post("/create", (req, res) => {
  let quizTitle;
  let isUnlisted = false;
  let questions = {};
  console.log(req.body);
  for (const key in req.body) {
    console.log(key);
    if (key === 'quiz-title') {
      quizTitle = req.body[key];
    } else if (key.startsWith("question")) {
      const keyInfo = key.split('-');
      const questionKey = keyInfo[1];
      if (keyInfo[2] === 'title') {
        questions[questionKey] = {
          'title': req.body[key],
          'options': [],
          'answer': '',
        };
      } else if (keyInfo[2] === 'option') {
        questions[questionKey]['options'].push(req.body[key]);
      } else if (keyInfo[2] === 'answer') {
        questions[questionKey]['answer'] = Number(keyInfo[3]);
      }
    } else if (key === 'unlisted_checkbox' && req.body[key] === 'on') {
      isUnlisted = true;
    }
  }
  const userId = req.session.user_id;
  console.log('Quiz Title:', quizTitle);
  console.log('Quiz Unlisted:', isUnlisted);
  console.log('Questions:', questions);
  const quiz = {
    'title': quizTitle,
    'owner_id': userId,
    'is_unlisted': isUnlisted
  }
  database.insertQuiz(quiz).then((newQuiz) => {
    const quizId = Number(newQuiz[0].id);
    for (const questionKey in questions) {
      database.insertQuestion({
        'question': Number(questionKey),
        'quiz_id': quizId
      }).then((newQuestion) => {
        const questionId = Number(newQuestion[0].id);
        for (let opInd = 0; opInd < questions[questionKey]['options'].length; opInd ++) {
          database.insertAlternative({
            'question_id': questionId,
            'alternative': questions[questionKey]['options'][opInd],
            'is_correct': (opInd === questions[questionKey]['answer'])
          });
        }
      });
    }
  });
  res.redirect('/');
});

app.post("/list/:quiz_id", (req, res) => {
  database.updateQuizIsUnlisted(Number(req.params.quiz_id), false);
  res.redirect('/');
})

app.post("/unlist/:quiz_id", (req, res) => {
  database.updateQuizIsUnlisted(Number(req.params.quiz_id), true);
  res.redirect('/');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
