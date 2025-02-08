require('dotenv').config();

const express = require('express')
const app = express()
const http = require("http");
const cors = require("cors");
const session = require('express-session');
const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const routes = require("./routes/linkedin.routes.js");

const { Server } = require("socket.io");

const PORT = 3001;

const config = {
  linkedInCallback: () => "TODO"
}

app.set('view engine', 'ejs');

// connection db
/**
 * For Auth: Execute the following query in MYSQL Workbench
 * 
 * ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
 * flush privileges;
 */

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

require("./routes/request.routes.js")(app);
require("./routes/answer.routes.js")(app);
require("./routes/user.routes.js")(app);
require("./routes/upload.routes.js")(app);


require('dotenv').config();

//const CLIENT_ADDRESS = process.env.CLIENT_ADDRESS || "http://localhost:3000";
const CLIENT_ADDRESS = "http://86.119.46.224:3000";

//console.log(process.env);

///

// linkedin setup
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

/*
passport.use(new LinkedInStrategy({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: config.linkedInCallback,
      scope: ['r_emailaddress', 'r_liteprofile'],
    }, function (token, tokenSecret, profile, done) {
      return done(null, profile);
    }
));
*/

app.use('/', routes);

///

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_ADDRESS
  },
});

io.on("connection", (socket) => {
  console.log(`Connected user: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`SERVER RUNNING on port: ${PORT}`);
});

//Test Git