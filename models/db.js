const mongoose = require('mongoose');
// const Nurse = require('../models/nurse')

const dbURI = 'mongodb+srv://mohamad_aj3:alonssael12A@cluster0.jtnxgjr.mongodb.net/Hospital?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

module.exports = db;