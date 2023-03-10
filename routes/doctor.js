const { render } = require('ejs');
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
// const db = require('../models/db')
const Doctor = require('../models/doctor');
const e = require('express');
const sessions = require('../app').sessions;
const cookieParser = require('../app').cookieParser;
let session;

var nodemailer = require('nodemailer');

const mongoose = require('mongoose')
const dbURI = 'mongodb+srv://mohamad_aj3:alonssael12A@cluster0.jtnxgjr.mongodb.net/Hospital?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
var db = mongoose.connection

var methodOverride = require("method-override");
router.use(methodOverride("_method"))

router.route('/login').get((req, res) => {
    res.render('doctor/login')
})

router.get('/:id', (req, res) => {
    console.log(session)
    if (session) {
        const id = req.params.id;
        res.render('doctor/Index', { id: id })
    } else {
        res.redirect('/HomePage')
    }
})

router.get('/Index/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('doctor/Index', { id: id })
            })
    } else {
        res.redirect('/HomePage')
    }
})

router.get('/Guide/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('doctor/Guide', { result: result })
            })
    } else {
        res.redirect('/HomePage')
    }
})

router.get('/Appointments/:id', async (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(async result => {
                if (result) await res.render('doctor/Appointments', { patients: result.patients, result: result, appointments: result.appointments, id: id })
            })
    }
    else {
        await res.redirect('/HomePage');
    }
})

router.get('/Patients/:id', async (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(async result => {
                if (result) await res.render('doctor/Patients', { patients: result.patients, result: result, appointments: result.appointments, id: id })
            })
    }
    else {
        await res.redirect('/HomePage');
    }
})

router.get('/Profile/:id', async (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(async result => {
                if (result) {
                    await res.render('doctor/Profile', { result: result, id: id })

                }
            });
    } else {
        await res.redirect('/HomePage');
    }
})

router.get('/About/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('doctor/About', {id:id, result: result })
            })
    }
    else {
        res.redirect('/HomePage')
    }
})

router.get('/Notes/:id', (req, res) => {
    if (session) {
        const id = req.params.id;
        User.findById(id)
            .then(result => {
                if (result) res.render('doctor/Notes', { result: result, id: id })
            })
    } else {
        res.redirect('/HomePage');
    }
})

router.route('/login').post(async (req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    try {
        await User.findOne({ email: email })
            .then((user) => {
                if (!user) { res.redirect('/login404').json({ mssg: "User does not exist" })}
                bcrypt.compare(password, user.password, async (err, result1) => {
                    session = req.session
                    session.userid = email
                    if (err) {
                        res.render('/docotr/login', { msg: "wrong password" })
                    }
                    if (result1) {
                        await Doctor.findOne({ IDS: user.ID })
                            .then((result) => {
                                if (result) {
                                    // res.send("login ok")
                                    session = req.session
                                    console.log(session)
                                    session.userid = req.body.email.toLowerCase()
                                    res.redirect(`/doctor/${user.id}`)

                                    res.end()
                                }
                                else {
                                    res.redirect('/login404');
                                }

                            });
                    }
                    else {
                        res.redirect('/login404')
                    }

                })
            })
    }
    catch {
        res.redirect('/login404')
    }
})



