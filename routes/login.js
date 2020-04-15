const express = require("express");
const router = express.Router();
const User = require("../models/user");
var session = require('express-session')
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.post("/auth/login", (req, res, next) => { // this login 
    const username = req.body.username; //these are the login form values
    const password = req.body.password;
    if (username === "" || password === "") { //username and password checks
        res.status(401)
            .json({
                errorMessage: "No user name or password given"
            });
        return;
    }
    User.findOne({
            "username": username
        }) // checking if usename is in the DB
        .then(user => {
            if (!user) { //if not in DB send user back to login and throw error
                res.status(401)
                    .json({
                        errorMessage: "The username does not exists!"
                    });
                return;
            }
            bcrypt.compare(password, user.password, (err, result) => { //bcrypt password check between user entered password and the password in the DB
                debugger
                if (result) {
                    req.session.user = user // storing user info in the current session so we can access the user ID
                    res.send(user)
                } else {
                    res.status(401)
                        .json({
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