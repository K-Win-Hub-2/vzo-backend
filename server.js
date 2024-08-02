const cors = require('cors');
const path = require('path');
const cronitor = require('cronitor')('bb06d5c8745f45f2a9fc62755b7414ea');
const config = require('./config/db'); // Ensure this path is correct
const createIndexs = require('./dbIndexes').createIndex;
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const mongoose = require('mongoose');
const app = express();
const server = require('http').Server(app);
const port = 6060;

app.use(cors({ origin: '*' }));

const userUtil = require('./app/lib/userUtil');
const { run } = require('./app/lib/registerAllServices');
run();

if (mongoose.connection.readyState !== 1) {
  mongoose.Promise = global.Promise;
  mongoose.connect(config.db, { useNewUrlParser: true, retryWrites: false, useUnifiedTopology: true });

  const db = mongoose.connection;

  db.on('error', (err) => {
    console.log(err);
  });

  db.once('open', function () {
    console.log('Database is connected');
  });

  // Create indexes (if needed)
  db.collection('patients').createIndex({ name: 'text', phone: 'text', email: 'text', patientID: 'text' }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Patient Indexes Created Successfully!");
    }
  });

  // Other indexes...
  // ...

  // Export the db connection if needed
  module.exports = db;
}

mongoose.plugin((schema) => {
  schema.options.usePushEach = true;
});

app.use('/static', express.static(path.join(__dirname, 'uploads')));


require('./config/express')(app, config);

app.all('*', (req, res) => {
  const error = {
    status: 404,
    success: false,
    message: `Can't find ${req.url} on the server`,
  };
  res.status(error.status).send(error);
});


server.listen(port, () => {
  console.log('We are live on port:', port);
});

cronitor.wraps(cron);
cronitor.schedule('AccountBalanceClosingAndOpening', '55 23 * * *', async function () {
  console.log('Managing AccountBalance for every Accounting Accs!');
  const isLastDay = await userUtil.getLatestDay();
  if (isLastDay === true) {
    await userUtil.fixedAssetTransaction();
    await userUtil.createAccountBalance();
  } else {
    console.log('Today is not the right day for the scheduled task!');
  }
});

module.exports = app;
