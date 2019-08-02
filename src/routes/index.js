var express = require('express');
var router = express.Router();

var dataController = require("../controllers/data-controller");

/* GET health check. */
router.get('/', function (req, res, next) {
  res.status(200).json({ "status": "All Good" }).send();
});


/* GET football data. */
router.get('/search', function (req, res, next) {
  dataController.search(req, res);
});

module.exports = router;
