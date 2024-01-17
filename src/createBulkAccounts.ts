import { Constants, IListOption, Player, UserWallet, convertObjectToFirestoreData, getRandomString } from '@ballzo-ui/core';
import * as admin from 'firebase-admin';
import { CreateRequest } from 'firebase-admin/lib/auth/auth-config';
import { UserImportRecord } from 'firebase-admin/lib/auth/user-import-builder';

const serviceAccount = require("../secret-keys/football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});



// INPUT 
// ----------------------------------------------

const DATA: any[] = [
    { uid: '', name: '', phoneNumber: '' }, // (MAX LIMIT 1000)
    { uid: '', name: '', phoneNumber: '' },
]

// ----------------------------------------------




function getUserObj(uid: string, displayName: string, phoneNumber: string): UserImportRecord {
    const user: UserImportRecord = {
        uid,
        displayName,
        phoneNumber: Constants.INDIAN_DIAL_CODE + phoneNumber
    };
    return user;
}

function getPlayerObject(name: string): Player {
    const player = new Player();
    player.name = name;
    return convertObjectToFirestoreData(player);
}

function getWalletObject(): UserWallet {
    const wallet = new UserWallet();
    return convertObjectToFirestoreData(wallet);
}

async function createBulkACcounts() {
    const batch = admin.firestore().batch();
    const users: UserImportRecord[] = [];

    DATA.forEach(element => {
        const { uid, name, phoneNumber } = element;
        const UserId = uid || getRandomString(15);
        if (name && phoneNumber) {
            const user = getUserObj(UserId, name, phoneNumber);
            const player = getPlayerObject(name);
            const wallet = getWalletObject();


            const userRef = admin.firestore().collection('players').doc(UserId);
            const walletRef = admin.firestore().collection('user-wallet').doc(UserId);

            batch.set(userRef, player);
            batch.set(walletRef, wallet);

            users.push(user);
        }

    });
    try {
        if (users.length) {
            await admin.auth().importUsers(users);
            batch.commit();
            console.log('Users Created!');
        } else {
            console.log('No Users!');
        }
    } catch (error) {
        console.log(error);
    }
}

createBulkACcounts();