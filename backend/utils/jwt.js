const sendToken = (user, statusCode, res, message) =>{
    // Create JWT token
    const token = user.getJwtToken();

    res.status(statusCode).json({
        success: true,
        user,
        token,
        message
    });
}

module.exports = sendToken;