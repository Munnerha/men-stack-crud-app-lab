/* eslint-disable no-console */

require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Models
const Gpu = require('./models/gpu.js');

const app = express();

// MIDDLEWARE
app.use(express.urlencoded({ extended: false}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// MONGO DB CONNECTION
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

// GPUs
app.get('/gpus/new', (req,res) => {
  res.render('gpus/new.ejs');
});

app.post('/gpus', async (req, res) => {
  try {
    if (req.body.isCooledDown === 'on') {
      req.body.isCooledDown = true;
    } else {
      req.body.isCooledDown = false;
    }

    await Gpu.create(req.body);

    res.redirect('/gpus');
  } catch (err) {
    console.log(err);
    res.send('failed to create');
  }
});

app.get('/gpus', async (req, res) => {
  try {
    const gpus = await Gpu.find();
    res.render('gpus/index.ejs', { gpus });
  } catch (err) {
    console.log(err);
    res.send('failed to get all gpus');
  }
});

app.get('/gpus/:id', async (req, res) => {
  try {
    const gpu = await Gpu.findById(req.params.id);

    res.render('gpus/show.ejs', { gpu });
  } catch (err) {
    console.log(err);
    res.send('failed to fetch the gpu');
  }
});

app.delete('/gpus/:id', async (req, res) => {
  try {
    await Gpu.findByIdAndDelete(req.params.id);
    res.redirect('/gpus');
  } catch (err) {
    console.log(err);
    res.send('unable to delete gpu');
  }
});

app.get('/gpus/:id/edit', async (req, res) => {
  try {
    const gpu = await Gpu.findById(req.params.id);
    res.render('gpus/edit.ejs', { gpu });
  } catch (err) {
    console.log(err);
    res.send('unable to update the gpu');
  }
});

app.put('/gpus/:id', async (req, res) => {
  try {
    if (req.body.isCooledDown === 'on') {
      req.body.isCooledDown = true;
    } else {
      req.body.isCooledDown = false;
    }

    await Gpu.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/gpus/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.send('unable to update the gpu');
  }
});

app.listen(3000, () => {
  console.log('server is running!!!!');
});