router.route('/Profile/:id').put(async (req, res) => {
    const email = req.body.email.toLowerCase();
    const phonenumber = req.body.phonenumber;
    var hashedPassword = await bcrypt.hash(req.body.password, 10);
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) {
                if (email && phonenumber && req.body.password) {
                    db.collection('users').updateOne({ email: result.email }, {
                        $set: {
                            email: email,
                            phonenumber: phonenumber,
                            password: hashedPassword
                        }

                    })
                    res.redirect(req.get('referer'));
                }
                else {
                    if (email && phonenumber && req.body.password.length === 0) {
                        db.collection('users').updateOne({ email: result.email }, {
                            $set: {
                                email: email,
                                phonenumber: phonenumber
                            }

                        })
                        res.redirect(req.get('referer'));
                    }
                    else {
                        if (email && req.body.password && phonenumber.length === 0) {
                            db.collection('users').updateOne({ email: result.email }, {
                                $set: {
                                    email: email,
                                    password: hashedPassword
                                }

                            })
                            res.redirect(req.get('referer'));
                        }
                        else {
                            if (email.length === 0 && phonenumber && req.body.password) {
                                db.collection('users').updateOne({ email: result.email }, {
                                    $set: {
                                        phonenumber: phonenumber,
                                        password: hashedPassword
                                    }

                                })
                                res.redirect(req.get('referer'));
                            }
                            else {
                                if (email && phonenumber.length === 0 && req.body.password.length === 0) {
                                    console.log('change only email')
                                    db.collection('users').updateOne({ email: result.email }, {
                                        $set: {
                                            email: email
                                        }

                                    })
                                    res.redirect(req.get('referer'));
                                }
                                else {
                                    if (email.length === 0 && phonenumber && req.body.password.length === 0) {
                                        db.collection('users').updateOne({ email: result.email }, {
                                            $set: {
                                                phonenumber: phonenumber
                                            }

                                        })
                                        res.redirect(req.get('referer'));
                                    }
                                    else {
                                        if (email.length === 0 && phonenumber.length === 0 && req.body.password) {
                                            db.collection('users').updateOne({ email: result.email }, {
                                                $set: {
                                                    password: hashedPassword
                                                }

                                            })
                                            res.redirect(req.get('referer'));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

})

router.route('/Appointments/:id/:time/:date/:patn').post(async (req, res) => {
    const time = req.params.time;
    const id = req.params.id;
    const date = req.params.date;
    const n = req.params.patn;
    console.log(id);
    User.findById(id)
        .then(async (result) => {
            if (result) {
                await db.collection('users').updateOne({ fullname: result.fullname }, { $pull: { "appointments": { name: n, date: date, time: time } } })
                db.collection('users').updateOne({ fullname: n }, { $pull: { "appointments": { name: result.fullname, date: date, time: time } } })
                db.collection('allappoints').deleteOne({ name: result.fullname, time: time, date: date })
                User.findOne({fullname:n})
                .then(r=>{
                    if(r){
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'mahospital7@gmail.com',
                                pass: 'njlyzuukbkffwmcq'
                            }
                        });

                        var mailOptions = {
                            from: 'mahospital7@gmail.com',
                            to: r.email,
                            subject: 'Appointment Ended/Canceled',
                            text: `Your Appointment is Cancelled`
                        };
    
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                            }
                        })
                    }
                })
                res.redirect(req.get('referer'));

            }
        })
})

let count = 0;
router.route('/saveNote/:id').post(async (req, res) => {
    count++;
    console.log(count)
    const id = req.params.id;
    const text = req.body.text
    const Note = {
        text: text,
        i: count.toString()
    }
    User.findById(id)
        .then(async result => {
            if (result) {
                await db.collection('users').updateOne({ fullname: result.fullname }, {
                    $push: { notes: Note }
                })
                res.redirect(req.get('referer'));

            }
        })


})


router.route('/deleteNote/:id/:c').post(async (req, res) => {
    const id = req.params.id;
    var text = req.params.c.toString()
    console.log('i= ', text);
    User.findById(id)
        .then(async result => {
            if (result) {
                await db.collection('users').updateOne({ fullname: result.fullname }, {
                    $pull: { notes: { i: text } }
                })
                res.redirect(req.get('referer'));

            }
        })


})

router.route('/LogOut').post((req, res) => {
    console.log('loggin out')
    req.session.destroy();
    session = req.session
    res.redirect('/HomePage')
})

router.all('*', (req, res) => {
    res.status(404).render('login404');
  });


module.exports = router;