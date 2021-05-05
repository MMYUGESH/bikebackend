const express = require('express');
const mongodb = require('mongodb');
require('dotenv').config();
const nodemailer = require("nodemailer");
const app = express();
const mongoClient = mongodb.MongoClient;
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const port = process.env.PORT || 4000;
var cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(function(req, res, next) {  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers","*");
res.header('Access-Control-Allow-Credentials', true);
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
}); 


app.post('/book', async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db("bike");
        await db.collection("service").insertOne(req.body)
        await MailUser(req.body.email,req.body.firstName,req.body.dateTime,req.body.model)
        res.status(200).json({message:"success"})
        clientInfo.close();
    } 
    catch (error) {
        console.log(error);
    }
})
app.get('/bookings', async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db("bike");
       let data = await db.collection("service").find().toArray();
        res.status(200).json(data);
      clientInfo.close();

    } 
    catch (error) {
        console.log(error);
    }
})




async function MailUser(email,name,date,model) {
    console.log(name)
    console.log(email)
    console.log(date)
    console.log(model)
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {      
            user:"mmyugesh@gmail.com",
            pass:process.env.pwd
        }
    });

    // sending mail 
    let info = await transporter.sendMail({
        from:"mmyugesh@gmail.com", 
        to: email, 
        subject: "Confirmation for booking bike service from MechMach", 
        html: `<p>Our staff will reach you on ${date} for your ${model} service<br><br><span><b>Thankyou for booking MechMach!!</b></span> </p>`, // html body
    });

    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Mailed Successfully");
        }
    });

}

app.listen(port, () => console.log("started at port ", port));