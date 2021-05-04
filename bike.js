const express = require('express');
const mongodb = require('mongodb');
require('dotenv').config();

var cors = require("cors");
//const nodemailer = require("nodemailer");


const app = express();
const mongoClient = mongodb.MongoClient;
// const objectId = mongodb.ObjectId;
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());




app.post('/book', async (req, res) => {
    try {
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db("bike");
        await db.collection("service").insertOne(req.body)
      //  await MailUser(req.body.email,req.body.firstName,req.body.servicedate)
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




/*async function MailUser(email,name,date) {
    console.log(name)
    console.log(email)
    console.log(date)
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {      
            user:"suryanagarajan01@gmail.com",
            pass:process.env.pwd
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from:"suryanagarajan01@gmail.com", 
        to: email, 
        subject: "Hai..."+"from book my mech", 
        html: `<p>our technician will reach you on ${date}, <span>thanks</span> </p>`, // html body
    });

    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Mailed!!");
        }
    });

}
*/
app.listen(port, () => console.log("started at port ", port));