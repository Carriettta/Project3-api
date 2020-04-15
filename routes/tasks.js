var express = require('express');
var router = express.Router();
const Task = require('../models/Task')
//C
router.post("/add", (req, res) => {
  Task
    .create({
      title: req.body.title,
      owner: req.session.user._id
    })
    .then((task) => {
      res.json(task);
    })
    .catch((err) => {
      res.status(500).json({
        message: "err"
      });
    })
})
//R
router.get('/tasks', function (req, res, next) {
  // res.json([{ title: '1st task title, this is' }]);
  Task
    .find({
      owner: req.session.user._id
    })
    // .sort({
    //   start: -1
    // })
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((err) => {
      res.status(500).json({
        message: "err"
      });
    })
});
//U
//D
router.get("/tasks/delete/:id", (req, res, next) => {
  Task
    .findByIdAndDelete(req.params.id)
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((err) => {
      res.status(500).json({
        message: "err"
      });
    })
})
//export
module.exports = router;