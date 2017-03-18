const request = require('supertest');

describe('app tests', () => {
    let server;

    beforeEach(() => {
        server = require('../app');
    });

    it('should responds to /', (done) => {
        request(server)
            .get('/')
            .expect(200, done);
    });

    it('should responds to /camera', (done) => {
        request(server)
            .get('/camera')
            .expect(200, done);
    });


    it('should throw 404 when everything else', (done) => {
        request(server)
            .get('/foo/bar')
            .expect(404, done);
    });

    afterEach((done) => {
        done();
    });
});