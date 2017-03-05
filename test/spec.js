var request = require('supertest');

describe('app tests', function () {
    var server;

    beforeEach(function () {
        server = require('../app');
    });

    it('should responds to /', function testHome(done) {
        request(server)
            .get('/')
            .expect(200, done);
    });

    it('should responds to /camera', function testCamera(done) {
        request(server)
            .get('/camera')
            .expect(200, done);
    });


    it('should throw 404 when everything else', function test404(done) {
        request(server)
            .get('/foo/bar')
            .expect(404, done);
    });

    afterEach(function (done) {
        done();
    });
});