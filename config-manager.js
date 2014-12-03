var path = require("path");
var fs = require("fs");

// We load the config file, but if its the test environment, we load the test config instead
var environment = process.env.NODE_ENV === "test" ? 'configs/test.js' : 'config.js'

var configFileName = path.join(__dirname, environment);
var exists = fs.existsSync(configFileName);

if (exists) {
    module.exports = require(configFileName);
} else {
    console.log("No config found");
    process.exit();
}

