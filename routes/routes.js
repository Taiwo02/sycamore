const express = require('express');
const router = express.Router();
const staffs =  require('../controllers/staffs');
const auth = require('../midlewares/auth').Auth;
const verify = require('../midlewares/verify').Verify;

router.route('/').get(staffs.home);
router.route('/add_staff').post(staffs.create);
router.route('/login').post(staffs.login)
router.route('/get_staffs').get(auth,verify,staffs.getall)
module.exports = router;