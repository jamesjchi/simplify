var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

var UserSchema = mongoose.Schema({
  name: { type: String, maxlength: 30},
  email: { type: String, required: true, unique: true, minlength: 10, maxlength: 100 },
  password: { type: String, minlength: 5, maxlength: 100},
  phone: String,
  location: String,
  notifications: Boolean
});

UserSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var returnJson = {
      id: ret._id,
      email: ret.email,
      name: ret.name,
      phone: ret.phone
    };
    return returnJson;
  }
});

UserSchema.methods.authenticated = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, res) {
    if (err) {
      callback(err);
    } else {
      callback(null, res ? this : false);
    }
  });
}

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    next();
  } else {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
  }
});

module.exports = mongoose.model('User', UserSchema);