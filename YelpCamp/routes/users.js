const express = require('express');
const router = express.Router();
const passport = require('passport');
const isLoggedIn = require('../utilities/isLoggedIn.js')
const isLoggedOut = require('../utilities/isLoggedOut.js');
const storeReturnTo = require('../utilities/storeReturnTo.js');
const { renderRegisterForm, registerUser, renderLoginForm, loginUser, logoutUser } = require('../controllers/users.js');

router.route('/register')
    .get(isLoggedOut, renderRegisterForm)
    .post(isLoggedOut, registerUser);

router.route('/login')
    .get(isLoggedOut, renderLoginForm)
    .post(isLoggedOut, storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), loginUser);

router.post('/logout', isLoggedIn, logoutUser);

module.exports = router;