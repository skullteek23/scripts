"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const DATA = [
    { uid: '', name: '', phoneNumber: '' },
    { uid: '', name: '', phoneNumber: '' },
];
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
function createBulkACcounts() {
    return __awaiter(this, void 0, void 0, function* () {
        const batch = admin.firestore().batch();
        const users = [];
        DATA.forEach(element => {
            const { uid, name, phoneNumber } = element;
            const UserId = uid || (0, core_1.getRandomString)(15);
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
                yield admin.auth().importUsers(users);
                batch.commit();
                console.log('Users Created!');
            }
            else {
                console.log('No Users!');
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
createBulkACcounts();
