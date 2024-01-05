import * as admin from 'firebase-admin';
import { GroundSlot, convertObjectToFirestoreData, getRandomString } from '@ballzo-ui/core';

const serviceAccount = require("../secret-keys/football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function addSlots(): Promise<void> {
    const batch = admin.firestore().batch();
    const slots: GroundSlot[] = [];
    const slotCount = 4;
    const timestamp = new Date('5 January 2024, 18:00:00').getTime();

    for (let i = 0; i < slotCount; i++) {
        const slotID = `slot-${getRandomString(15)}`;
        const slotRef = admin.firestore().collection('slots').doc(slotID);
        const slotTimestamp = timestamp + (i * 60 * 60 * 1000);

        const slot = new GroundSlot
        slot.timestamp = slotTimestamp;
        slot.facilityId = 'oboP9VEBU5jfx2cNJRsIlmRuA8it';
        slot.groundId = 'xOVpbs2Ui45MUASgX8mXT8ouCrX5';
        slot.allowedCount = 14;
        slot.participantCount = 0;
        slot.status = 1;
        slot.price = 99;

        slots.push(slot);
        batch.set(slotRef, convertObjectToFirestoreData(slot));
    }

    //await batch.commit();
}

addSlots()
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
