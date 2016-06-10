# Fit-Cliques
#### An API and data visualization app for individuals using Fitbit products
### https://fit-cliques.herokuapp.com

#### Built using
* **M** ongoDB data persistance
* **E** xpress routing
* **A** ngular client
* **N** ode backend

#### Register yourself on our app on heroku!
* Visit https://fit-cliques.herokuapp.com and add yourself to the pile of users.  Your stats will be synced for your own use, as well as added to the cumulative totals for the zipcode you provide on sign in.  Do your neighborhood proud!  Walk around, you might even meet someone else trying to beef up your area's stats.
* Your data will update when you sign up, and every time you log in.  We do hourly updates of all users so you can track everyone's progress.
* You can resync your account when things go sideways.  The internet isn't always 100% reliable, so there are times when the secure tokens used in Fitbit's authentication process expire or are otherwise rendered invalid.  We have you covered.  In the event that this happens, we allow you to reauthenticate your account and get back in the game.

#### Getting your own app started locally
Want to server your own version of Fit-Cliques?  You can probably do it!  There are a few steps you will need to take.  
* You will first need to register your app with the Fitbit dev center and receive your unique CLIENT_ID and CLIENT_SECRET.  These are used to authenticate with the Fitbit API.  These should be served as environment variables to your app.
* There are several places that you will need to insert your own information into the Fit-Cliques environment.  
  * app/config.js holds the base URL to your app.  IF you are serving locally, this will be localhost: + YOUR_PORT or something similar.  If you are serving this online, it will be the main URL of your site.
  * Fitbit requires you to leave your page and go to a page within their domain to allow users to give your app access to their account.  You will need to update the URL that you send people too, as well as the redirect_uri that fitbit will send people back too.
  * Links to the fitbit auth page can be found in the app's templates for auth views (specifically sign in and resync), as well as the angular auth controllers for sign in and resync.
  * The redirect URIs can be found in the angular user_fb_auth service, specifically the x-www-form-urlencoded data sent in the post requests to fitbit in the getFbTokens and resyncFbTokens methods.
* From there, it is up to you!  The Fit-Cliques API is set up to do all sorts of maths and returns a veritable cornucopia of crunched data from the users it persists.

#### Fit-Cliques API
* Once you have your own app running, Fit-Cliques will provide the following data, served to you by a REST API in JSON format.
* Here are the more interesting individual user datasets served by the api, routed via `/api/user/_user_id_`
 * cliques: an optional array of unique groups to expand functionality past just zipcodes.
 * todaySteps: the current number of steps the user has travelled today.
 * todayDistance: the current distance the user has travelled today.
 * weekSteps: the current number of steps the user has travelled in the past week.
 * weekAvgSteps: The average number of steps per day the user has travelled in the past week.
 * weekDistance: the total distance the user has travelled in the past week.
 * lifetimeSteps: the total number of steps the user has travelled since they started tracking.
 * lifetimeAvgSteps: the average steps per day the user has travelled since they started tracking.
 * lifetimeDistance: the total distance a user has travelled since they started tracking.
 * lastSeven: an array containing objects representing the users steps for the past seven days, formatted as follows:
 ```
 {
   dateTime: YYYY-MM-DD formatted date
   value: number of steps
 }
 ```
 * bestSteps: an object representing the day with the users top number of steps since they started tracking, formatted as follows:
  ```
  {
    date: YYYY-MM-DD formatted date
    value: number of steps
  }
  ```
 * bestDistance: an object representing the day with the users distance travelled  since they started tracking, formatted as follows:
  ```
  {
    date: YYYY-MM-DD formatted date
    value: distance travelled
  }
  ```
* Here are the more interesting zipcode datasets served by the api, routed via `/api/zipcode/_unique_zipcode_`
 * zipTotalTodaySteps: total steps travelled today by all users in this zipcode.
 * zipTotalTodayDistance: Total distance travelled today by all users in this zipcode.
 * avgTodaySteps: average steps travelled today by users in this zipcode.
 * avgTodayDistance: average distance travelled today by users in this zip code
 * zipTotalWeekSteps: total steps travelled this week by all users in this zipcode.
 * zipTotalWeekDistance: total distance travelled this week by all users in this zipcode.
 * avgWeekSteps: average total steps this week by users in this zipcode.
 * avgWeekStepsPer: average daily steps this week by users in this zipcode.
 * avgWeekDistance: average total distance this week by users in this zipcode.
 * zipTotalLifetimeSteps: total steps by all users since they started tracking in this zipcode.
 * zipTotalLifetimeDistance: total distance travelled by all users since they started tracking in this zipcode.
 * avgLifetimeSteps: average total steps per user in this zipcode since they started tracking.
 * avgLifetimeStepsPer: average steps per day per user in this zipcode since they started tracking
 * avgLifetimeDistance: average total distance travelled per user in this zipcode since they started tracking

#### We take security seriously!
Fitbit uses OAUTH 2.0 to handle all data transfer via their API.  These data transfers are authenticated using secure tokens with short expiration times.  The Fit-Cliques API uses an authentication process modeled after OAUTH to store these tokens.  This app also does not persist any identifying information, just the raw numbers we use for our data-crunching.  Fit-Cliques also never has access to your passwords in plain text.  All passwords are hashed and salted before they are processed by our backend.

#### We take testing seriously!
Backend unit testing is handled with Mocha and Chai.  Angular client unit testing is handled with Karma and Angular-mocks.

#### We take task automation and bundling seriously! (because it means less work for us)
Task management handled with gulp. File bundling handled with Webpack.  See a full list of dependencies in package.json

#### Deployed on Heroku using the mLabs mongo database add-on and Heroku Scheduler.

### TEAM MEMBERS:
* Rachel Burke
* Greg Magdsick
* Phillip Nguyen
* Ben Harding
