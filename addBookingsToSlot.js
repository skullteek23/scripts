var admin = require('firebase-admin');
include('utils/getRandomString');
var serviceAccount = require("./football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
async function getSlot() {
    const slotID = 'MTYoZaqnoL3BKlKwWWi8';
    const slotInfo = (await admin.firestore().collection('slots').doc(slotID).get()).data();
    return slotInfo;
}

async function addBookingsToSlot() {
    const slotInfo = await getSlot();
    const bookings = [];
    const batch = admin.firestore().batch();
    playersList.forEach(item => {
        const playerRef = admin.firestore().collection('players').doc(item.value);
        bookings.push({
            bookedAt: new Date().getTime(),
            facilityId: slotInfo.facilityId,
            groundId: slotInfo.groundId,
            lastUpdated: new Date().getTime(),
            orderId: getRandomString(15),
            slotId: 'MTYoZaqnoL3BKlKwWWi8',
            slotTimestamp: slotInfo.timestamp,
            spots: 1,
            uid: item.value
        });
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
    await batch.commit();
    console.log('Done');
}
const playersList = [
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