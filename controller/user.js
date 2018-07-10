require('../helper/generalHelper');
var express = require('express');
var router = express.Router();
var userSchema = require('../model/userSchema.js'),
    userModel = new userSchema();

/**
 * @api {post} /user/register
 * @apiName registration
 * @apiVersion 1.0.0
 * @apiGroup User
 *
 * @apiParam {string} email
 * @apiParam {string} password
 * @apiParam {string} questions {saving_amount, loan_amount}
 */
router.post('/register', function (req, res, next) {
    var data = {
        email: normalize(getReqValue(req, 'email', 'post')),
        password: normalize(getReqValue(req, 'password', 'post')),
        questions: normalize(getReqValue(req, 'questions', 'post')),
    };

    var defaultErrorMessage = 'Failed to register, please check your data and try again!';
    userModel.validateRegistrationData(data, function(errorValidation) {
        if (errorValidation) {
            return res.status(500).json({
                error: errorValidation || defaultErrorMessage
            });
        } else {
            userModel.register(req, data, function(error, result) {
                if (error || !result) {
                    return res.status(500).json({
                        error: error || defaultErrorMessage,
                        profile_type: ''
                    });
                } else {
                    return res.status(200).json({
                        profile_type: ''
                    });
                }
            })
        }
    });
});

module.exports = router;