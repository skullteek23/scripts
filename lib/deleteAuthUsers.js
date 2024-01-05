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
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const serviceAccount = require("../secret-keys/football-platform-production-firebase-adminsdk-yub3l-a1fc909837.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
function deleteUser(uid) {
    admin.auth().deleteUser(uid)
        .then(() => {
        console.log('Successfully deleted user', uid);
    })
        .catch((error) => {
        console.log('Error deleting user:', error);
    });
}
function getAllUsers(nextPageToken) {
    admin.auth().listUsers(100, nextPageToken)
        .then((listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
            const uid = userRecord.uid;
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
