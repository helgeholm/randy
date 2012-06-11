"use strict";

/* These tests check that the RNG distribution falls within the
 * expected range.
 *
 * As they are statistical in nature, they are slow to run, and will
 * occasionally FAIL EVEN IF the random number generator works
 * perfectly.  Therefore they are in their own test system instead of
 * in the unit tests. */

var randy = require("../lib/randy");
var assert = require("assert");

describe("randy distributions", function () {
    function mkHistogram (bucketsMins) {
        var buckets = [];
        for (var i = 0; i < bucketsMins.length; i++)
            buckets.push({x: bucketsMins[i], n: 0});
        
        function insert (val) {
            for (var i = buckets.length - 1; i >= 0; i--) {
                if (buckets[i].x <= val) {
                    buckets[i].n += 1;
                    return;
                }
            }
        }

        // Use to get a visual representation of distribution if there
        // are problems.
        function log () {
            var max = 0;
            var labelWidth = buckets[buckets.length - 1].x.toString().length;
            for (var i = 0; i < buckets.length; i++)
                if (buckets[i].n > max)
                    max = buckets[i].n;
            var barWidth = 75 - labelWidth;
            console.log();
            for (var i = 0; i < buckets.length; i++) {
                var label = buckets[i].x.toString();
                while (label.length < labelWidth)
                    label = " " + label;
                var w = Math.floor(barWidth * (buckets[i].n / max));
                var bar = "";
                for (var j = 0; j < w; j++)
                    bar += "#";
                console.log(label + ": " + bar);
            }
        }

        // distFun(x) - how many values should bucket at x ideally
        // have, given as a scalar of the sum of all buckets.
        function check (distFun) {
            var sum = 0;
            for (var i = 0; i < buckets.length; i++)
                sum += buckets[i].n;
            for (var i = 0; i < buckets.length; i++) {
                var x = buckets[i].x;
                var expected = distFun(x) * sum;
                var tolerance = expected * 0.01;
                var loThreshold = expected - tolerance;
                var hiThreshold = expected + tolerance;
                assert.ok(loThreshold < buckets[i].n);
                assert.ok(buckets[i].n < hiThreshold);
            }
        }

        return {
            insert: insert,
            check: check,
            log: log
        };
    }

    function rep (f) {
        for (var i = 0; i < 1000000; i++)
            f();
    };

    it("can be imported by the tests", function (done) {
        assert.ok(randy);
        done();
    });

    it("randInt has even distribution", function (done) {
        var h = mkHistogram([0,1,2,3,4,5,6,7,8,9]);
        rep(function () {
            h.insert(randy.randInt(0, 10));
        });
        var dist = function (x) { return 0.1; };
        h.check(dist);
        done();
    });

    it("random has even distribution", function (done) {
        var h = mkHistogram([0.0, 0.1, 0.2, 0.3, 0.4,
                             0.5, 0.6, 0.7, 0.8, 0.9]);
        rep(function () {
            h.insert(randy.random());
        });
        var dist = function (x) { return 0.1; };
        h.check(dist);
        done();
    });

    it("uniform has even distribution", function (done) {
        var h = mkHistogram([4.5, 4.6, 4.7, 4.8, 4.9]);
        rep(function () {
            h.insert(randy.uniform(4.5, 5.0));
        });
        var dist = function (x) { return 0.2; };
        h.check(dist);
        done();
    });
});
