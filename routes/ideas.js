const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/',ensureAuthenticated,(req,res)=>{
    Idea.find({user: req.user})
    .sort({date: 'desc'}) 
    .then((ideas)=>{
     res.render('ideas/index',{ideas:ideas});
    })
 })
 
 router.get('/add',ensureAuthenticated,(req,res)=>{
     res.render('ideas/add');
 })
 
 router.get('/edit/:id',(req,res)=>{
     Idea.findOne({
        _id: req.params.id 
     })
     .then((idea)=>{
         res.render('ideas/edit',{idea: idea});
     })
 })
 
 router.put('/:id',(req,res)=>{
     Idea.findOne({
        _id: req.params.id 
     })
     .then((idea)=>{
         idea.title = req.body.title;
         idea.details = req.body.details;
        
 
         idea.save()
         .then(()=>{
             res.redirect('/ideas')
         })
     })
 })
 
 router.delete('/:id',(req,res)=>{
     Idea.remove({_id: req.params.id})
     .then((idea)=>{
         req.flash('success_msg','idea removed')
             res.redirect('/ideas')
     })
 })
 
 router.post('/', (req,res)=>{
   let errors = [];
   if(!req.body.title){
       errors.push({text:'please add a title'})
   }
   if(!req.body.details){
       errors.push({text:'please add some details'})
   }
   if(errors.length > 0){
       res.render('ideas/add',{
           errors: errors,
           title: req.body.title,
           details: req.body.details
       });
   }else{
       const newUser = {
           title: req.body.title,
           details: req.body.details,
           user : req.user
       }
       console.log("---------------------",req)
       new Idea(newUser)
       .save()
       .then(idea => {
           res.redirect('/ideas');
       })
   }
 })

module.exports = router;