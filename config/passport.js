const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('user');

module.exports = function(passport){
passport.use(new LocalStrategy({usernameField: 'email'},(email, password, done)=>{
    User.findOne({
        email: email
    })
    .then(user =>{
        if(!user){
         return done(null, false,{message: 'no user found'} );
        }
bcrypt.compare(password, user.password, (err,isMatch)=>{
    if(err) throw err;
    if(isMatch){
      return done(null, user)
    }else{
        return done(null, false, {message: 'password not matched'});
    }
})
    })
}))

passport.serializeUser(function(user, done) {
    console.log('Enter')
    done(null, user.id);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
}