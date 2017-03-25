const DataStore = require('nedb');
const dotEnv = require('dotenv');

dotEnv.config();

const db = {};

db.settings = new DataStore({
    filename: process.env.DB_PATH,
    autoload: true
});

function getAlertSettings(cb) {

    db.settings.find({ name: "alert" }, (err, docs) => {
        if (docs.length > 0) {
            cb(err, docs[0]);
        } else {
            createDefaultAlertSettings(cb);
        }
    });
}

function updateAlertSettings(fieldsToUpdate, cb) {
    db.settings.update({ name: "alert" }, { $set: fieldsToUpdate }, {}, (err, numReplaced) => {
        cb(err, numReplaced);
    });
}

function createDefaultAlertSettings(cb) {

    const defaultSettings = {
        name: "alert",
        enabled: false,
        activeFrom: "07:00",
        activeTo: "16:00",
        activeDays: [ '1', '2', '3', '4', '5' ],
        throttlingTimeout: 5 * 60 * 1000,
        mailTo: 'kokontoken@gmail.com',
        createDate: new Date()
    };

    db.settings.insert(defaultSettings, (err, newDoc) => {
        cb(err, newDoc);
    });
}

module.exports = {
    getAlertSettings: getAlertSettings,
    updateAlertSettings: updateAlertSettings
};