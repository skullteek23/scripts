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
const admin = __importStar(require("firebase-admin"));
const core_1 = require("@ballzo-ui/core");
// const serviceAccount = require("../secret-keys/football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json"); //dev
const serviceAccount = require("../secret-keys/football-platform-production-firebase-adminsdk-ofoor-e09ce7fcb2.json"); // prod
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
function addSlots() {
    return __awaiter(this, void 0, void 0, function* () {
        const batch = admin.firestore().batch();
        const slots = [];
        const slotCount = 1;
        const timestamp = new Date('9 January 2024, 20:00:00').getTime();
        for (let i = 0; i < slotCount; i++) {
            const slotID = `slot-${(0, core_1.getRandomString)(15)}`;
            const slotRef = admin.firestore().collection('slots').doc(slotID);
            const slotTimestamp = timestamp;
            const slot = new core_1.GroundSlot;
            slot.timestamp = slotTimestamp;
            slot.facilityId = 'p0UYXZ893UvojN5QQivW';
            slot.groundId = 'OfUpWcZwE4oN1SDyIPgB';
            slot.allowedCount = 14;
            slot.participantCount = 0;
            slot.status = 1;
            slot.price = 145;
            slots.push(slot);
            batch.set(slotRef, (0, core_1.convertObjectToFirestoreData)(slot));
        }
        try {
            yield batch.commit();
            console.log('done');
        }
        catch (error) {
            console.log(error);
        }
    });
}
addSlots()
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
