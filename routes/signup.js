const express = require("express");
const router = express.Router();
const User = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.post("/auth/signup", (req, res, next) => { // when clicked signup
    const username = req.body.username;
    const password = req.body.password; // these are the signup form values
    const email = req.body.email;
    const salt = bcrypt.genSaltSync(bcryptSalt); // generating the salt
    const hashPass = bcrypt.hashSync(password, salt); // creating an hash of the password using salt
    if (username === "" || password === "" || email === "") { // if username and password is empty then serve them the signup page with error
        res.json({
            errorMessage: "Error - Please check your details"
        });
        return;
    }
    User.findOne({
            "username": username
        }) //look through DB look for username from the form
        .then(user => { // if username is already in database then server signup page with error
            if (user !== null) {
                res.json({
                    errorMessage: "The username already exists!"
                });
                return;
            }
            User.create({ // create new user in DB
                    username,
                    password: hashPass, // use hasPass & salt
                    hash: salt,
                    email
                })
                .then(user => { //if user is created sucessully then redirect to login page
                    res.json(user);
                })
                .catch(error => { // error so error 
                    res.json(error)
                })
        })
        .catch(error => {
            res.json(error); // it will not stop the exection of the appliction 
        })
});

module.exports = router;