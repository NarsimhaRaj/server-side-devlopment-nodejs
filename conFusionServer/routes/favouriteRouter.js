var express = require('express');
var bodyParser = require('body-parser');
var Favourite = require('../models/favourite');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');

const favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourite.find({})
            .populate('user')
            .populate('favourites')
            .then((favourites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourites);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /favourites');
    })
    .put(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favourites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourite.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

favouriteRouter.route('/:favouriteId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Favourite.findById(req.params.favouriteId)
            .then((favourites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourite.find({ _Id: req.params.favouriteId })
            .then((err, favourites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /favourites/' + req.params.dishId);
    })
    .delete(cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });