const express = require("express");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const passport = require('passport');

// Routes
const index = require("./routes/index");
const authRoute = require("./routes/auth.routes");
const restrictedRoutes = require('./routes/restricted');
const jobsRoutes = require('./routes/jobs.routes');
const informationRoutes = require('./routes/information.routes');

const app = express();

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: "application/vnd.api+json" }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Passport.js initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', authRoute);
app.use('/api', restrictedRoutes);
app.use('/api', jobsRoutes);
app.use('/api', informationRoutes);
// Catch-all route for index
app.use('/', index);

module.exports = app;
