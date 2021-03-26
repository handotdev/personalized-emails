require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const admin = require('firebase-admin');
const articles = require('./articles.json');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(bodyParser.json());
admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_CREDENTIALS)
  ),
});

const db = admin.firestore();

app.post('/', async (req, res) => {
  const { email, examples, visuals, logical, storytelling } = req.body;

  const examplesScore = parseInt(examples, 10);
  const visualsScore = parseInt(visuals, 10);
  const logicalScore = parseInt(logical, 10);
  const storytellingScore = parseInt(storytelling, 10);

  // Must match he fields in the JSON
  const categoryDict = ['examples', 'visuals', 'logical', 'storytelling'];
  const scoresArr = [
    examplesScore,
    visualsScore,
    logicalScore,
    storytellingScore,
  ];
  const topIndex = scoresArr.indexOf(Math.max(...scoresArr));

  const isTest = Math.random() > 0.5;
  const preference = categoryDict[topIndex];
  const articleGroup = isTest ? preference : 'control';
  const articleLink = articles[articleGroup];

  const msg = {
    to: email,
    from: 'hyw2@cornell.edu',
    subject: 'Learning styles study: An article tailored for you',
    html: `Hey there,<br/><br/>Thank you for filling out the survey.<br/>Here <a href="${articleLink}">an article about mindfulness and mindlessness</a> tailored to your learning style!<br/><br/>Best,<br/>Han`,
  };

  const currentTimestamp = new Date().getTime();

  const docRef = db.collection('signups').doc(currentTimestamp.toString());
  await docRef.set({
    email,
    isTest,
    preference,
    timestamp: currentTimestamp,
  });

  await sgMail.send(msg);

  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
