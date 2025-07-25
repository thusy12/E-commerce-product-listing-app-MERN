const express = require('express');
const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword, 
    getUserProfile, 
    changePassword,
    updateProfile,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/authController');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/authenticate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads', 'user');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({storage:multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router.route('/register').post(upload.single('avatar'),registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);
router.route('/password/change').put(isAuthenticatedUser, changePassword);
router.route('/profile/update').put(isAuthenticatedUser, upload.single('avatar'), updateProfile);

//Admin routes
router.route('/admin/users').get(isAuthenticatedUser, authorizedRoles('admin','super admin'), getAllUsers);
router.route('/admin/user/:id')
                                .get(isAuthenticatedUser, authorizedRoles('admin','super admin'), getUser)
                                .put(isAuthenticatedUser, authorizedRoles('admin','super admin'), updateUser)
                                .delete(isAuthenticatedUser, authorizedRoles('admin','super admin'), deleteUser);

module.exports = router;