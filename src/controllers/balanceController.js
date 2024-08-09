import Balance from "../model/balanceModel.js";
import User from "../model/userModel.js";
import { sendEmail } from "../utils/emailService.js";
import { handleError } from "../utils/errorHandlers.js";
import { BalanceValidationSchema } from "../validations/balanceValidator.js";

export const addBalance=async(req,res)=>{
    try {
        const { userId,balance } = req.params;
        const {error,value}=BalanceValidationSchema.validate(balance)
        if (error) {
            return res
              .status(400)
              .json({ success: false, message: error.details[0].message });
          }
        const existingUser=await User.findById(userId)
        if (existingUser){
            const existbalance=await Balance.findOne({userId})
            if(existbalance){
                existbalance.balance=balance
                await existbalance.save()
                return res.status(200).json({
                    success:true,
                    message:"Balance has been Successfully added"
                })

            }
            const balancedata=new Balance({balance,userId})
            await balancedata.save()
            const html=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Balance Update</title>
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Trump Financeco Corporation</h1>
        </div>
        <div class="content">
            <h2>Hello ${existingUser.name},</h2>
            <p>Your balance has been successfully updated. You can view your updated balance by clicking the button below:</p>
            <a href="https://tfc.trumpfinanceco.us/dashboard" class="button">
                View Balance
            </a>
            <p>If you have any questions or concerns, please contact our support team.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Trump Financeco Corporation. All rights reserved.</p>
            <p>If you have any questions, please <a href="mailto:support@trumpfinanceco.com">contact us</a>.</p>
        </div>
    </div>
</body>
</html>
`
await sendEmail(existingUser.email,"Balance  Update","",html)

            return res.status(200).json({
                success:true,
                message:"Balance has been Successfully added"
            })
        }else{
             res.status(200).json({
                success:false,
                message:"User are not Founed"
            })
        }


    } catch (error) {
        handleError(res,error)
        
    }
}
export const getBalance=async(req,res)=>{
    try {
        const { userId } = req.params;
        if (!userId){
           return res.status(200).json({
                success:false,
                message:"User Id are not Found"
            })
        }
        let data=await Balance.findOne({userId})
        return res.status(200).json({
            success:true,
            data:data
        })
    } catch (error) {
        handleError(res,error)
    }
}