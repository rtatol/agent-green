const mailer = require('../../../modules/mail/mailer');

describe('mailer tests', () => {

    beforeEach(() => {
        process.env.MAIL_SERVICE = 'example';
        process.env.MAIL_USER = 'example@example.com';
        process.env.MAIL_PASSWORD = 'example';
        process.env.MAIL_FROM = '"example" <example@example.com>';
        process.env.SNAPSHOT_PATH = '/tmp'
    });

    // TODO make better, add assertion
    describe('mailer', () => {
        it('should send mail', () => {
            // given

            // when
            mailer.sendEmailAlert('example@exaple.com');

            // then
        });
    });
});