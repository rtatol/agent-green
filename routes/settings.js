const express = require('express');
const router = express.Router();

const storage = require('../modules/storage/storage');

router.get('/', (req, res) => {

    storage.getAlertSettings((err, settings) => {
        res.render('settings', {
            title: 'Settings',
            data: settings,
            activeDays: prepareAvailableDays(settings.activeDays)
        });
    });
});

router.post('/', (req, res) => {

    const settingsToUpdate = {
        enabled: req.body.enabled ? true : false,
        activeFrom: req.body.activeFrom,
        activeTo: req.body.activeTo,
        activeDays: req.body.activeDays,
        throttlingTimeout: parseInt(req.body.throttlingTimeout, 10),
        mailTo: req.body.mailTo,
        mailSubject: req.body.mailSubject,
        mailText: req.body.mailText,
        mailHtml: req.body.mailHtml,
        modifyDate: new Date()
    };

    storage.updateAlertSettings(settingsToUpdate, (err, numReplaced) => {
        if (err) {
            res.send(err);
        } else {
            console.log("settings was updated %s", numReplaced);
            res.redirect('/settings');
        }
    });
});


router.get('/api/v1/alert', (req, res) => {
    storage.getAlertSettings((err, settings) => {
        res.json(settings);
    });
});

router.put('/api/v1/alert', (req, res) => {
    storage.updateAlertSettings(req.body, (err, numReplaced) => {
        res.json(numReplaced);
    });
});

function prepareAvailableDays(activeDays) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return daysOfWeek.map((day, i) => {
        return {
            name: day,
            index: i,
            value: activeDays.indexOf(String(i)) !== -1
        }
    });
}

module.exports = router;
