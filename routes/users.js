import { Router } from 'express';
import { userLogin, userCreate, fetchStudentDashboard, fetchQuizFromId, saveUserScore } from '../src/service/userService';
// import dataQ from '../data/jsch1.json';

const router = Router();

// auth function redirect to login page if no session found
function auth(req, res, next) {
  if (req.session && req.session.user) {
    next();
  }
  else {
    res.redirect('/');
  }
}

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
  console.log(`debug : singup ${JSON.stringify(req.body)}`);
  // res.send();

  userLogin(req.body)
    .then((result) => {
      // session add here
      // redirect to student dashboard
      // console.log(result);
      if (result) {
        // res.render('studentDashboard', {
        //   title: 'student Dashboard',
        //   user: {
        //     username: 'sumeet',
        //   },
        // });
        req.session.user = result;
        res.redirect('/users/dashboard');

      }
      else {
        res.render('index', { title: ' Index', loginError: true });
      }
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      // handle invalid credital here
      res.render('index', { title: ' Index', loginError: true });
    });
});

router.post('/signup', (req, res, next) => {
  console.log(`debug : singup ${JSON.stringify(req.body)}`);
  // res.send();
  userCreate(req.body)
    .then((result) => {
      res.render('index', {
        title: ' Index',
        signupError: false,
        loginError: false,
        signupSuccess: true,
      });
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      res.render('index', {
        title: ' Index',
        signupError: true,
        loginError: false,
      });
    });
});

router.get('/dashboard', auth, (req, res, next) => {
  console.log('from session');
  console.log(req.session.user);
  fetchStudentDashboard(req.session.user.email)
    .then((result) => {
      console.log('hahah');
      console.log(result);
      const { quizList, scoreData } = result;
      res.render('studentDashboard', {
        title: 'student dashboard',
        user: req.session.user,
        quizList,
        scoreData,
      });
    });
});


router.get('/quiz/:id', auth, (req, res, next) => {

  console.log(req.params.id);
  let quizId = req.params.id;
  fetchQuizFromId(quizId)
    .then((dataQ) => {
      // console.log(dataQ);

      req.session.quizname = dataQ.quizname;
      req.session.quizId = dataQ._id;

      res.render('studentQuiz', {
        title: 'student dashboard',
        user: req.session.user,
        dataQ,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/savescore', auth, (req, res, next) => {

  const scoreStr = req.query.scoreStr;
  console.log(scoreStr);
  console.log(req.session.quizname);
  console.log(req.session.quizId);

  saveUserScore(scoreStr, req.session.quizname, req.session.quizId, req.session.user)
    .then((result) => {
      console.log(`/savescore ${result}`);
      res.status(200);
      res.end();
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/logout', auth, (req, res, next) => {
  req.session.user = null;
  req.session.quizname = null;
  req.session.quizid = null;

  res.redirect('/');
});

export default router;
