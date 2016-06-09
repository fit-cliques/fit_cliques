const app = require('express')();

app.post('/oauth2/token', (req, res) => {
  res.status(200).json({ 'access_token': '12345', 'refresh_token': '23456', 'user_id': '34567' });
});

app.get('/1/user/34567/activities/date/today.json', (req, res) => {
  res.status(200).json({ 'summary': { 'steps': '6789' } });
});


app.get('/1/user/34567/profile.json', (req, res) => {
  res.status(200).json({ 'user': {
    'encodedId': 'Rick',
    'memberSince': '2016-10-10',
    'strideLengthWalking': '80'
  } });
});


app.get('/1/user/34567/activities.json', (req, res) => {
  res.status(200).json({ 'lifetime': {
    'total': {
    'steps': '987654321',
    'distance': '1987654321'
    }
  },
  'best': {
    'total': {
      'steps': '65432',
      'distance': '165432'
    }
  } });
});

app.get('/1/user/34567/activities/steps/date/today/1w.json', (req, res) => {
  res.status(200).json({ 'activities-steps': [{ 'value': '11' }, { 'value': '12' },
  { 'value': '13' }, { 'value': '14' }, { 'value': '15' }, { 'value': '16' },
   { 'value': '17' }] });
});


module.exports = exports = app.listen(8000, () => console.log('_update_server up on 8000'));
