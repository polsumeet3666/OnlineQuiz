import md5 from 'md5';
import { login, createStudent, fetchAllQuizzes ,fetchQuiz,saveScoreRecord,updateQuizAttemptCount,fetchUserScores} from './dbService';


export function userLogin(user) {
    // check login
    return new Promise((resolve, reject) => {
        login(user.email, md5(user.password))
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function userCreate(user) {
    // create user in db
    return new Promise((resolve, reject) => {
        let student = {
            username: `${user.firstname} ${user.lastname}`,
            password: md5(user.password),
            email: user.email,
            role: 'student',
        };
        createStudent(student)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export async function fetchStudentDashboard(email) {


    let quizList = await fetchAllQuizzes('_id quizname');
    let scoreData = await fetchUserScores(email);
    console.log(quizList);
    console.log(scoreData);
    // resolve(quizData);
    return {
        quizList,
        scoreData
    };


}

export async function fetchQuizFromId(id) {
    let quiz = await fetchQuiz(id,null);
    console.log(quiz);
    return quiz;
}

export async function saveUserScore(scoreStr,quizname,quizId,user) {
    let score = Number(scoreStr.split("/")[0]);
    let t1 = await saveScoreRecord(score,scoreStr,quizname,user.email);
    console.log(`saved score for ${user.email}`);
    let t2 = await updateQuizAttemptCount(quizId);
    console.log(`update quiz attempt for ${quizname}`);

    return true;
    
}