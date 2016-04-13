var fs = require("fs"),
    path = require("path"),
    opts;

module.exports = {
    crawl_require : function (dir, done) {
        fs.readdirSync(dir).forEach(function (file) {
            file = path.resolve(dir, file);
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                crawl_require(file, done);
            } else {
                if ((/\.(js)$/i).test(file)) {
                    require(file);
                }
            }
        });
    },
    opts: function(config) {
        if (opts) {
            return opts;
        }
        opts = config;
        return opts;
    }
}
