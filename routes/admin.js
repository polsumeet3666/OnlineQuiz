import { Router } from 'express';
import { readFile } from 'fs';

import { adminLogin, uploadTest, fetchAdminDashboardData } from '../src/service/adminService';

const router = new Router();

const pageData = {
    title: '',
    content: {},
    errorMsg: false,
};
// auth function redirect to login page if no session found
function auth(req, res, next) {
    if (req.session && req.session.admin) {
        next();
    }
    else {
        res.redirect('/admin');
    }
}

// landing page for admin
router.get('/', (req, res, next) => {
    res.render('adminLogin', pageData);
});

// process admin login
router.post('/login', (req, res, next) => {
    // console.log(req.body)
    adminLogin(req.body.email, req.body.password)
        .then((result) => {
            console.log(result);
            if (result) {
                req.session.admin = result;
                res.redirect('/admin/dashboard');
            }
            else {
                console.log('else');
                res.render("adminLogin", {
                    title: 'Admin | Login',
                    errorMsg: true,
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.render("adminLogin", {
                title: 'Admin | Login',
                errorMsg: true,
            });
        });
});

router.get('/dashboard',auth, (req, res, next) => {

    fetchAdminDashboardData()
    .then((result) => {
        let { quizData , scoreData} = result;
        res.render('adminDashboard', {
            title: 'Admin | Dashboard',
            user: req.session.admin,
            quiz: quizData,
            scoreData,
        });
    })
    .catch((error) => {
        res.render('adminDashboard', {
            title: 'Admin | Dashboard',
            user: {},
            quiz: [],
        });
    });
});

router.post('/uploadTest', (req, res, next) => {
    console.log(req.files.test.path);
    uploadTest(req)
    .then((result) => {
        console.log(result);
        res.redirect('/admin/dashboard');
    })
    .catch((error) => {
        console.log(error);
        res.redirect('/admin/dashboard');
    });
});

router.get('/logout', auth, (req, res, next) => {
    
    req.session.admin = null;
    res.redirect('/admin/');
    next();
  });

export default router;
