var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var Schema = db.Schema;

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

var User = db.model('User', userSchema);

User.comparePassword = function(candidatePassword, savedPassword, callback) {
    bcrypt.compare(candidatePassword, savedPassword, function(err, isMatch) {
      if (err) return callback(err);
      callback(null, isMatch);
    });
  }
userSchema.pre('save', function(next){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});



module.exports = User;










// var db = require('../config');
// var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');
//
// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });
//
// module.exports = User;
