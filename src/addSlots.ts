import * as admin from 'firebase-admin';
import { GroundSlot, convertObjectToFirestoreData, getRandomString } from '@ballzo-ui/core';

// const serviceAccount = require("../secret-keys/football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json"); //dev
const serviceAccount = require("../secret-keys/football-platform-production-firebase-adminsdk-ofoor-e09ce7fcb2.json"); // prod

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function addSlots(): Promise<void> {
    const batch = admin.firestore().batch();
    const slots: GroundSlot[] = [];
    const slotCount = 1;
    const timestamp = new Date('9 January 2024, 20:00:00').getTime();

    for (let i = 0; i < slotCount; i++) {
        const slotID = `slot-${getRandomString(15)}`;
        const slotRef = admin.firestore().collection('slots').doc(slotID);
        const slotTimestamp = timestamp;

        const slot = new GroundSlot
        slot.timestamp = slotTimestamp;
        slot.facilityId = 'p0UYXZ893UvojN5QQivW';
        slot.groundId = 'OfUpWcZwE4oN1SDyIPgB';
        slot.allowedCount = 14;
        slot.participantCount = 0;
        slot.status = 1;
        slot.price = 145;

        slots.push(slot);
        batch.set(slotRef, convertObjectToFirestoreData(slot));
    }

    try {
        await batch.commit();
        console.log('done');

    } catch (error) {
        console.log(error);
    }
}

addSlots()
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
