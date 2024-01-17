import * as admin from 'firebase-admin';

const serviceAccount = require("../secret-keys/football-platform-production-firebase-adminsdk-yub3l-a1fc909837.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});


function deleteUser(uid: string): void {
    admin.auth().deleteUser(uid)
        .then(() => {
            console.log('Successfully deleted user', uid);
        })
        .catch((error) => {
            console.log('Error deleting user:', error);
        });
}

function getAllUsers(nextPageToken?: string): void {
    admin.auth().listUsers(100, nextPageToken)
        .then((listUsersResult) => {
            listUsersResult.users.forEach((userRecord) => {
                const uid: string = userRecord.uid;
                deleteUser(uid);
            });
            if (listUsersResult.pageToken) {
                getAllUsers(listUsersResult.pageToken);
            }
        })
        .catch((error) => {
            console.log('Error listing users:', error);
        });
}

//getAllUsers();
