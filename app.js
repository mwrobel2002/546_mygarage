const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

const static = express.static(__dirname + '/public');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.use(express.json());

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}));

const logger = function(req, res, next) {
  curDate = new Date().toUTCString();
  method = req.method;
  route = req.originalUrl;
  authenticatedCheck = 'Not Logged In';
  if (req.session.user) {
      authenticatedCheck = 'Logged In';
  }
  console.log("[" + curDate + "] " + method + " " + route + " " + authenticatedCheck)
  console.log(req);
  next();
}

app.use(logger);
// app.use(
//   session({
//     name: 'CS546FinalProject',
//     secret: "This is a secret.. shhh don't tell anyone",
//     saveUninitialized: false,
//     resave: false,
//     cookie: {maxAge: 60000}
//   })
// );

// app.use('/private', (req, res, next) => {
//   console.log(req.session.id);
//   if (!req.session.user) {
//     return res.redirect('/');
//   } else {
//     next();
//   }
// });

// app.use('/login', (req, res, next) => {
//   if (req.session.user) {
//     return res.redirect('/homepage');
//   } else {
//     //here I',m just manually setting the req.method to post since it's usually coming from a form
//     req.method = 'POST';
//     next();
//   }
// });

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
