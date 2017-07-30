/**
 * Created by machao on 17/7/24.
 */
var boot = require("../app").boot;
var shutdown = require("../app").shutdown;
var port = require("../app").port;
var superagent = require("superagent");
var expect = require("expect");

describe("server", function () {
    before(function () {
        boot();
    });
    
    describe("homepage", function () {
        it("should respond to GET", function (done) {
            superagent.agent
                .get("http://localhost:" + port)
                .end(function (res) {
                    expect(res.status).to.equal(200);
                    done();
                });
        });
    });

    describe(function () {
        shutdown();
    })
});
