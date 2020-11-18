const CustomStrategy = require('passport-custom').Strategy;
var yub = require('yub');

// initialise the yub library errors if env vars not set
yub.init(process.env.YUBI_CLI || 'x', process.env.YUBI_KEY || 'x');

const my_user = {
  username: 'admin',
  password: process.env.PASSWORD
}

module.exports = function(passport) {

  passport.use('simpleauth', new CustomStrategy(
    function(req, done) {
      
      if (process.env.YUBI_SERIAL) {
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
      } else {
        if (req.body.password !== my_user.password) {
          return done(null, false, { message: 'Incorrect password' });           
        }
        let err = ''
        done(err, my_user);        
      }
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
