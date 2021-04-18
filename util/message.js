const moment = require('moment');

function formatMessage(username, txt) {
    return {
        username,
        txt,
        date: moment().format('h:m a')
    }
}

module.exports = formatMessage;