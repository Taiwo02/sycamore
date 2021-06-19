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
router.route('/transactions').get(auth,verify,staffs.getTransactions)
router.route('/get_loans/:loan_id').get(auth,verify,staffs.getAloan)
router.route('/payment/:loan_id').post(auth,staffs.payment)
router.route("/verifyPayments").post(staffs.verifyPayments)
router.route('/update_loan/:loan_id').post(auth,verify,staffs.updateLoan)

module.exports = router;