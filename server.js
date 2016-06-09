if (!process.env.APP_SECRET) throw new Error('you need an APP_SECRET env variable');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5555;

const userRouter = require(__dirname + '/routes/user_router');
const authRouter = require(__dirname + '/routes/auth_router');
const zipcodeRouter = require(__dirname + '/routes/zip_code_router');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/fit_cliques_DB');

app.use('/api', userRouter);
app.use('/api', authRouter);
app.use('/api', zipcodeRouter);

app.get('/signup', (req, res) => {
  res.redirect('/#' + req.url);
});

app.get('/resync', (req, res) => {
  res.redirect('/#' + req.url);
});

app.use(express.static(__dirname + '/build'));

module.exports = exports = app.listen(PORT, () => console.log('server up on port: ' + PORT));
