import { Schema } from 'mongoose';

const ScoreSchema = new Schema({
    email: String,
    scoreWithTotal: String,
    score: Number,
    examDate: Date,
    quizname: String,
});

export default ScoreSchema;
