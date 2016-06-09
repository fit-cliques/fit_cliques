const express = require('express');
const app = express();
const Router = express.Router;

let updateRouter = Router();

updateRouter.route('oauth2/token')
  .post((req, res) => {
    res.status(200).json({ 'access_token': '12345', 'refresh_token': '23456', 'user_id': '34567' });
  });

updateRouter.route('1/user/34567/activities/date/today.json')
  .get((req, res) => {
    res.status(200).json({ 'summary': { 'steps': '6789' } });
  });

updateRouter.route('1/user/34567/profile.json')
  .get((req, res) => {
    res.status(200).json({ 'user': {
      'encodedId': 'Rick',
      'memberSince': '2016-10-10',
      'strideLengthWalking': '80'
    } });
  });

updateRouter.route('1/user/34567/activities.json')
  .get((req, res) => {
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

updateRouter.route('1/user/34567/activities/steps/date/today/1w.json')
  .get((req, res) => {
    res.status(200).json({ 'activities-steps': ['11', '12', '13', '14', '15', '16', '17'] });
  });

app.listen(8000, () => console.log('_update_server up on 8000'));
