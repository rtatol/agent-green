const nodemailer = require('nodemailer');
const dotEnv = require('dotenv');
const storage = require('../storage/storage');

dotEnv.config();

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

let throttlingTimerId;

function sendEmailAlert(mailTo) {

    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: mailTo,
        subject: 'Token ✔',
        text: 'I am here',
        html: '<b>I am here</b>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s at %s', info.messageId, info.response, new Date());
        return true;
    });
}

function isAllowed(alertSettings) {
    // check 'throttling'
    if (throttlingTimerId) {
        return false;
    }
    // check 'enabled' flag
    if (!alertSettings.enabled) {
        return false;
    }
    const currentDate = new Date();
    // check 'day'
    const dayValid = alertSettings.activeDays.indexOf(String(currentDate.getDay())) !== -1;
    if (!dayValid) {
        return false;
    }

    // check 'time'
    const startDate = new Date(currentDate.getTime());
    startDate.setHours(alertSettings.activeFrom.split(":")[0]);
    startDate.setMinutes(alertSettings.activeFrom.split(":")[1]);

    const endDate = new Date(currentDate.getTime());
    endDate.setHours(alertSettings.activeTo.split(":")[0]);
    endDate.setMinutes(alertSettings.activeTo.split(":")[1]);

    return startDate < currentDate && endDate > currentDate
}

function activateThrottling(throttlingTimeout) {
    throttlingTimerId = setTimeout(() => {
        clearTimeout(throttlingTimerId);
        throttlingTimerId = null;
    }, throttlingTimeout);
}

function sendThrottledEmailAlert() {

    storage.getAlertSettings((err, alertSettings) => {

        if (isAllowed(alertSettings)) {
            console.log("Send email");
            sendEmailAlert(alertSettings.mailTo);
            activateThrottling(alertSettings.throttlingTimeout);
        } else {
            console.log("Email not allowed");
        }
    });
}

module.exports = {
    sendEmailAlert: sendEmailAlert,
    sendThrottledEmailAlert: sendThrottledEmailAlert
};