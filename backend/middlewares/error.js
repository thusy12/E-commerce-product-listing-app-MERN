const { stack } = require("../app");

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV == 'development'){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack
        })
    }
    
    if(process.env.NODE_ENV == 'production'){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        })
    }
}