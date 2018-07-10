require('../helper/generalHelper');
var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    // define the schema for our user model
    userSchema = schema({
        id: {type:String, index:true},
        email: {type:String, index: true},
        password: {type:String, index:true},
        profiling_questions: [{
            question_type: String,  // saving_amount, loan_amount, etc
            user_answer: Number     // 0, 2000, 4000, 6000, 8000, and 10000
        }],
        created_date: Date,
        updated_date: Date
    });

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * assign date to created date value if not exist
 * else assign date for updated date
 * @returns none
 */
userSchema.pre('save', function(next, done) {
    var currentDate = new Date().toString();

    // if created_at doesn't exist, add to that field
    if (!this.created_date) {
        this.created_date = currentDate;
    } else {
        this.updated_date = currentDate;
    }
    next();
});

/**
 * register new user
 * @param req
 * @param userData
 * @param callback
 * @returns {Query|*}
 */
userSchema.methods.register = function(req, userData, callback) {
    var self = this,
        userModel = self.model('user'),
        profilingQuestions = self.getFormatedProfilingQuestions(userData.questions),
        userProfileType = self.getUserProfileType(profilingQuestions),
        user = new userModel({
            email: userData.email,
            password: this.generateHash(userData.password || ''),
            profiling_questions: profilingQuestions
        });

    user.save(function(err) {
        if (err) {
            log({
                'Route': 'userSchema.methods.register',
                'Message': 'Fail to register new user',
                'Error': err,
                'Data':userData
            });
            return callback(err);
        } else {
            return callback(false, {userProfileType: userProfileType});
        }
    });
};

/**
 * Format question data into database formated and
 * @param questions
 * @returns {Array}
 */
userSchema.methods.getFormatedProfilingQuestions = function(questions) {
    var profilingQuestions = [];
    for (var questionType in questions) {
        profilingQuestions.push({
            question_type: questionType,
            user_answer: parseInt(questions[questionType]),
            score: this.getAnswerScore(questions, questionType)
        });
    };
    return profilingQuestions;
};

/**
 * There is two way to get score, from the database or calculate the score by the code on the fly
 * In the future the calculation of the score might be change,
 * therefore the score is better calculate by the code on the fly instead saved into database.
 * @param questions
 * @param questionType
 */
userSchema.methods.getAnswerScore = function(questions, questionType) {
    var userAnswer = parseInt(questions[questionType]);
    switch (questionType) {
        case 'saving_amount':
            switch (userAnswer) {
                case 2000:  return 1;
                case 4000:  return 2;
                case 6000:  return 3;
                case 8000:  return 4;
                case 10000:  return 5;
                default: return 0;
            }

        case 'loan_amount':
            switch (userAnswer) {
                case 2000:  return 5;
                case 4000:  return 4;
                case 6000:  return 3;
                case 8000:  return 2;
                case 10000:  return 1;
                default: return 0;
            }

        default:
            return 0;
    }
};

/**
 * The user will be profiled based on the score.
 * Profile A is if the score is >= 8, B for >= 6, C for >= 4, and D for >= 2.
 * @param questions
 * @param questionType
 */
userSchema.methods.getUserProfileType = function(profilingQuestions) {
    var score = 0;
    for (var questionType in profilingQuestions) {
        score += profilingQuestions[questionType].score;
    }
    if (score >= 8) {
        return 'A';
    } else if (score >= 6) {
        return 'B';
    } else if (score >= 4) {
        return 'C';
    } else if (score >= 2) {
        return 'D';
    } else {
        return '';
    }
}

/**
 * simple data validation for regsitration. return true if valid
 * - email is required
 * - password is required
 * - questions.saving_amount is required
 * - question.load_amount is required
 * - email was not being used
 * @returns bool
 */
userSchema.methods.validateRegistrationData = function(data, callback) {

    if (!data) {
        return callback('Error: data was empty');

    } else if (data.email == '') {
        return callback('Error: email is required');

    } else if (data.password == '') {
        return callback('Error: password is required');

    } else if (!data.questions) {
        return callback('Error: questions is required');

    } else if (isNaN(data.questions.saving_amount)) {
        return callback('Error: saving amount is invalid value');

    } else if (isNaN(data.questions.loan_amount)) {
        return callback('Error: loan amount is invalid value');

        // last validator is to validate email from database which take time more longer
    } else {
        this.validateEmail(data.email, function (err, result) {
            if (err || result) {
                return callback('Error: Email had been registered. Please use other email!');
            } else {
                return callback();
            }
        });
    }
}

/**
 * TODO: validate valid email and check if the email haven't being used from database
 * @param email
 * @param callback
 */
userSchema.methods.validateEmail = function (email, callback) {
    // for now set the email was not being used
    return callback (false, false);
}

// create the model for users and expose it to our app
module.exports = mongoose.model('user', userSchema, 'user');

