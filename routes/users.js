const express = require('express');
const router = express.Router();
const path = require('path');
const data = require('../data');
const { getGarageByOwner } = require('../data/garages');
const { checkUser, createUser, getUserByEmail, getUserById } = require('../data/users');
const garageData = data.get;

router
  .route('/login')
  .post(async (req, res) => {
    //code here for POST
    const email = req.body.emailInput;
    const password = req.body.passwordInput;
    try {
        if (!email) throw "No email provided";
        if (!password) throw "No password provided";

        // email

        if (typeof(email) != 'string') throw "email not string";
        let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (emailRegex.test(email.trim())) {

        }
        const emailToSubmit = email.toLowerCase();

        // password

        if (typeof(password) != 'string') throw "Password not string";
        var passTest = /^\S*$/.test(password);
        if (!passTest) throw "Space in password. Not allowed."
        if (password.length < 6) throw "Password less than 6 char long."


        passTest = /(?=.*[A-Z])(?=.*\d)(?=.*\W)/.test(password);
        if (!passTest) throw "Password must have uppercase letter, digit, and special character."

        const loginCheck = await checkUser(emailToSubmit, password);
        if (loginCheck.authenticatedUser == true) {
            const tempUser = await getUserByEmail(emailToSubmit);
            req.session.user = tempUser;
            req.session.email = tempUser.email;
            req.session.user_id = tempUser._id;
            const ownerTest = await getGarageByOwner(tempUser._id.toString());
            if (ownerTest) {
                req.session.isOwner = true;
            }
            res.redirect('/');
        } else {
            res.render('login', {'title': 'Login', 'isOwner': req.session.isOwner, 'logged_in': req.session.user, 'error': "Invalid email pass combo", 'user_email': req.session.email,})
        }
    }
    catch (e) {
        console.log(e);
        res.status(400).render('login', {'title': 'Login', 'isOwner': req.session.isOwner, 'logged_in': req.session.user, 'error': e});
    }
  })

router.route('/register').post(async (req, res) => {
    const email = req.body.emailInput;
    const password = req.body.passwordInput;
    const name = req.body.nameInput;

    console.log("start of func");
    try {
        if (!name) throw "No name provided";
        if (!password) throw "No password provided";
        if (!email) throw "No email provided";
        // name
  
        if (typeof(name) != 'string') throw "name not string";
        let nameRegex = /([A-Za-z]+[ ][A-Za-z]+)/;
        if (!nameRegex.test(name.trim())) throw "name not in correct form"

        // email

        if (typeof(email) != 'string') throw "email not string";
        let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email.trim())) throw "not valid email";
        const emailToSubmit = email.trim().toLowerCase();

        // password

        if (typeof(password) != 'string') throw "Password not string";
        var passTest = /^\S*$/.test(password);
        if (!passTest) throw "Space in password. Not allowed."
        if (password.length < 6) throw "Password less than 6 char long."

        passTest = /(?=.*[A-Z])(?=.*\d)(?=.*\W)/.test(password);
        if (!passTest) throw "Password must have uppercase letter, digit, and special character."
  
        const registerCheck = await createUser(name.trim().toLowerCase(), emailToSubmit, password);
        if (registerCheck) {
            console.log("redirecting to login?");
            res.redirect('/login'); 
        } else {
          res.status(500).send("Internal Server Error");
        }
      }
      catch (e) {
        res.status(400).render('register', {'title': 'Login', 'isOwner': req.session.isOwner, 'logged_in': req.session.user, 'error': e});
      }
})

router.get('/logout', async (req, res) => {
    req.session.destroy();
    //res.send('Logged out');
    console.log('redirecting to Homepage');
    res.redirect('/'); 
});

router
    .route('/user_profile')
    .get(async (req, res) => {
        if (!req.session.user) {
            res.status(401).redirect('/');
        } else {
            res.render('userProfile', {'title': 'Profile', 'isOwner': req.session.isOwner, 'logged_in': req.session.user, 'user_email': req.session.email, 'user': req.session.user});
        }
    })


module.exports = router;
