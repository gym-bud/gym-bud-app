var models = require('../models');
var express = require('express');
var router = express.Router();

models.User.findAll({

}).then( function( users ) {

});
