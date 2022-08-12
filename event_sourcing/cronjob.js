const { exec } = require("child_process");
const CronJob = require('cron').CronJob;
const job = new CronJob('0,10,20,30,40,50 * * * * *', function(){
    exec("node event_sourcing/consumer_II.js", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}, null, true)