import Balance from "../model/balanceModel.js";
import User from "../model/userModel.js";
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