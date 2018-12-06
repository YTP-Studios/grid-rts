var mongoose = require('mongoose');

mongoose.connect();

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var userSchema = new mongoose.Schema({
  name: String,
  password: String,
});

userSchema.methods.authenticate = function(pass) {
  return pass === this.password;
};

var user = mongoose.model('User', userSchema);


