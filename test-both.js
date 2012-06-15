#!/usr/bin/env node

// Run mocha for both normal and minified versions.

var spawn = require("child_process").spawn;
var env = process.env;
var args = ["node_modules/mocha/bin/mocha"].concat(process.argv.slice(2));

function test(useMin, done) {
    env.TEST_MINIFIED_VERSION = useMin;
    var proc = spawn(
        process.argv[0],
        args,
        { env: env,
          customFds: [0,1,2] });
    proc.on('exit', function (code, signal) {
        if (code == 0)
            return done(null);
        done(code);
    });
}

console.log("Testing using normal version.");
test("no", function (err) {
    if (err === null) {
        console.log("Testing using minified version.");
        test("yes", function (err) {
            if (err === null)
                console.log("☺");
        });
    }
});
