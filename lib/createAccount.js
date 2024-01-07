"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@ballzo-ui/core");
const admin = __importStar(require("firebase-admin"));
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
function getUserObj(uid, displayName, phoneNumber) {
    const user = {
        uid,
        displayName,
        phoneNumber: core_1.Constants.INDIAN_DIAL_CODE + phoneNumber
    };
    return user;
}
function getPlayerObject(name) {
    const player = new core_1.Player();
    player.name = name;
    return (0, core_1.convertObjectToFirestoreData)(player);
}
function getWalletObject() {
    const wallet = new core_1.UserWallet();
    return (0, core_1.convertObjectToFirestoreData)(wallet);
}
function createAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        const UserId = UID || (0, core_1.getRandomString)(15);
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
                const result = yield admin.auth().createUser(user);
                yield batch.commit();
                console.log('User Created --> ', result.uid);
                return true;
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            console.log('Invalid Input!');
        }
    });
}
createAccount();
