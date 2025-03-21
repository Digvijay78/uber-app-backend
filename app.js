const dotenv = require('dotenv')

dotenv.config();


const express = require('express');
const cors = require('cors')
const app = express();
const connectToDb = require("./db/db")
const userRoutes = require("./routes/user.routes")

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}))

app.get("/" , (req, res) => {
    res.send("Hello world");
})

app.use("/auth", userRoutes)




app.use((error, req, res, next) => {
    console.log("Error koko", error.statusCode);

    const statusCode = error.statusCode || 500;
    const message = error.message;
    const details = error.details || null;

    res.status(statusCode).json({
        message: message,
        details: details // Include validation errors in response
    });
});




module.exports = app;