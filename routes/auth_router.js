const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const basicHTTP = require(__dirname + '/../lib/basic_http');
const User = require(__dirname + '/../models/user');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');
