var mongoose = require('mongoose'),
    schema = mongoose.Schema,
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

// create the model for users and expose it to our app
module.exports = mongoose.model('user', userSchema, 'user');

