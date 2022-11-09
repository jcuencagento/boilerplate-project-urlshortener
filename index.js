require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 8080;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = [
  "https://www.google.es"
];

app.post("/api/shorturl", (req, res) => {
  let url = new URL(req.body.url);
  dns.lookup(url.hostname, (err, address, family) => {
    if (err) {
      res.json({ error: 'Invalid URL' })
    } else {
      if (!urls.includes(url)) urls.push(url);
      res.json({
        original_url: url,
        short_url: urls.indexOf(url) + 1
      });
    }
  });
});

app.get("/api/shorturl/:short_url?", (req, res) => {
  let url = urls[req.params.short_url-1];
  res.redirect(url);
});


app.get('/api/urls', (req, res) => {
  res.json({
    links: urls
  });
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
