const express = require('express');
const router = express.Router();
const staffs =  require('../controllers/staffs');
const auth = require('../midlewares/auth').Auth;
const verify = require('../midlewares/verify').Verify;

router.route('/').get(staffs.home);
router.route('/add_staff').post(staffs.create);
router.route('/login').post(staffs.login)
router.route('/request_loan').post(staffs.requestLoan)
router.route('/get_staffs').get(auth,verify,staffs.getall)
router.route('/get_loans').get(auth,verify,staffs.getLoan)
router.route('/get_loans/:loan_id').get(auth,verify,staffs.getAloan)
router.route("/my/webhook/https://sycamore-loan.herokuapp.com/").post(staffs.getAloan)



module.exports = router;