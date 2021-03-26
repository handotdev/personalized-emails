require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const { email, examples, visuals, logical, storytelling } = req.body;

  const examplesScore = parseInt(examples, 10);
  const visualsScore = parseInt(visuals, 10);
  const logicalScore = parseInt(logical, 10);
  const storytellingScore = parseInt(storytelling, 10);

  console.log(examplesScore);
  console.log(visualsScore);
  console.log(logicalScore);
  console.log(storytellingScore);

  const msg = {
    to: email, // Change to your recipient
    from: 'hyw2@cornell.edu',
    subject: 'An Article About Mindfulness and Mindlessness',
    text: 'and easy to do anywhere, even with Node.js',
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
