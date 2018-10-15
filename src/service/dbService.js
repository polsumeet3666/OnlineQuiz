import _ from 'underscore';
import UserSchema from '../model/userSchema';
import QuizSchema from '../model/quizSchema';
import ScoreSchema from '../model/scoreSchema';

export function login(email, password) {
    return new Promise((resolve, reject) => {
        console.log(`debug :: email ${email}`);
        console.log(`debug :: password ${password}`);
        if (mongoClient) {
            const UserModel = mongoClient.model('user', UserSchema);
            UserModel.findOne({ email, password }, (err, record) => {
                if (err) {
                    reject(err);
                }
                console.log(record);
                if (record) {
                    const result = {
                        username: record.username,
                        email: record.email,
                        role: record.role,
                    };
                    console.log(result);
                    resolve(result);
                } else {
                    resolve(null);
                }
            });
        } else {
            console.log('no mongoclient');
        }
    });
}

export function createTest(quizObj) {
    return new Promise((resolve, reject) => {
        console.log(`debug :: quizObj ${JSON.stringify(quizObj)}`);
        if (mongoClient) {
            const QuizModel = mongoClient.model('quiz', QuizSchema);
            const quiz = new QuizModel(quizObj);
            console.log(`debug :: quiz ${JSON.stringify(quiz)}`);
            quiz.save((err) => {
                if (err) {
                    console.log('error :: quiz saving in db');
                    reject(err);
                }
                else {
                    console.log(`error :: ${quizObj.quizname} saved`);
                    resolve(true);
                }
            });
        }
        else {
            console.log('error :: no mongoclient');
            reject(new Error('no mongoclient avaliable'));
        }
    });
}

export function fetchAllQuizzes(returnAttr) {
    return new Promise((resolve, reject) => {
        if (mongoClient) {
            const QuizModel = mongoClient.model('quiz', QuizSchema);
            QuizModel.find({}, returnAttr, (error, records) => {
                if (error) {
                    console.log(`error :: in fetching quiz ${err}`);
                    reject(error);
                }
                else if (records) {
                    console.log(`debug :: ${JSON.stringify(records)}`);
                    resolve(records);
                }
                else {
                    console.log('debug :: quizs is empty');
                    resolve([]);
                }
            });
        }
        else {
            reject(new Error('no mongoclient'));
        }
    });
}

export function createStudent(user) {
    return new Promise((resolve, reject) => {
        if (mongoClient) {

            // fetchStudent(user.email)
            //     .then((result) => {

            //     })
            //     .catch((error) => {

            //     });

            const UserModel = mongoClient.model('user', UserSchema);
            const student = new UserModel(user);
            student.save((err) => {
                if (err) {
                    console.log(`error : error in creating student ${err}`);
                    reject(err);
                }
                else {
                    console.log(`debug : student created success ${student.username}`);
                    resolve(true);
                }
            });
        }
        else {
            reject(new Error('no mongoclient'));
        }
    });
}

export function fetchStudent(email) {
    return new Promise((resolve, reject) => {
        if (mongoClient) {
            const UserModel = mongoClient.model('user', UserSchema);
            UserModel.findOne({ email, role: 'student' }, (err, record) => {
                if (err) {
                    console.log(`error : fetchStudent ${err}`);
                    reject(err);
                }
                else if (record) {
                    console.log(`debug : student found for ${email}`);
                    resolve(record);
                }
                else {
                    console.log(`debig : no student found for ${email}`);
                    resolve(record);
                }
            });
        }
        else {
            reject(new Error('no mongoclient'));
        }
    });
}

export function fetchQuiz(id, returnAttr) {
    return new Promise((resolve, reject) => {
        if (mongoClient) {
            const QuizModel = mongoClient.model('quiz', QuizSchema);
            QuizModel.findById(id, returnAttr, (error, records) => {
                if (error) {
                    console.log(`error :: in fetching quiz ${err}`);
                    reject(error);
                }
                else if (records) {
                    console.log(`debug :: ${JSON.stringify(records)}`);
                    resolve(records);
                }
                else {
                    console.log('debug :: quizs is empty');
                    resolve([]);
                }
            });
        }
        else {
            reject(new Error('no mongoclient'));
        }
    });
}

export function saveScoreRecord(score, scoreStr, quizname, email) {
    return new Promise((resolve, reject) => {
        if (mongoClient) {
            const ScoreModel = mongoClient.model('score', ScoreSchema);

            const dbScore = new ScoreModel({
                email,
                scoreWithTotal: scoreStr,
                score,
                examDate: new Date(),
                quizname,
            });
            dbScore.save((err) => {
                if (err) {
                    console.log(`error : in saving score ${err}`);
                    reject(err);
                }
                else {
                    console.log('score saved to db scuccess');
                    resolve(true);
                }
            });
        }
        else {
            reject(new Error('no mongoclient'));
        }
    });
}

export function updateQuizAttemptCount(quizId) {
    return new Promise((resolve, reject) => {
        if (mongoClient) {
            const QuizModel = mongoClient.model('quiz', QuizSchema);
            QuizModel.updateOne({ _id: quizId }, { $inc: { attempt: 1 } }, (err, res) => {
                if (err) {
                    console.log(`error ${err}`);
                    reject(err);
                }
                else {
                    console.log('updated attempt');
                    resolve(true);
                }
            })
        }
        else {
            reject(new Error('no mongoclient'));
        }
    });
}

export function fetchUserScores(email) {
    return new Promise((resolve, reject) => {
        if (mongoClient) {
            const ScoreModel = mongoClient.model('score', ScoreSchema);
            ScoreModel.find({ email }, (err, res) => {
                if (err) {
                    console.log(`error ${err}`);
                    reject(err);
                }
                else if (res) {
                    console.log(`user scores ${JSON.stringify(res)}`);
                    resolve(res);
                }
                else {
                    console.log('user scores empty');
                    resolve([]);
                }
            });
        }
        else {
            reject(new Error('no mongoclient'));
        }
    });
}


export function fetchAllScores() {
    return new Promise((resolve, reject) => {
        if (mongoClient) {
            const ScoreModel = mongoClient.model('score', ScoreSchema);
            ScoreModel.find({ }, (err, res) => {
                if (err) {
                    console.log(`error ${err}`);
                    reject(err);
                }
                else if (res) {
                    console.log(`user scores ${JSON.stringify(res)}`);
                    resolve(res);
                }
                else {
                    console.log('user scores empty');
                    resolve([]);
                }
            });
        }
        else {
            reject(new Error('no mongoclient'));
        }
    });
}

// export default {
//     login,
// };
