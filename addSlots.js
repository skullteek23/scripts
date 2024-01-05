var admin = require('firebase-admin');

var getRandomString = require('./utils/getRandomString').getRandomString;

var serviceAccount = require("./football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json");
const { GroundSlot } = require('@ballzo-ui/core');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Facility 7v7 A
// oboP9VEBU5jfx2cNJRsIlmRuA8it

// Ground Gallant Vaishali
// xOVpbs2Ui45MUASgX8mXT8ouCrX5

async function addSlots() {
    const batch = admin.firestore().batch();
    const slots = [];
    slotCount = 4;
    const timestamp = new Date('5 January 2024, 18:00:00').getTime();
    const slot = new GroundSlot();
    for (let i = 0; i < slotCount; i++) {
        const slotID = `slot-${getRandomString(15)}`;
        const slotRef = admin.firestore().collection('slots').doc(slotID);
        const slotTimestamp = timestamp + (i * 60 * 60 * 1000);
        const slot = {
            timestamp: slotTimestamp,
            facilityId: 'oboP9VEBU5jfx2cNJRsIlmRuA8it',
            groundId: 'xOVpbs2Ui45MUASgX8mXT8ouCrX5',
            allowedCount: 14,
            participantCount: 0,
            status: 1,
            price: 99,
        };
        slots.push(slot);
        batch.set(slotRef, {
            ...slot,
        });
    }

    return batch.commit();
}

addSlots()
    .then((response) => console.log(response))
    .catch(error => console.log(error));