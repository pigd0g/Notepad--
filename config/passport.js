const CustomStrategy = require('passport-custom').Strategy;
var yub = require('yub');

// initialise the yub library
yub.init(process.env.YUBI_CLI, process.env.YUBI_KEY);

const my_user = {
  username: 'admin',
  password: process.env.PASSWORD
}

module.exports = function(passport) {

  passport.use('simpleauth', new CustomStrategy(
    function(req, done) {
      
      yub.verify(req.body.password, function(err,data) {
        //console.log(err, data)
        if (err) {
          return done(null, false, { message: 'Incorrect password' });
        }
        if (data.serial != process.env.YUBI_SERIAL || !data.valid) {
          return done(null, false, { message: 'Incorrect password' });
        }

        done(err, my_user);
      });
    }
  ));
  
  passport.serializeUser(function(user, done) {
    done(null, my_user.username);
  });

  passport.deserializeUser(function(id, done) {
    let err = ''
    done(err, my_user);
  });

};
