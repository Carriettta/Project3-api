const express = require("express");
const router = express.Router();

router.get("/auth/logout", (req, res, next) => { // destroys the current user session
    req.session.destroy(function (err) {
        if (err) {res.json(err)}
        else res.send('OK')
    })
});

module.exports = router;