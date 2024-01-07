import { Constants, IListOption, Player, UserWallet, convertObjectToFirestoreData, getRandomString } from '@ballzo-ui/core';
import * as admin from 'firebase-admin';
import { CreateRequest } from 'firebase-admin/lib/auth/auth-config';

const serviceAccount = require("../secret-keys/football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
// INPUT
// ----------------------------------------------

const UID = ''; // (OPTIONAL)
const PLAYER_NAME = '';
const PHONE_NUMBER = ''; // WITHOUT CODE

// ----------------------------------------------
function getUserObj(uid: string, displayName: string, phoneNumber: string): CreateRequest {
    const user: CreateRequest = {
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

async function createAccount() {
    const UserId = UID || getRandomString(15);
    const name = PLAYER_NAME;
    const phoneNumber = PHONE_NUMBER;

    if (name && phoneNumber) {
        const user = getUserObj(UserId, name, phoneNumber);
        const player = getPlayerObject(name);
        const wallet = getWalletObject();

        const batch = admin.firestore().batch();

        const userRef = admin.firestore().collection('players').doc(UserId);
        const walletRef = admin.firestore().collection('user-wallet').doc(UserId);

        batch.set(userRef, player);
        batch.set(walletRef, wallet);

        try {
            const result = await admin.auth().createUser(user);
            await batch.commit();

            console.log('User Created --> ', result.uid);

            return true;
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log('Invalid Input!');
    }

}

createAccount();