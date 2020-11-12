const CustomStrategy = require('passport-custom').Strategy;

const my_user = {
  username: 'admin',
  password: process.env.PASSWORD
}

module.exports = function(passport) {

  passport.use('simpleauth', new CustomStrategy(
    function(req, done) {
      
      if (req.body.password !== my_user.password) {
        return done(null, false, { message: 'Incorrect password' });           
      }
      let err = ''
      done(err, my_user);

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
