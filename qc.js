#!/usr/bin/env node

// Run mocha for both normal and minified versions.

var spawn = require("child_process").spawn;

function runScript(script, done) {
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
    'browserify',
    'minify',
    'test',
    'test-distribution'
];

function runAllOps (lastError) {
    if (lastError != null)
        return;
    if (!ops.length) {
        console.log("☺");
        return;
    }
    var op = ops.shift();
    runScript(op, runAllOps);
}

runAllOps(null);
