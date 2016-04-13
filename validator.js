"use strict";
var async = require('async'),
    meta = require('./meta'),
    lib = require('./lib'),
    Validator = require('jsonschema').Validator,
    errors = meta.errors,
    v = new Validator(),
    opts;

var compare = function (source, schema, input, cb) {
    //no params url support
    if (!Object.keys(schema[source]).length) {
        console.log(1);
        cb(null);
    //defined schema
    } else if (schema[source]) {
        console.log(2);
        var results = v.validate(input[source], {
            "type": "object",
            "additionalProperties": false,
            "properties": schema[source]
        });
        if (results.errors.length) {
            async.map(results.errors, function (error, mcb) {
                error.stack = error.stack.replace(new RegExp('"', 'g'),'');
                mcb(null, error.stack.replace(new RegExp("instance.", 'g'),""));
            }, cb);
        } else {
            console.log(3);
            cb(null);
        }
    //input params not defined in schema
    } else if (Object.keys(input[source]).length) {
        console.log(4);
        cb(errors[190] + source);
    }
};

var validator = function (schema, sources, cb) {
    async.auto({
        body: async.apply(compare, "body", schema, sources),
        query: async.apply(compare, "query", schema, sources)
    }, function (err, success) {
        if (!success) {
            return cb(null);
        }

        var format = {};
        async.forEachOf(success, function (value, key, callback) {
            if (value && value.length) {
                format[key] = value;
            }
            callback();
        }, function () {
            if (Object.keys(format).length) {
                return cb(format);
            }
            return cb(null);
        });
    });
};

var matchRoute = function (routes, url, cb) {
    async.filter(routes, function (route, rcb) {

        //remove first and last slashes
        route = route.replace(/^\/|\/$/g, '');
        url = url.replace(/^\/|\/$/g, '');

        //match dynamic route
        var routeMatcher = new RegExp(
            route.replace(/:[^\s/]+/g, '([\\w-]+)')
        );

        rcb(url.match(routeMatcher));
    }, function (isMatch) {
        cb(null, isMatch);
    });
};

var checkRoutes = function (req, res, next) {
    var schema = require('./model').data,
        url  = req.path,
        method = req.method.toUpperCase(),
        opts = lib.opts(),
        all_routes,
        sources = {
            query: req.query,
            body: req.body
        };

    all_routes = Object.keys(schema);

    if (all_routes.length) {
        matchRoute(all_routes, url, function (err, match) {
            if (match.length) {
                if (schema[match[0]][method]) {
                    validator(schema[match[0]][method], sources, function (err) {
                        if (err) {
                            if (opts.handle_err) {
                                return res.send({
                                    success: false,
                                    errors: err
                                });
                            }
                            req.input_errors = err;
                            return next();
                        } 
                        req.input_errors = {};
                        return next();
                    });
                } else if (opts.strict) {
                    res.json({
                        success: false,
                        errors: {
                            validation: errors[191]
                        }
                    });
                } else {
                    next();
                }
            } else if (opts.strict) {
                res.send({
                    success: false,
                    errors: {
                        validation: errors[191]
                    }
                });
            } else {
                next();
            }
        });
    } else if (opts.strict) {
        res.json({
            success: false,
            errors: {
                validation: errors[191]
            }
        });
    } else {
        next();
    }
};

module.exports = function () {
    return checkRoutes;
};
