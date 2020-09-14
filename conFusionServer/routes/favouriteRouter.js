var express = require('express');
var bodyParser = require('body-parser');
var Favourites = require('../models/favourite');
var authenticate = require('../authenticate');
const cors = require('./cors');

var favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .populate('user')
            .populate('favourites')
            .then((favourites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourites);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id }, (err, favouriteDishes) => {
            if (err || !favouriteDishes) {
                var favouriteList = [];
                for (var dish of req.body) {
                    favouriteList.push(dish._id);
                }
                new Favourites({
                    user: req.user._id,
                    favourites: favouriteList
                })
                    .save()
                    .then((favouriteDish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favouriteDish);
                    })
                    .catch(err => next(err));
            }
            else {
                var favouriteList = req.body;
                for (var dish of favouriteList) {
                    favouriteDishes.favourites.push(dish.id);
                }

                favouriteDishes.save().then((favouritesResp => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favouritesResp);
                })).catch(err => next(err));
            }
        }).catch(err => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /favourites/' + req.params.dishId);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.remove({})
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
        res.statusCode = 403;
        res.end('GET operation not supported on /favourites/:favouriteId' + req.params.dishId);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id }, (err, favouriteDishes) => {
            if (err || !favouriteDishes) {
                new Favourites({
                    user: req.user._id,
                    favourites: [req.params.favouriteId]
                })
                    .save()
                    .then((favouriteDish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favouriteDish);
                    })
                    .catch(err => next(err));
            }
            else {
                favouriteDishes.favourites.push(req.params.favouriteId);

                favouriteDishes.save().then((favouritesResp => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favouritesResp);
                })).catch(err => next(err));
            }

        }).catch(err => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /favourites/:favouriteId' + req.params.dishId);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .then((favouriteDishes) => {
                if (favouriteDishes != null) {
                    let newFavorites = favouriteDishes.favourites.filter(dish => dish._id != req.params.favouriteId);
                    favouriteDishes.favourites = newFavorites;
                    favouriteDishes.save()
                        .then((favouriteDishes) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favouriteDishes);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('favouriteDish ' + req.params.favouriteId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    });

module.exports = favouriteRouter;