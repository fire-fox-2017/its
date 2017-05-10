var CronJob = require('cron').CronJob,
    kue = require('kue'),
    queue = kue.createQueue(),
    AWS = require('aws-sdk');
require('dotenv').config();
new CronJob('00 16 21 * * *', function() {
    var job = queue.create('sms', {
        message: 'My first aws sms!',
        name: 'Bill',
        phone: '+6287781024364'
    }).save(function(err) {
        if (!err) console.log(job.id);
        console.log('You will see this message every second');
    });
    queue.process('sms', function(job, done) {
        // console.log(job);
        var params = {
            Message: `Hi ${job.data.name}, ${job.data.message}`,
            PhoneNumber: job.data.phone
        };
        // console.log(params);
        sendMessage(params);
        done()
    });
}, null, true, 'Asia/Jakarta');
function sendMessage(params) {
    AWS.config.update({
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
        region: "ap-southeast-1"
    });
    var sns = new AWS.SNS();
    console.log(params);
    sns.publish(params, function(err, data) {
        console.log('------- Masukk');
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
    });
}