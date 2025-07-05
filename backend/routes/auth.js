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

router.route('/register').post(registerUser);
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