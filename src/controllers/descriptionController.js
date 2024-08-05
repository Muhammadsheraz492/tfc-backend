import Description from "../model/descriptionModel.js";
import User from "../model/userModel.js";
import { handleError } from "../utils/errorHandlers.js";
import { DescriptionValidationSchema } from "../validations/descriptionValidation.js";

export const addDescription=async(req,res)=>{
    try {
        const { userId,description,date } = req.params;
        // console.log(date);
        const {error,value}=DescriptionValidationSchema.validate(description)
        if (error) {
            return res
              .status(400)
              .json({ success: false, message: error.details[0].message });
          }
        const existingUser=await User.findById(userId)
        if (existingUser){
            const existbalance=await Description.findOne({userId})
            if(existbalance){
                existbalance.description=description
                await existbalance.save()
                return res.status(200).json({
                    success:true,
                    message:"Description has been Successfully added"
                })

            }
            const descriptiondata=new Description(req.params)
            await descriptiondata.save()
            return res.status(200).json({
                success:true,
                message:"Description has been Successfully added"
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
export const getDescription=async(req,res)=>{
    try {
        const { userId } = req.params;
        if (!userId){
           return res.status(200).json({
                success:false,
                message:"User Id are not Found"
            })
        }
        let data=await Description.findOne({userId})
        return res.status(200).json({
            success:true,
            data:data
        })
    } catch (error) {
        handleError(res,error)
    }
}