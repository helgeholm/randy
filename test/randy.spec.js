if (typeof randy === "undefined") {
    // Predefined in browser mode, so assume nodejs context.
    if (process.env.TEST_MINIFIED_VERSION == 'yes') {
        randy = require("../lib/randy.min");
    } else {
        randy = require("../lib/randy");
    }
    var assert = require("assert");
}

describe("randy", function () {
    function rep (f) {
        for (var i = 0; i < 1000; i++)
            f();
    }

    it("can be imported by the tests", function (done) {
        assert.ok(randy);
        done();
    });

    it("randInt() default to full 32-bit range", function (done) {
        rep(function () {
            assert.ok(randy.randInt() > 0);
            assert.ok(randy.randInt() < 0x100000000);
        });
        done();
    });

    it("randInt(stop) default start and step", function (done) {
        rep(function () {
            assert.ok(randy.randInt(10) < 10);
            assert.ok(randy.randInt(10) >= 0);
        });
        done();
    });

    it("randInt(2^32, 2^35) uses 53-bit range if needed", function (done) {
        rep(function () {
            var b32 = 4294967296;
            var b35 = 34359738368;
            assert.ok(randy.randInt(b32, b35) >= b32);
            assert.ok(randy.randInt(b32, b35) < b35);
        });
        done();
    });

    it("randInt(start, stop) default step", function (done) {
        rep(function () {
            assert.ok(randy.randInt(55, 66) < 66);
            assert.ok(randy.randInt(55, 66) >= 55);
        });
        done();
    });

    it("randInt(start, stop, step)", function (done) {
        rep(function () {
            assert.ok(randy.randInt(50, 800, 7) < 800);
            assert.ok(randy.randInt(50, 800, 7) >= 49);
            assert.equal(randy.randInt(50, 800, 7) % 7, 1);
        });
        done();
    });

    it("choice(stuff)", function (done) {
        var choices = "bunny jeep horse".split(' ');
        rep(function () {
            var c = randy.choice(choices);
            assert.ok(c == "bunny" || c == "jeep" || c == "horse");
        });
        done();
    });

    it("shuffleInplace(stuff) preserves elements", function (done) {
        var orig = "green blue red purple apple".split(' ').sort();
        var deck = orig.slice();
        rep(function () {
            randy.shuffleInplace(deck);
            assert.deepEqual(orig, deck.sort());
        });
        done();
    });

    it("shuffle(stuff) preserves elements", function (done) {
        var deck = "green blue red purple apple".split(' ').sort();
        rep(function () {
            var shuffled = randy.shuffle(deck);
            assert.deepEqual(deck, shuffled.sort());
        });
        done();
    });

    it("shuffle(stuff) is pure", function (done) {
        var orig = "green blue red purple apple".split(' ').sort();
        var deck = orig.slice();
        rep(function () {
            randy.shuffle(deck);
            assert.deepEqual(deck, orig);
        });
        done();
    });

    it("sample(stuff, 2) can only pick a element once", function (done) {
        var stuff = "a b c d e f".split(' ').sort();
        rep(function () {
            var raffle = randy.sample(stuff, 2).join('');
            assert.notEqual(raffle, "aa");
            assert.notEqual(raffle, "bb");
            assert.notEqual(raffle, "cc");
            assert.notEqual(raffle, "dd");
            assert.notEqual(raffle, "ee");
            assert.notEqual(raffle, "ff");
        });
        done();
    });

    it("sample(stuff, 3) picks correct number of elems", function (done) {
        var stuff = "a b c d e f".split(' ').sort();
        rep(function () {
            var raffle = randy.sample(stuff, 3);
            assert.equal(3, raffle.length);
        });
        done();
    });

    it("random() to [0.0, 1.0)", function (done) {
        rep(function () {
            assert.ok(randy.random() >= 0.0);
            assert.ok(randy.random() <= 1.0);
        });
        done();
    });

    it("uniform(8.6, 9.7) to [8.6, 9.7)", function (done) {
        rep(function () {
            assert.ok(randy.uniform(8.6, 9.7) >= 8.6);
            assert.ok(randy.uniform(8.6, 9.7) <= 9.7);
        });
        done();
    });

    it("triangular() to [0.0, 1.0)", function (done) {
        rep(function () {
            assert.ok(randy.triangular() >= 0.0);
            assert.ok(randy.triangular() <= 1.0);
        });
        done();
    });

    it("triangular(4.0) to [0.0, 4.0)", function (done) {
        rep(function () {
            assert.ok(randy.triangular() >= 0.0);
            assert.ok(randy.triangular() <= 4.0);
        });
        done();
    });

    it("triangular(4.0, 8.0) to [4.0, 8.0)", function (done) {
        rep(function () {
            assert.ok(randy.triangular(4, 8) >= 4.0);
            assert.ok(randy.triangular(4, 8) <= 8.0);
        });
        done();
    });

    it("triangular(4.0, 8.0, 5.0) to [4.0, 8.0)", function (done) {
        rep(function () {
            assert.ok(randy.triangular(4, 8, 5) >= 4.0);
            assert.ok(randy.triangular(4, 8, 5) <= 8.0);
        });
        done();
    });

    it("getRandBits(9) stays within 0 <= x < 2^9", function (done) {
        rep(function () {
            assert.ok(randy.getRandBits(9) >= 0);
            assert.ok(randy.getRandBits(9) < 512);
        });
        done();
    });
});
