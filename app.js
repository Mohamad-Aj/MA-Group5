const express = require('express');
const app = express();
var path = require('path');
var cons = require('consolidate');
const bodyParser = require("body-parser")
const User = require('./models/user')
const bcrypt = require('bcrypt');
const Doctor = require('./models/doctor')
const Nurse = require('./models/nurse')
const mongoose = require('mongoose');
const nurseRouter = require('./routes/nurse');
const indexRouter = require('./routes/index')
const doctorRouter = require('./routes/doctor');
const patientRouter = require('./routes/patient');
const { json } = require('body-parser');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
var nodemailer = require('nodemailer');


var methodOverride = require("method-override");
app.use(methodOverride("_method"))

//
let session
app.use(cookieParser());
app.use(express.json())
const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: 'secret',
    cookie: { maxAge: oneDay },
    resave: false,
    saveUninitialized: true
}))


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }))

const dbURI = 'mongodb+srv://mohamad_aj3:alonssael12A@cluster0.jtnxgjr.mongodb.net/Hospital?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async (result) =>{ await console.log('connected to db')})
    .catch((err) => console.log(err));
var db = mongoose.connection;

// db.on("error",console.error.bind(console,"connection error: "));
// db.once("open",function(){
//     console.log("connected successfully");
// });

app.get('/',(req,res)=>{
    res.render('HomePage')
    res.statusCode = 200;
});


app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/login404' , (req, res) => {
    res.render('login404')
})

app.get('/HomePage', (req, res) => {
    res.render('HomePage')
})

app.get('/forgetpassword', (req, res) => {
    res.render('forgetpassword1')
})

app.get('/forgetpassword2', (req, res) => {
    res.render('forgetpassword2')
})



app.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    db.collection('users').insertOne({
        fullname: req.body.fullname,
        birthdate: req.body.birthdate,
        email: req.body.email.toLowerCase(),
        password: hashedPassword,
        ID: req.body.id1,
        phonenumber: req.body.phonenumber,
        gender: req.body.gender,
        JID: "/",
        notes: [],
        appointments: [],
        patients: [],
        OrderedCard: false,
        code:'none'
    })
    Doctor.findOne({ IDS: req.body.id1 })
        .then((result) => {
            if (result) {
                db.collection('alldoctors').insertOne({ Name: req.body.fullname, email: req.body.email.toLowerCase() })
            }
        })
    Nurse.findOne({ PDS: req.body.id1 })
        .then((result1) => {
            if (result1) {
                db.collection('alldoctors').insertOne({ Name: req.body.fullname, email: req.body.email.toLowerCase() })
            }
        })
    res.redirect('/HomePage');
});



function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.post('/forgetpassword1', async (req, res) => {
    const code = makeid(11).toString();
    await User.findOne({email:req.body.email.toLowerCase()})
    .then(async result=>{
        if(result){
            console.log('im in codeeeee')
            console.log(code)
            await db.collection('users').updateOne({email:req.body.email},{
                $set:{
                    code:code
                }
            })
        }
    })
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mahospital7@gmail.com',
            pass: 'njlyzuukbkffwmcq'
        }
    });


    var mailOptions = {
        from: 'mahospital7@gmail.com',
        to: req.body.email,
        subject: 'Reset Password',
        text: `Your Security Code is ${code}`
    };

    await transporter.sendMail(mailOptions,async function (error, info) {
        if (error) {
            console.log(error);
        }
        // } else {

        // //    await console.log('Email sent: ' + info.response);
        // }
    });
    res.redirect('/forgetpassword2');

});

app.post('/forgetpassword2', async (req,res)=>{
    const newCode = makeid(11).toString();
    const email = req.body.email;
    const code = req.body.code;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    User.findOne({email:email})
    .then(result=>{
        if(result){
            if(code === result.code){
                db.collection('users').updateOne({email:email},{
                    $set:{
                        password:hashedPassword
                    }
                })
                db.collection('users').updateOne({email:email},{
                    $set:{
                        code:newCode
                    }
                })
            }
            res.redirect('/HomePage')
        }
    })

})



app.use('/nurse', nurseRouter)
app.use('/', indexRouter)
app.use('/doctor', doctorRouter)
app.use('/patient', patientRouter)

app.all('*', (req, res) => {
    res.status(404).render('login404');
  });

app.listen(3000)

module.exports = { app, session, sessions, cookieParser, db };