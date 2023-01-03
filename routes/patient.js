const { render } = require('ejs');
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
// const db = require('../models/db')
const Doctor = require('../models/doctor')
const Nurse = require('../models/nurse')
const mongoose = require('mongoose');
const sessions = require('../app').sessions;
const cookieParser = require('../app').cookieParser;
let session;
// const Nurse = require('../models/nurse')

const dbURI = 'mongodb+srv://mohamad_aj3:alonssael12A@cluster0.jtnxgjr.mongodb.net/Hospital?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

var methodOverride = require("method-override");
router.use(methodOverride("_method"))


router.get('/login', (req, res) => {
    res.render('patient/login')
})


router.route('/register').get((req, res) => {
    res.render('patient/register')
})


router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.render('patient/Index', { id: id })
})

router.get('/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/Index', { result: result })
            })
    }
    else {
        res.redirect('/HomePage')
    }

})

router.get('/Index/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/Index', { result: result })
            })
    }
    else {
        res.redirect('/HomePage')
    }
})

router.get('/Medicine/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/Medicine', { result: result })
            })
    }
    else {
        res.redirect('/HomePage')
    }
})

router.get('/OrderCard/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/OrderCard', { result: result })
            })
    }
    else {
        res.redirect('/HomePage')
    }
})

router.get('/Rate/:id', (req, res) => {

    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {

                const rateRef = db.collection('rates');
                rateRef.find().toArray(async (err, a) => {
                    const DocRef = db.collection('alldoctors');
                    DocRef.find().toArray((err, arr) => {
                        if (result) res.render('patient/Rate', { doctors: arr, Rates: a, result: result })
                    })

                })
            })
    }
    else {
        res.redirect('/HomePage')
    }
})

router.get('/Lab/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('patient/Lab', { id:id, result: result })
            })
    } else {
        res.redirect('/HomePage')
    }
})




router.route('/login').post(async (req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    try {
        User.findOne({ email: email })
            .then((user) => {
                if (!user) { res.redirect('/login404').json({ mssg: "User does not exist" }) }
                bcrypt.compare(password, user.password, (err, result1) => {
                    if (err) {
                        res.json({
                            error: err
                        })
                        res.redirect('/login404')
                    }

                    if (result1) {
                        db.collection('alldoctors').findOne({ email: email })
                            .then(ress => {
                                if (ress) {
                                    return res.redirect('/login404')
                                }
                                else {
                                    session = req.session
                                    session.userid = email
                                    return res.redirect(`/patient/${user.id}`)

                                }
                            })
                    }
                    else {
                        return res.redirect('/login404')
                    }

                })
            })
    }
    catch {
        return res.redirect('/login404')
    }
})


router.route('/Rate/:id').post(async (req, res) => {
    console.log('im in rate')
    const id = req.params.id;
    User.findById(id)
        .then(patient => {
            if (patient) {
                const name = patient.fullname;
                const Review = {
                    text: req.body.rating,
                    Dr: req.body.docss.toString(),
                    Pat: name
                }
                db.collection('rates').insertOne(Review)
                res.redirect(req.get('referer'))
            }
        })
})

router.route('/Medicine/:id/:med').post((req, res) => {
    const id = req.params.id;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mahospital7@gmail.com',
            pass: 'njlyzuukbkffwmcq'
        }
    });

    User.findById(id)
        .then(result => {
            if (result) {
                console.log(result)
                var mailOptions = {
                    from: 'mahospital7@gmail.com',
                    to: result.email,
                    subject: 'Medicine Order',
                    text: `Thanks For your Purcahse You will have ${req.params.med} in 3-5 days Payment on delivery!`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        })
    res.redirect(req.get('referer'));

})

router.route('/OrderCard/:id').post((req, res) => {
    const id = req.params.id;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mahospital7@gmail.com',
            pass: 'njlyzuukbkffwmcq'
        }
    });

    User.findById(id)
        .then(result => {
            if (result) {
                console.log(result)
                if (result.email != req.body.email) { res.redirect(`/patient/Index/${result.id}`) }
                else {
                    console.log(result)
                    var mailOptions = {
                        from: 'mahospital7@gmail.com',
                        to: result.email,
                        subject: 'Magnet Card Order',
                        text: `Thanks For your Order You will have the card in 5-7 days!
                    Note: the name you entered will be ${req.body.name}`
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    db.collection('users').updateOne({ email: result.email }, {
                        $set: { OrderedCard: true }
                    })
                    res.redirect(req.get('referer'));
                }
            }
        })

})


router.route('/LogOut').post((req, res) => {
    console.log('loggin out in patient')
    req.session.destroy();
    session = req.session
    res.redirect('/HomePage')
})

module.exports = router;