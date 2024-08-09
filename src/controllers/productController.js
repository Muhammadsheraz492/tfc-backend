import Product from "../model/productModel.js";
import User from "../model/userModel.js";
import { sendEmail } from "../utils/emailService.js";
import { handleError } from "../utils/errorHandlers.js";
import { StatusValidationSchema, productValidationSchema } from "../validations/productValidationSchema.js";

export const addProduct = async (req, res) => {
  try {
    // const userId = req.userId;
    const { userId } = req.params;
    // console.log(req.body);
    
    const { error, value } = productValidationSchema.validate({
      ...req.body,
      userId,
    });
    // console.log(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    // console.log(value);
    
    const product = new Product(value);
    // console.log(value);
    await product.save();
            const html=`<!DOCTYPE html>
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
                margin: 10px 0;
            }
            .product-details {
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 15px;
                margin-top: 20px;
            }
            .product-details h3 {
                font-size: 18px;
                margin-top: 0;
            }
            .product-details p {
                margin: 5px 0;
            }
            .button {
                display: inline-block;
                font-size: 16px;
                font-weight: bold;
                color: #ffffff;
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
                color: #007bff;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Trump Finance Corporation</h1>
            </div>
            <div class="content">
                <h2>Hello there,</h2>
                <p>A new product has been successfully uploaded. Please review the details below:</p>
                <!-- Product Details Section -->
                <div class="product-details">
                    <h3>Product Details</h3>
                    <p><strong>Product Name:</strong>${product.title}</p>
                    <p><strong>Cost:</strong> $${product.cost}</p>
                    <p><strong>Number of Pieces:</strong>${product.numberOfPieces}</p>
                    <p><strong>Total Cost:</strong>${product.numberOfPieces*product.cost} </p>
                    <p><strong>Status:</strong> Pending</p>
                </div>
                <a href="https://tfcmembership.us/" class="button">Check Details</a>
                <p>Clearly communicates that the product needs attention</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 TFC. All rights reserved.</p>
                <p>If you have any questions, please <a href="mailto:${process.env.ADDMIN_EMAIL}">contact us</a>.</p>
            </div>
        </div>
    </body>
    </html>
    `
            await sendEmail(process.env.ADDMIN_EMAIL,"New Product Submission for Review","",html)
    res.status(200).json({
      ...value,
      success: true,
    });
  } catch (error) {
    handleError(res, error);
  }
};
export const getProduct = async (req, res) => {
  try {
    const {page}=req.params
    const pages = page|| 1;
    const pageSize = 10

    const skip = (pages - 1) * pageSize;
    const limit = pageSize;

    const [data, total] = await Promise.all([
      Product.find().skip(skip).limit(limit).exec(),
      Product.countDocuments()
    ]);
    // console.log(pages);
    

    const totalPages = Math.ceil(total / pageSize);
    const hasNextPage = page < totalPages;

    res.status(200).json({
      success: true,
      data: data,
      next: hasNextPage
    });
    // const data = await Product.find();
    // res.status(200).json({
    //   success: true,
    //   data: data,
    // });
  } catch (error) {
    handleError(res, error);
  }
};
export const changeStatus = async (req, res) => {
  try {
    const { productId,status } = req.params;
    const { error, value }=StatusValidationSchema.validate(status)
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const product=await Product.findById(productId)
    product.status=status
    const updateproduct=await product.save()
    const user=await User.findById(product.userId)
    const html=`<!DOCTYPE html>
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
                margin: 10px 0;
            }
            .product-details {
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 15px;
                margin-top: 20px;
            }
            .product-details h3 {
                font-size: 18px;
                margin-top: 0;
            }
            .product-details p {
                margin: 5px 0;
            }
            .button {
                display: inline-block;
                font-size: 16px;
                font-weight: bold;
                color: #ffffff;
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
                color: #007bff;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Trump Finance Corporation</h1>
            </div>
            <div class="content">
                <h2>Hello ${user.name},</h2>
                <p>A  product status has been successfully updated. Please review the details below:</p>
                <!-- Product Details Section -->
                <div class="product-details">
                    <h3>Product Details</h3>
                    <p><strong>Product Name: </strong> ${product.title}</p>
                    <p><strong>Cost: </strong> $${product.cost}</p>
                    <p><strong>Number of Pieces: </strong>${product.numberOfPieces}</p>
                    <p><strong>Total Cost: </strong> ${product.numberOfPieces*product.cost} </p>
                    <p><strong>Status: </strong> ${product.status}</p>
                </div>
                <a href="https://tfcmembership.us/" class="button">Check Details</a>
                <p>Clearly communicates that the product needs attention</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 TFC. All rights reserved.</p>
                <p>If you have any questions, please <a href="mailto:${user.email}">contact us</a>.</p>
            </div>
        </div>
    </body>
    </html>
    `
   
    await sendEmail(user.email,"Product Status Update","",html)

    return res.status(200).json({
      success:true,
      message:"Status Change Successfully"
    })
  } catch (error) {
    handleError(res.error);
  }
};
export const getallProduct=async(req,res)=>{
  try {
    const { userId } = req.params;
    if (!userId){
      return res.status(200).json({
        success:false,
        message:"userId Required"
      })
    }
    const data=await Product.find({userId,status:'approved'})
    return res.status(200).json({
      success:true,
      data:data
    }) 
  } catch (error) {
    handleError(res, error);
  }
}


