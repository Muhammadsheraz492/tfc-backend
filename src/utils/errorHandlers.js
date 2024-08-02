export const handleError = (res, error, statusCode = 500) => {
    console.error(error); 
    res.status(statusCode).json({success:false,message: error.message });
};
