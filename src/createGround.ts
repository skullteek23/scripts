import { ContactInfo, FacilityStatus, Ground, GroundAdditionalInfo, GroundFacility, GroundStatus, convertObjectToFirestoreData, getRandomString } from '@ballzo-ui/core';
import * as admin from 'firebase-admin';

// const serviceAccount = require("../secret-keys/football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json"); //dev
const serviceAccount = require("../secret-keys/football-platform-production-firebase-adminsdk-ofoor-e09ce7fcb2.json"); // prod

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const GROUND_ID = getRandomString(20);

export const GROUND_DETAILS = {
    name: 'Gallant Play Arena',
    address: 'Plot No 11, Sector 6, Naale Wali Gali, near Arogya Hospital, Vaishali Extension, Ramprastha Greens, Vaishali, Ghaziabad, Uttar Pradesh',
    imageUrl: [
        'https://firebasestorage.googleapis.com/v0/b/football-platform-production.appspot.com/o/grounds%2FGallant-vaishali%2FIMG_2835.jpg?alt=media&token=ce924b5c-f6ac-4107-96a0-f66f6e0e2d75',
        'https://firebasestorage.googleapis.com/v0/b/football-platform-production.appspot.com/o/grounds%2FGallant-vaishali%2FIMG_2837.jpg?alt=media&token=b54cde71-69c5-480a-8686-6f99adc5e920',
        'https://firebasestorage.googleapis.com/v0/b/football-platform-production.appspot.com/o/grounds%2FGallant-vaishali%2FIMG_2854.jpg?alt=media&token=6cbc5e4a-207e-4623-ab11-55239e02080d',
    ],
    mapUrl: 'https://maps.app.goo.gl/CX6Jx5ewB36ZyWbs6',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: 201012,
    teamPrice: 145,
    individualPrice: 145,
    description: 'Looking to play football? Discover world-class football pitches near you and get ready for an exhilarating game that will ignite your passion for the sport! Serve up some excitement as you step onto Gallant Play Arena and unleash your inner champion.',
    rules: 'N/A',
    website: 'www.gallantplay.com',
    contactEmail: 'play@gallantsports.in',
    contactPhone: '7979731898',
    contactName: 'Neetish Ranjan'
}

export const FACILITY_DETAILS = [
    {
        name: 'Turf A',
        playerSize: 14,
    },
    {
        name: 'Turf B',
        playerSize: 14,
    },
    {
        name: 'Rooftop 6v6',
        playerSize: 12,
    },
]

async function createGround() {
    const ground = new Ground();
    ground.id = getRandomString(20);
    ground.name = GROUND_DETAILS.name;
    ground.addressLine = GROUND_DETAILS.address;
    ground.imgLinks = [...GROUND_DETAILS.imageUrl];
    ground.mapLink = GROUND_DETAILS.mapUrl;
    ground.city = ground.city;
    ground.state = GROUND_DETAILS.state;
    ground.zip = GROUND_DETAILS.pincode;
    ground.price.bulk = GROUND_DETAILS.teamPrice;
    ground.price.single = GROUND_DETAILS.individualPrice;
    ground.status = GroundStatus.approved;

    const groundAdditionalInfo = new GroundAdditionalInfo();
    groundAdditionalInfo.description = GROUND_DETAILS.description;
    groundAdditionalInfo.rules = GROUND_DETAILS.rules;
    groundAdditionalInfo.website = GROUND_DETAILS.website;
    groundAdditionalInfo.contactInfo = new ContactInfo();
    groundAdditionalInfo.contactInfo.email = GROUND_DETAILS.contactEmail;
    groundAdditionalInfo.contactInfo.phone = GROUND_DETAILS.contactPhone;
    groundAdditionalInfo.contactInfo.name = GROUND_DETAILS.contactName;

    const facilities: GroundFacility[] = [];
    FACILITY_DETAILS.forEach(facilityInput => {
        const facility = new GroundFacility();
        facility.name = facilityInput.name;
        facility.maxPlayers = facilityInput.playerSize;
        facility.status = FacilityStatus.available;
        facility.groundId = GROUND_ID;
        facilities.push(facility);
    });

    if (!FACILITY_DETAILS.length) {
        return;
    }

    const db = admin.firestore();
    const batch = db.batch();

    batch.set(db.collection('grounds').doc(GROUND_ID), convertObjectToFirestoreData(ground));
    batch.set(db.collection('ground-additional-info').doc(GROUND_ID), convertObjectToFirestoreData(groundAdditionalInfo));

    facilities.forEach(facility => {
        batch.set(db.collection('facilities').doc(), convertObjectToFirestoreData(facility));
    });

    await batch.commit();

    console.log('ground added!');
}

createGround();