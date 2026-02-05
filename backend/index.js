const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://sivasankaranit44_db_user:sendmate123@sendmate.cuhofli.mongodb.net/passkey?appName=sendmate"
)
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("Mongo error", err));



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sendmate228@gmail.com",
    pass: "qbyihtduckjgbfyx", 
  },
});

const email = (msg, recipient) => ({
  from: "sendmate228@gmail.com",
  to: recipient,
  subject: "Message from SendMate",
  text: msg,
});

const sendMails = async ({ msg, emailList }) => {
  for (const recipient of emailList) {
    await transporter.sendMail(email(msg, recipient));
    console.log(`Email sent to ${recipient}`);
  }
};

app.post("/sendmails", async (req, res) => {
  try {
    await sendMails(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => {
  console.log("SendMate Server is running on port 5000...");
});
