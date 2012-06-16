#!/usr/bin/env node

// Run mocha for both normal and minified versions.

var spawn = require("child_process").spawn;

function runScript(script, setEnv, done) {
    if (typeof setEnv === 'function') {
        done = setEnv;
        setEnv = {};
    }
    for (var k in setEnv)
        if (setEnv.hasOwnProperty(k))
            process.env[k] = setEnv[k];
    var proc = spawn(
        'npm',
        ["run-script", script],
        { customFds: [0,1,2] });
    proc.on('exit', function (code, signal) {
        if (code == 0)
            return done(null);
        done(code);
    });
}

var ops = [
    ['minify'],
    ['test', {TEST_MINIFIED_VERSION: 'no'}],
    ['test', {TEST_MINIFIED_VERSION: 'yes'}],
    ['test-distribution', {TEST_MINIFIED_VERSION: 'no'}],
    ['test-distribution', {TEST_MINIFIED_VERSION: 'yes'}]
];

function runAllOps (lastError) {
    if (lastError !== null)
        return;
    if (ops.length === 0) {
        console.log("☺");
        return;
    }
    var op = ops.shift().concat(runAllOps);
    runScript.apply(this, op);
}

runAllOps(null);
