const port =process.env.PORT || 5000;
const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash')
const bodyParser = require('body-parser');
const session = require('express-session');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const ideas = require('./routes/ideas');
const users = require('./routes/users');
const app = express();
const path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('./config/passport')(passport);

const db = require('./config/database')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))

  app.use(passport.initialize());
  app.use(passport.session())

app.use(flash());

app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null
    next();
})

mongoose.connect(db.mongoURI,{
    useMongoClient: true
})
.then(()=>{console.log('mongodb is conected......')})
.catch((err)=>{console.log(err)});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//views/layouts/main.handlebars:

app.get('/',(req,res)=>{
    const title = 'Welcome999999999999999';
    res.render('index',{title:process.env.NODE_ENV});
})

app.get('/about',(req,res)=>{
    res.render('about');
})

app.use('/ideas', ideas);
app.use('/users', users);
app.use(express.static(path.join(__dirname,'public')))

app.listen(port ,()=>{
    console.log(`Server started on port ${port}`);
})