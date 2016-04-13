"use strict";
var validator = require("./validator"),
    lib = require('./lib'),
    meta = require('./meta'),
    errors = meta.errors,
    methods = meta.methods,
    data = {};

var Rabbit = {
    data: data,
    run: validator,
    config: function (config) {

        /*
         * recursive crawling throw schemas dir
         * to require validation files
         * */
        lib.crawl_require(config.path + "/" + config.dir);
        if (!config.dir || !config.path) {
            throw new Error(errors[192]);
        }
        lib.opts(config);
    },
    schema: function (route, method, schema) {

        /*
         * check if method entered is valid 
         * */
        if (!~methods.indexOf(method.toLowerCase())) {
            throw new Error("Validator: Invalid request method '" +
                    method + "'" + " for '" + route + "'");
        } else {
            /*
             * assign data schema to route
             * create route if not available
             * */
            method = method.toUpperCase();
            if (!data[route]) {
                data[route] = {};

                if (!data[route][method]) {
                    data[route][method] = schema;
                }
            } 
        }
    }
};

module.exports = Rabbit;
