const express = require("express");
const router = express.Router();
const User = require("../models/user");
var session = require('express-session')
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.post("/auth/login", (req, res, next) => { // this login 
    // req.session.isloggedin=0
    const username = req.body.username; //these are the login form values
    const password = req.body.password;

    if (username === "" || password === "") { //username and password checks
        res.json({
            errorMessage: "No user name or password given"
        });
        return;
    }

    User.findOne({
            "username": username
        }) // checking if usename is in the DB
        .then(user => {
            if (!user) { //if not in DB send user back to login and throw error
                res.json({
                    errorMessage: "The username does not exists!"
                });
                return;
            }
            bcrypt.compare(password, user.password, (err, result) => { //bcrypt password check between user entered password and the password in the DB
                debugger
                if (result) {
                    // req.session.save()
                    // req.session.isloggedin = true // setting up the session and redirecting the use to the main page
                    req.session.user = user // storing user info in the current session so we can access the user ID
                    //req.session.save(function (err) {
                        // res.redirect('/trips')
                    console.log("TEST")
                    res.send(user)
                    //})
                } else {
                    res.json({
                        errorMessage: "Wrong Password!" // incase wrong info input
                    });
                    return;
                }
            })
        })
        .catch(error => {
            res.json(error);
        })
});

module.exports = router;