var CronJob = require('cron').CronJob;
var kue = require('kue');
var AWS = require('aws-sdk');
queue = kue.createQueue();
require('dotenv').config()

// new CronJob('* * * * * *', function() {
new CronJob('15 56 14 09 04 *', function() { // create buat create dulu job
  var job = queue.create('SMS', {
    name: 'Bhir',
    number: '+6281299083182',
    message: 'Halo!'
  }).save(function(err) {
     if( !err ) console.log( job.id );
  });
  queue.process('SMS', function(job, done) { // process buat ngeproses job nya
  var SMSParams = {
    Message: `Halo! ${job.data.name}, kamu keren!`,
    PhoneNumber: job.data.number,
  }
  // console.log(SMSParams)
  sendSMS(SMSParams);
  done();
});

}, null, true, 'Asia/Jakarta');


function sendSMS(SMSParams) {

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET,
  region: process.env.REGION
});

var sns = new AWS.SNS();

sns.publish(SMSParams, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
  });
}

// sendSMS();




    