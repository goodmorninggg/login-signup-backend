var Userdb = require("../models/users");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;
    if (!fname || !lname || !email || !password) {
      return res
        .status(400)
        .json({
          status: "Failed",
          message: "field is missing in registration",
        });
    } else {
      let user = Userdb.findOne({ email: email });
      // console.log(result)
      //  => {
      if (user.email) {
        return res
          .status(406)
          .send({ message: "Email Already taken! Try another one" });
      } else {
        const salt = await bcrypt.genSalt(12);
        const hashpass = await bcrypt.hash(password, salt);
        let data = new Userdb({
          fname: fname,
          lname: lname,
          email: email,
          isEmailVerified: false,
          status: "active",
          password: hashpass,
        });
        await data.save();
        const user = await Userdb.findOne({ email: email });
        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ userID: user._id }, secret, {
          expiresIn: "30m",
        });
        const link = `${process.env.base_url}/api/verifyemail/${user._id}/${token}`;
        console.log(link);
        res
          .json({
            status: "success",
            message: "Verification Email sent to your mail id",
            
            Link: link,
          });
      }
      // });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error Occoured in registiring user" });
  }
};

exports.confirmemail = async (req, res) => {
  const { id, token } = req.params;
  const user = await Userdb.findById(id);
  const new_secret = user._id + process.env.JWT_SECRET_KEY;
  try {
    jwt.verify(token, new_secret);
    if (user.isEmailVerified === true) {
      res
        .status(200)
        .json({ status: "success", message: "Email Already Verifyied" });
    } else {
      await Userdb.findByIdAndUpdate(
        id,
        { isEmailVerified: true },
        { useFindAndModify: false }
      );
      const token = jwt.sign({ userID: id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "10d",
      });
      console.log(token);
      res
        .status(200)
        .json({
          status: "success",
          message: "Email Verfiyed successfully",
          token: token,
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          error.message ||
          "error Occoured in verifing email maybe verification link expire",
      });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Data Cannot ne empty" });
    } else {
      const user = await Userdb.findOne({ email: email });
      if (user != null) {
        ismatch = await bcrypt.compare(password, user.password);
        if (ismatch && user.email == email) {
          const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "10d" }
          );
          return res
            .status(200)
            .json({
              status: "succes",
              message: "user login successfully",
              token: token,
            });
        } else {
          return res
            .status(400)
            .json({ message: "Email or password is wrong" });
        }
      } else {
        return res
          .status(404)
          .json({ message: "user not found With this Email ID" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured in login a user" });
  }
};

exports.getVerificationLink = async (req, res) => {
  const secret = req.user._id + process.env.JWT_SECRET_KEY;
  const token = jwt.sign({ userID: req.user._id }, secret, {
    expiresIn: "30m",
  });
  const link = `${process.env.base_url}/api/verifyemail/${req.user._id}/${token}`;
  console.log(link);
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  let info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: req.user.email,
    subject: "Please Verify Your Email",
    html: `<a href = ${link}>click here <a/>to verify your email `,
  });
  res
    .status(200)
    .json({
      status: "success",
      message: "Verification Email sent to your mail id",
      info: info,
      Link: link,
    });
};
