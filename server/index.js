const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const { initEnv, fetchData } = require('./util.js');
const { name, version, description, repository } = require('../package.json');

initEnv();
const port = process.env.PORT || '3001';

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());

app.get('/fn/info', (req, resp) =>
  resp.send({
    name,
    version,
    repo: repository.url,
    description
  })
);

app.get('/', (req, resp) =>
  resp.send({
    status: 'ok'
  })
);

app.get('/search', async (req, resp) => {
  const search = await fetchData();
  resp.send({ search });
});

app.listen(port, async () => {
  console.log(`server is running on port: ${port}`);
});
