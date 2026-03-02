if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
    
const express = require('express');
const app = express();
const listing = require("./Models/listing.js");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('./schema.js');
const review = require('./Models/review.js');
const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js');
const session = require('express-session');
// const MongoStore = require('connect-mongo');
const { default: MongoStore } = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Models/user.js');
const userRoutes = require('./routes/user.js');
const middleware = require('./middleware.js');


const mongoose = require('mongoose');
// const mongo_URL = 'mongodb://127.0.0.1:27017/wanderlust'
const port = 8080;

const DB_URL = process.env.DB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);

async function main(){
    await mongoose.connect(DB_URL);
}

main()
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
});

const store = MongoStore.create({
    mongoUrl: DB_URL,
    secret: process.env.SECRET_KEY,
    touchAfter: 24*60*60,
});
store.on("error", function(e){
    console.log("Session store error", e);
});

const sessionsOptions = {
    store,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly: true,
    },

};


app.use(middleware.currPath);
app.use(session(sessionsOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use('/listings', listingRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).send(message);
    // res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});