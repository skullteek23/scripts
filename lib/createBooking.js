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
exports.runSlotValidityCheck = exports.checkKeysExist = void 0;
const core_1 = require("@ballzo-ui/core");
const admin = __importStar(require("firebase-admin"));
const Razorpay = require("razorpay");
// const serviceAccount = require("../secret-keys/football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json"); //dev
const serviceAccount = require("../secret-keys/football-platform-production-firebase-adminsdk-ofoor-e09ce7fcb2.json"); // prod
const rzAccount = require("../secret-keys/razorpay.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
// INPUT
// ----------------------------------------------
const SLOT_ID = 'slot-g8EFGpPINm2TEto';
const SPOTS = 1;
// const UID = 'kEPtKXH28JJ7L1N'; // Abhay
// const UID = 'HJsQnItDsTPlGwX'; // Kathyat
// const UID = 'emMgrS3qFYhuSAO1hNlvdZ5n2b22'; // Krrish
// const UID = 'wVM9bNyXshgIuUU7g3Hb4Cwl0kr1'; // Dhanish
const UID = 'qjOpqcmvU5PxtRecDuZhVOcYEX82'; // Sanjay
const ORDER_ID = 'no-order-id';
// ----------------------------------------------
function createBooking(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const missingParameter = checkKeysExist(data, ["slotId", "spots", "orderID", "uid"]);
        if (missingParameter) {
            console.log(`Missing ${missingParameter} parameter.`);
        }
        const userID = data === null || data === void 0 ? void 0 : data.uid;
        const slotID = data.slotId;
        const spotsCount = Number(data.spots);
        // Check is requested booking is valid or not
        if (spotsCount <= 0) {
            Promise.reject("At least one spot needs to be booked.");
        }
        const slotInfo = (yield admin.firestore()
            .collection("slots")
            .doc(slotID)
            .get()).data();
        try {
            yield runSlotValidityCheck(slotInfo, data.uid);
        }
        catch (error) {
            Promise.reject('Error occurred!');
        }
        // create batch
        const batch = admin.firestore().batch();
        const oid = data.orderID;
        const bookingID = "booking_bz_" + (0, core_1.getRandomString)(15);
        // Add new booking
        const booking = new core_1.Booking();
        booking.uid = userID;
        booking.orderId = oid;
        booking.facilityId = slotInfo.facilityId;
        booking.groundId = slotInfo.groundId;
        booking.slotId = slotID;
        booking.spots = spotsCount;
        booking.slotTimestamp = slotInfo.timestamp;
        batch.create(admin.firestore().collection("bookings").doc(bookingID), (0, core_1.convertObjectToFirestoreData)(booking));
        // // create order
        // try {
        //     const KEY_SECRET = rzAccount.production.keySecret;
        //     const KEY_ID = rzAccount.production.keyId;
        //     const instance = new Razorpay(
        //         { key_id: KEY_ID, key_secret: KEY_SECRET }
        //     );
        //     const order: Partial<OrderRz> = await instance?.orders?.create(oid);
        //     order.uid = userID;
        //     order.bookingId = bookingID;
        //     batch.set(
        //         admin.firestore().collection("orders").doc(oid),
        //         convertObjectToFirestoreData(order)
        //     );
        // } catch (error) {
        //     Promise.reject(`Razorpay error, ${error}`);
        // }
        // Executing main batch
        try {
            yield batch.commit();
            return oid;
        }
        catch (error) {
            Promise.reject(`Booking error, ${error}`);
        }
    });
}
/**
 * Check if all the keys exist in the data object
 * @param {any} data
 * @param {string[]} parameters
 * @return {string}
 */
function checkKeysExist(data, parameters) {
    if (!data) {
        return "unknown";
    }
    else if (!parameters.length) {
        return "";
    }
    else {
        for (let index = 0; index < parameters.length; index++) {
            const parameter = parameters[index];
            if (!Object.prototype.hasOwnProperty.call(data, parameter) ||
                (Object.prototype.hasOwnProperty.call(data, parameter) &&
                    (data[parameter] === undefined ||
                        data[parameter] === null))) {
                return parameter;
            }
        }
        return "";
    }
}
exports.checkKeysExist = checkKeysExist;
/**
 * Run validity check on slot
 * @param {GroundSlot} slot
 * @param {any} context
 * @return {Promise<any>}
 */
function runSlotValidityCheck(slot, uid) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if slot exists or not
        if (!slot || slot.status !== core_1.SlotStatus.available) {
            Promise.reject("Slot is not available! Please contact support.");
        }
        // Check if slot is full or not
        if ((slot === null || slot === void 0 ? void 0 : slot.allowedCount) &&
            slot.allowedCount <= slot.participantCount) {
            Promise.reject("Slot is full! Please try another slot.");
        }
        const queryResult = (yield admin.firestore()
            .collection("bookings")
            .where("uid", "==", uid)
            .where("slotTimestamp", "==", slot.timestamp)
            .get()).docs;
        if (queryResult === null || queryResult === void 0 ? void 0 : queryResult.length) {
            Promise.reject("Multiple bookings not allowed for same time.");
        }
        return;
    });
}
exports.runSlotValidityCheck = runSlotValidityCheck;
createBooking({
    slotId: SLOT_ID,
    spots: SPOTS,
    orderID: ORDER_ID,
    uid: UID,
});
