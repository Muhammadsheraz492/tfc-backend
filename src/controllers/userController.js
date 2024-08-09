import User from "../model/userModel.js";
import {
  comparePassword,
  generateToken,
  hashPassword,
  verifyToken,
} from "../utils/authHelpers.js";
import { handleError } from "../utils/errorHandlers.js";
import {
  userValidationSchema,
  userloginValidation,
} from "../validations/userValidationSchema.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { sendEmail } from "../utils/emailService.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createUser = async (req, res) => {
  try {
    var { error, value } = userValidationSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    value.password = await hashPassword(value.password);
    const newUser = new User(value);
    await newUser.save();
    const token = generateToken(newUser._id);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background-color: #000;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            font-size: 20px;
            margin-top: 0;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            color: #fff;
            background-color: #000;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            background-color: #f4f4f4;
            color: #888888;
            text-align: center;
            padding: 10px;
            font-size: 14px;
        }
        .footer a {
            color: black;
            text-decoration: none;
        }
        .email{
        color:#fff
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Trump Finance Corporation</h1>
        </div>
        <div class="content">
            <h2>Hello ${newUser.name},</h2>
            <p>Thank you for registering with us. To complete your registration, please verify your email address by clicking the button below:</p>
            <a href="${process.env.PRODUCTION}/api/users/verify/${token}" class="button" style={{color:"#fff"}}>
            <span class="email">Verify Email</span>
            </a>
            <p>If you did not create an account, no further action is required.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
            <p>If you have any questions, please <a href="mailto:support@yourcompany.com">contact us</a>.</p>
        </div>
    </div>
</body>
</html>`;
    await sendEmail(newUser.email, "Verification", "", html);
    res.status(201).json({ success: true, ...newUser.toObject() });
  } catch (error) {
    handleError(res, error);
  }
};

export const verifyUser = async (req, res) => {
  let { token } = req.params;
  if (!token) {
    return res.send("Please provide token");
  }
  try {
    const decoded = verifyToken(token);
    let { userId } = decoded;
    const user = await User.findOne({ _id: userId });
    user.isVerify = true;
    await user.save();
    await res.redirect("https://tfc.trumpfinanceco.us/");
  } catch (error) {
    res
      .status(401)
      .sendFile(join(__dirname, "..", "public", "tokenExpired.html"));
  }
};

export const login = async (req, res) => {
  try {
    var { error, value } = userloginValidation.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email: value.email });
    if(!existingUser){
        return res.status(500).json({
            success:false,
            message:"Email and Password are incorrect"
        })
    }
    if (!existingUser.isVerify) {
      const token = generateToken(existingUser._id);

      const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              overflow: hidden;
          }
          .header {
              background-color: #000;
              color: #ffffff;
              padding: 20px;
              text-align: center;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 20px;
          }
          .content h2 {
              font-size: 20px;
              margin-top: 0;
          }
          .content p {
              font-size: 16px;
              line-height: 1.5;
          }
          .button {
              display: inline-block;
              font-size: 16px;
              font-weight: bold;
              color: #fff;
              background-color: #000;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
          }
          .footer {
              background-color: #f4f4f4;
              color: #888888;
              text-align: center;
              padding: 10px;
              font-size: 14px;
          }
          .footer a {
              color: black;
              text-decoration: none;
          }
          .email{
          color:#fff
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Trump Finance Corporation</h1>
          </div>
          <div class="content">
              <h2>Hello ${existingUser.name},</h2>
              <p>Thank you for registering with us. To complete your registration, please verify your email address by clicking the button below:</p>
              <a href="${process.env.PRODUCTION}/api/users/verify/${token}" class="button" style={{color:"#fff"}}>
              <span class="email">Verify Email</span>
              </a>
              <p>If you did not create an account, no further action is required.</p>
          </div>
          <div class="footer">
              <p>&copy; 2024 Your Company. All rights reserved.</p>
              <p>If you have any questions, please <a href="mailto:support@yourcompany.com">contact us</a>.</p>
          </div>
      </div>
  </body>
  </html>`;
      await sendEmail(existingUser.email, "Verification", "", html);
      return res.status(200).json({
        success: false,
        message:
          "Please verify your email. Check your email for the verification link",
      });
    }
    let result = await comparePassword(value.password, existingUser.password);
    if (!result) {
     return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    req.session.user =existingUser 
    const userResponse = existingUser.toObject();
    delete userResponse.password
    return res.status(200).json({
        success: true,
        message: 'Login successful',
        user:userResponse
    });

  } catch (error) {
    handleError(res, error);
  }
};

export const getallUser=async(req,res)=>{
    try {
        let data=await User.find()
        return res.status(200).json({
            success:true,
            data
        })
    } catch (error) {
        handleError(res,error)
    }
}


export const forgetPassword=(req,res)=>{
    try {
        const {email}=req.params;
        const exitingUser=User.find({email:email})
        if (exitingUser) {
            
        }
       return res.status(200).json({
            success:false,
            message:"User are not Found"
        })
        
    } catch (error) {
        handleError(res,error)
    }
}