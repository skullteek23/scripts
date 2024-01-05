import * as admin from 'firebase-admin';
import { Booking, GroundSlot, IListOption, getRandomString } from '@ballzo-ui/core';

const serviceAccount = require("../secret-keys/football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const SLOT_ID = 'MTYoZaqnoL3BKlKwWWi8';
async function getSlot(): Promise<GroundSlot | undefined> {
    const slotInfo = (await admin.firestore().collection('slots').doc(SLOT_ID).get()).data() as GroundSlot;
    return slotInfo;
}

async function addBookingsToSlot(): Promise<void> {
    const slotInfo = await getSlot();
    if (slotInfo) {
        const bookings: Booking[] = [];
        const batch = admin.firestore().batch();


        playersList.forEach(item => {
            const playerRef = admin.firestore().collection('players').doc(item.value);

            const booking = new Booking;
            booking.bookedAt = new Date().getTime();
            booking.facilityId = slotInfo?.facilityId;
            booking.groundId = slotInfo?.groundId;
            booking.lastUpdated = new Date().getTime();
            booking.orderId = getRandomString(15);
            booking.slotId = SLOT_ID;
            booking.slotTimestamp = slotInfo?.timestamp;
            booking.spots = 1;
            booking.uid = item.value;

            bookings.push(booking);
            batch.set(playerRef, {
                name: item.viewValue,
            });
        });

        bookings.forEach((booking, index) => {
            const bookingID = `booking-${getRandomString(15)}`;
            const bookingRef = admin.firestore().collection('bookings').doc(bookingID);
            batch.set(bookingRef, {
                ...booking,
            });
        });

        //await batch.commit();
        console.log('Done');
    }
}


const playersList: IListOption[] = [
    { value: getRandomString(15), viewValue: 'Sunil Chhetri', },
    { value: getRandomString(15), viewValue: 'Gurpreet Singh Sandhu', },
    { value: getRandomString(15), viewValue: 'Sandesh Jhingan', },
    { value: getRandomString(15), viewValue: 'Jeje Lalpekhlua', },
    { value: getRandomString(15), viewValue: 'Udanta Singh', },
    { value: getRandomString(15), viewValue: 'Anirudh Thapa', },
    { value: getRandomString(15), viewValue: 'Subrata Pal', },
    { value: getRandomString(15), viewValue: 'Chinglensana Singh', },
    { value: getRandomString(15), viewValue: 'Ashique Kuruniyan', },
    { value: getRandomString(15), viewValue: 'Brandon Fernandes', },
    { value: getRandomString(15), viewValue: 'Amrinder Singh', },
    { value: getRandomString(15), viewValue: 'Lalengmawia', },
    { value: getRandomString(15), viewValue: 'Liston Colaco', },
    { value: getRandomString(15), viewValue: 'Rowllin Borges', },
]


addBookingsToSlot();
