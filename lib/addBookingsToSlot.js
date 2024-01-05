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
exports.SLOT_ID = void 0;
const admin = __importStar(require("firebase-admin"));
const core_1 = require("@ballzo-ui/core");
const serviceAccount = require("../secret-keys/football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
exports.SLOT_ID = 'MTYoZaqnoL3BKlKwWWi8';
function getSlot() {
    return __awaiter(this, void 0, void 0, function* () {
        const slotInfo = (yield admin.firestore().collection('slots').doc(exports.SLOT_ID).get()).data();
        return slotInfo;
    });
}
function addBookingsToSlot() {
    return __awaiter(this, void 0, void 0, function* () {
        const slotInfo = yield getSlot();
        if (slotInfo) {
            const bookings = [];
            const batch = admin.firestore().batch();
            playersList.forEach(item => {
                const playerRef = admin.firestore().collection('players').doc(item.value);
                const booking = new core_1.Booking;
                booking.bookedAt = new Date().getTime();
                booking.facilityId = slotInfo === null || slotInfo === void 0 ? void 0 : slotInfo.facilityId;
                booking.groundId = slotInfo === null || slotInfo === void 0 ? void 0 : slotInfo.groundId;
                booking.lastUpdated = new Date().getTime();
                booking.orderId = (0, core_1.getRandomString)(15);
                booking.slotId = exports.SLOT_ID;
                booking.slotTimestamp = slotInfo === null || slotInfo === void 0 ? void 0 : slotInfo.timestamp;
                booking.spots = 1;
                booking.uid = item.value;
                bookings.push(booking);
                batch.set(playerRef, {
                    name: item.viewValue,
                });
            });
            bookings.forEach((booking, index) => {
                const bookingID = `booking-${(0, core_1.getRandomString)(15)}`;
                const bookingRef = admin.firestore().collection('bookings').doc(bookingID);
                batch.set(bookingRef, Object.assign({}, booking));
            });
            //await batch.commit();
            console.log('Done');
        }
    });
}
const playersList = [
    { value: (0, core_1.getRandomString)(15), viewValue: 'Sunil Chhetri', },
    { value: (0, core_1.getRandomString)(15), viewValue: 'Gurpreet Singh Sandhu', },
    { value: (0, core_1.getRandomString)(15), viewValue: 'Sandesh Jhingan', },
    { value: (0, core_1.getRandomString)(15), viewValue: 'Jeje Lalpekhlua', },
    { value: (0, core_1.getRandomString)(15), viewValue: 'Udanta Singh', },
    { value: (0, core_1.getRandomString)(15), viewValue: 'Anirudh Thapa', },
    { value: (0, core_1.getRandomString)(15), viewValue: 'Subrata Pal', },
    { value: (0, core_1.getRandomString)(15), viewValue: 'Chinglensana Singh', },
    { value: (0, core_1.getRandomString)(15), viewValue: 'Ashique Kuruniyan', },
    { value: (0, core_1.getRandomString)(15), viewValue: 'Brandon Fernandes', },
    { value: (0, core_1.getRandomString)(15), viewValue: 'Amrinder Singh', },
    { value: (0, core_1.getRandomString)(15), viewValue: 'Lalengmawia', },
    { value: (0, core_1.getRandomString)(15), viewValue: 'Liston Colaco', },
    { value: (0, core_1.getRandomString)(15), viewValue: 'Rowllin Borges', },
];
addBookingsToSlot();
