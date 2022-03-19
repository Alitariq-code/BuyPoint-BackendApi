const dotenv = require('dotenv');

const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const db = process.env.DATABASE;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('database connection sucsessfull');
  });

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`app running on port ${port} `);
});
