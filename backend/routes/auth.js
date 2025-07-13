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
const getFormattedTimestamp = require("../utils/timestamp");

const upload = multer({storage:multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'..','uploads/user'))
    },
    filename: function (req, file, cb) {
      // cb(null, file.originalname)

      const ext = path.extname(file.originalname); // Get file extension
      const baseName = path.basename(file.originalname, ext); // Get file name without extension
      const timestamp = getFormattedTimestamp();
      const finalName = `${baseName}-${timestamp}${ext}`; // New file name
      cb(null, finalName);
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
router.route('/profile/update').put(isAuthenticatedUser, updateProfile);

//Admin routes
router.route('/admin/users').get(isAuthenticatedUser, authorizedRoles('admin','super admin'), getAllUsers);
router.route('/admin/user/:id')
                                .get(isAuthenticatedUser, authorizedRoles('admin','super admin'), getUser)
                                .put(isAuthenticatedUser, authorizedRoles('admin','super admin'), updateUser)
                                .delete(isAuthenticatedUser, authorizedRoles('admin','super admin'), deleteUser);

module.exports = router;