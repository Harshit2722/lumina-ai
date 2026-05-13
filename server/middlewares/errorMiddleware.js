
const errorMiddleware = (err,req,res,next)=>{
    
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    //validation error handling (mongoose error)
    if(err.name === "ValidationError"){
        statusCode = 400;
        message = Object.values(err.errors).map(error => error.message);
    };

    //duplicate key error handling (mongoose error)
    if(err.code === 11000){
        statusCode = 400;
        message = "Duplicate key error";
    }

    if(err.name === "CastError"){
        statusCode = 400;
        message = "Invalid ID";
    }


    res.status(statusCode).json({
      success: false,
      message
    });
  }

module.exports = { errorMiddleware }