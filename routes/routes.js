const express = require('express');
const router = express.Router();
const staffs =  require('../controllers/staffs');
const auth = require('../midlewares/auth').Auth;
const verify = require('../midlewares/verify').Verify;

router.route('/').get(staffs.home);
router.route('/register').post(staffs.create);
router.route('/login').post(staffs.login)
router.route('/request_loan').post(auth,staffs.requestLoan)
router.route('/get_staffs').get(auth,verify,staffs.getall)
router.route('/get_loans').get(auth,verify,staffs.getLoan)
router.route('/get_loans/:loan_id').get(auth,verify,staffs.getAloan)
router.route('/payment').post(auth,verify,staffs.payment)
router.route("/verifyPayments").post(staffs.verifyPayments)

module.exports = router;