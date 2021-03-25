const express = require('express');

const app = express();

app.post('/', async (req, res) => {
  console.log(req);
  res.send('Yoo');
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
