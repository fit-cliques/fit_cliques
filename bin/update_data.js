const config = require('../app/js/config');
const mongoose = require('mongoose');
const update = require('./_update_data');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/fit_cliques_DB');
update(config);
