var express = require('express');
var router = express.Router();

//C

//R
router.get('/', function(req, res, next) {
    res.json([{ title: '1st task title, this is' }]);
  });
//U
//D
//export
module.exports = router;