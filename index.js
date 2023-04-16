const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { config } = require('dotenv');
const postsRouters = require('./routes/posts.js'); //
const userRouters = require('./routes/user.js'); //
config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(postsRouters);
app.use(userRouters);

const PORT = process.env.PORT || 2000;

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`server is running on port : ${PORT}`)))
    .catch((error) => console.log(error.message));


module.exports = app;
