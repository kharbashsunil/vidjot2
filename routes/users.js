const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
require('../models/users');

const User = mongoose.model('user');
//faskdljflksdajfdskfjdasljfdsl;kfj
router.get('/login',(req,res)=>{
    res.render('./users/login');
})

router.get('/register',(req,res)=>{
    res.render('./users/register');
})

router.post('/register',(req,res)=>{
   let errors = [];
   if(req.body.password != req.body.password2){
       errors.push({text: 'Passwords do not match'})
   }
   if(req.body.password != req.body.password2){
    errors.push({text: 'Passwords must be atleast 4 characters'})
}
if(errors.length > 0){
    res.render('users/register',{
        errors: errors,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
    })
}else{
    User.findOne({email: req.body.email})
    .then((user=>{
        if(user){
            req.flash('error_msg','email already exist');
            res.redirect('/users/login');
        }
        else{
            const newUsers = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            })
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUsers.password,salt,(err,hash)=>{
                    if(err) throw err
                    newUsers.password = hash;
                    newUsers.save()
                    .then(user =>{
                        req.flash('success_msg', 'you are registered and can login')
                        res.redirect('/users/login')
                    })
                })
            })
        }
    }))
}
});

router.post('/login',(req, res, next)=>{
    passport.authenticate('local',
    {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

router.get('/logout', (req, res)=>{
req.logOut();
req.flash('success_msg', 'Successfully log out');
res.redirect("/users/login")
})
module.exports = router;