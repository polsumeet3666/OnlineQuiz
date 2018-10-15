import { readFile } from 'fs';
import md5 from 'md5';

import { login, createTest, fetchAllQuizzes,fetchAllScores } from './dbService';


export function adminLogin(email, password) {
    return new Promise((resolve, reject) => {
        console.log('adminlogin');
        login(email, md5(password))
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
}

export function uploadTest(req) {
    return new Promise((resolve, reject) => {
        readFile(req.files.test.path, (err, data) => {
            if (err) {
                console.log(err);
            }
            // console.log(data.toString());
            let quizJson = data.toString();
            try {
                quizJson = JSON.parse(quizJson);
                createTest(quizJson)
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } catch (error) {
                reject(error);
            }
        });
    });
}

export async function fetchAdminDashboardData() {
    
        let quizData = await fetchAllQuizzes("quizname attempt");
        let scoreData = await fetchAllScores();
        return {
            quizData,
            scoreData
        }
    
}