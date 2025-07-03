const sendToken = (user, statusCode, res, message) =>{
    // Create JWT token
    const token = user.getJwtToken();

    // Set cookie options
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000), // Convert days to milliseconds
        httpOnly: true // Prevents client-side JavaScript from accessing the cookie
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token,
        message
    });
}

module.exports = sendToken;