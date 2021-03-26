require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const articles = require('./articles.json');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(bodyParser.json());

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

  const articleGroup = Math.random() > 0.5 ? categoryDict[topIndex] : 'control';
  const articleLink = articles[articleGroup];

  console.log(articleGroup);
  console.log(articleLink);

  const msg = {
    to: email, // Change to your recipient
    from: 'hyw2@cornell.edu',
    subject: 'Learning styles study: An article tailored for you',
    html: `Hey there,<br/><br/>Thank you for filling out the survey.<br/>Here <a href="${articleLink}">an article about mindfulness and mindlessness</a> tailored to your learning style!<br/><br/>Best,<br/>Han`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });

  res.send(email);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
