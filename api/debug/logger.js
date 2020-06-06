const dayjs = require('dayjs');
const colors = require('colors');

module.exports = function(msg, value = 0){
    if (!parseInt(process.env.VERBOSE) && value !== 3 && value !== 1)
        return;
    const logMsg =  "[" + dayjs().format("DD/MM/YY HH:mm:ss")+"] " + msg;

    switch (value) {
        case 1:
            console.log(logMsg.green);
            return;
        case 2:
            console.log(logMsg.yellow);
            return;
        case 3:
            console.log(logMsg.red);
            return;
        default:
            console.log(logMsg);
            return;
    }
};
