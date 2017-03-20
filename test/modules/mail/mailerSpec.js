const mailer = require('../../../modules/mail/mailer');

describe('mailer tests', () => {

    beforeEach(() => {
        process.env.MAIL_ENABLED = true;
        process.env.MAIL_SERVICE = 'example';
        process.env.MAIL_USER = 'example@example.com';
        process.env.MAIL_PASSWORD = 'example';
        process.env.MAIL_FROM = '"example" <example@example.com>';
        process.env.MAIL_TO = 'example@exaple.com';
    });

    // TODO make better, add assertion
    describe('mailer', () => {
        it('should send mail', () => {
            // given

            // when
            mailer.sendEmailAlert();

            // then
        });
    });
});