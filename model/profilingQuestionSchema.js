var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    // define the schema for our profiling questions model
    profilingQuestionSchema = schema({
        id: {type:String, index:true},
        question_type: {type:String, index: true},  // saving_amount, loan_amount, etc
        question_label: String,
        question_options: [{
            label: {type:Number, index:true}   // 0, 2000, 4000, 6000, 8000, and 10000
        }],
        created_date: Date,
        updated_date: Date
    });

// create the model for profilingQuestion and expose it to our app
module.exports = mongoose.model('profilingQuestion', profilingQuestionSchema, 'profilingQuestion');

