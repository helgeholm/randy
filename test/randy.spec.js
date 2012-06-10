var randy = require("../lib/randy");
var assert = require("assert");

describe("randy", function () {
    it("can be imported by the tests", function (done) {
        assert.ok(randy);
        done();
    });
});
