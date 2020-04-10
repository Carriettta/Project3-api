const express = require("express");
const router = express.Router();

router.get("/logout", (req, res, next) => { // destroys the current user session
    req.session.destroy(function (err) {
        if (err) {res.json(err)}
        else res.send('OK')
    })
});