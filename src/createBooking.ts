import { Booking, GroundSlot, OrderRz, SlotStatus, convertObjectToFirestoreData, getRandomString } from '@ballzo-ui/core';
import * as admin from 'firebase-admin';

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
async function createBooking(data: any): Promise<any> {
    const missingParameter = checkKeysExist(data, ["slotId", "spots", "orderID", "uid"]);
    if (missingParameter) {
        console.log(`Missing ${missingParameter} parameter.`);
    }

    const userID = data?.uid;
    const slotID = data.slotId;
    const spotsCount = Number(data.spots);

    // Check is requested booking is valid or not
    if (spotsCount <= 0) {
        Promise.reject("At least one spot needs to be booked.");
    }

    const slotInfo: GroundSlot = (await admin.firestore()
        .collection("slots")
        .doc(slotID)
        .get()).data() as GroundSlot;

    try {
        await runSlotValidityCheck(slotInfo, data.uid);
    } catch (error: any) {
        Promise.reject('Error occurred!');
    }

    // create batch
    const batch = admin.firestore().batch();
    const oid = data.orderID;
    const bookingID = "booking_bz_" + getRandomString(15);

    // Add new booking
    const booking = new Booking();
    booking.uid = userID;
    booking.orderId = oid;
    booking.facilityId = slotInfo.facilityId;
    booking.groundId = slotInfo.groundId;
    booking.slotId = slotID;
    booking.spots = spotsCount;
    booking.slotTimestamp = slotInfo.timestamp;

    batch.create(
        admin.firestore().collection("bookings").doc(bookingID),
        convertObjectToFirestoreData(booking)
    );

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
        await batch.commit();
        return oid;
    } catch (error) {
        Promise.reject(`Booking error, ${error}`);
    }
}

/**
 * Check if all the keys exist in the data object
 * @param {any} data
 * @param {string[]} parameters
 * @return {string}
 */
export function checkKeysExist(data: any, parameters: string[]): string {
    if (!data) {
        return "unknown";
    } else if (!parameters.length) {
        return "";
    } else {
        for (let index = 0; index < parameters.length; index++) {
            const parameter = parameters[index];
            if (
                !Object.prototype.hasOwnProperty.call(data, parameter) ||
                (Object.prototype.hasOwnProperty.call(data, parameter) &&
                    (data[parameter] === undefined ||
                        data[parameter] === null))
            ) {
                return parameter;
            }
        }
        return "";
    }
}

/**
 * Run validity check on slot
 * @param {GroundSlot} slot
 * @param {any} context
 * @return {Promise<any>}
 */
export async function runSlotValidityCheck(slot: GroundSlot, uid: string): Promise<any> {

    // Check if slot exists or not
    if (!slot || slot.status !== SlotStatus.available) {
        Promise.reject("Slot is not available! Please contact support.")
    }

    // Check if slot is full or not
    if (slot?.allowedCount &&
        slot.allowedCount <= slot.participantCount) {
        Promise.reject("Slot is full! Please try another slot.")
    }

    const queryResult = (await admin.firestore()
        .collection("bookings")
        .where("uid", "==", uid)
        .where("slotTimestamp", "==", slot.timestamp)
        .get()).docs;
    if (queryResult?.length) {
        Promise.reject("Multiple bookings not allowed for same time.")
    }

    return;
}

createBooking({
    slotId: SLOT_ID,
    spots: SPOTS,
    orderID: ORDER_ID,
    uid: UID,
});