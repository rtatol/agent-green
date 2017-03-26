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

function sendEmailAlert(settings) {

    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: settings.mailTo,
        subject: settings.mailSubject,
        text: settings.mailText,
        html: settings.mailHtml,
        attachments: [
            {
                filename: 'kotojeleń.jpg',
                path: process.env.SNAPSHOT_PATH
            }
        ]
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
        console.log("Email not allowed, reason: throttling = %s", throttlingTimerId ? true : false);
        return false;
    }

    // check 'enabled' flag
    if (!alertSettings.enabled) {
        console.log("Email not allowed, reason: alertSettings.enabled = %s", alertSettings.enabled);
        return false;
    }

    const currentDate = new Date();

    // check 'day'
    const dayValid = alertSettings.activeDays.indexOf(String(currentDate.getDay())) !== -1;
    if (!dayValid) {
        console.log("Email not allowed, reason: dayValid = %s, currentDay: %s, available days: %s",
            dayValid,
            String(currentDate.getDay()),
            JSON.stringify(alertSettings.activeDays)
        );
        return false;
    }

    // check 'time'
    const startDate = new Date(currentDate.getTime());
    startDate.setHours(alertSettings.activeFrom.split(":")[0]);
    startDate.setMinutes(alertSettings.activeFrom.split(":")[1]);

    const endDate = new Date(currentDate.getTime());
    endDate.setHours(alertSettings.activeTo.split(":")[0]);
    endDate.setMinutes(alertSettings.activeTo.split(":")[1]);

    const timeValid = startDate < currentDate && endDate > currentDate;
    if (!timeValid) {
        console.log("Email not allowed, reason: timeValid = %s, currentDate: %s, startDate days: %s, endDate: %s",
            timeValid,
            currentDate,
            startDate,
            endDate
        );
        return false;
    }

    return true;
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
            console.log("Sending email");
            // wait one second for motion 'snapshot'
            setTimeout(() => {
                sendEmailAlert(alertSettings)
            }, 1000);
            activateThrottling(alertSettings.throttlingTimeout);
        }
    });
}

module.exports = {
    sendEmailAlert: sendEmailAlert,
    sendThrottledEmailAlert: sendThrottledEmailAlert
};