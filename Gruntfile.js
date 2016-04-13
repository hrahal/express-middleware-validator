"use strict";

module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        run: {
            options: {
                wait: true
            },
            server: {
                cmd: 'npm',
                args: [
                    'start'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-run');

    grunt.registerTask('test', [
        "run:server"
    ]);
};
