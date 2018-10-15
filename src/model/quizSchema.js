import { Schema } from 'mongoose';

const Quiz = new Schema({
    quizname: String,
    questions: [{
        question: String,
        options: [String],
        correct: String,
    }],
    attempt: Number,
});

export default Quiz;
