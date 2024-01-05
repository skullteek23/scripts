import { ContactInfo, FacilityStatus, Ground, GroundAdditionalInfo, GroundFacility, GroundStatus, convertObjectToFirestoreData, getRandomString } from '@ballzo-ui/core';
import * as admin from 'firebase-admin';

const serviceAccount = require("../secret-keys/football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const GROUND_ID = getRandomString(20);

export const GROUND_DETAILS = {
    name: 'Test Ground',
    address: 'Plot No 12, Vaishali Extension, Ramprastha Greens, Vaishali, Ghaziabad, Uttar Pradesh',
    imageUrl: 'https://www.shutterstock.com/image-photo/background-texture-large-public-local-260nw-1724385472.jpg',
    mapUrl: 'https://maps.app.goo.gl/xybb8nMuXxbEq4fDA',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: 201012,
    teamPrice: 149,
    individualPrice: 149,
    description: 'No Description',
    rules: 'No Rules',
    website: 'www.abc.com',
    contactEmail: 'abc@gmail.com',
    contactPhone: '9999999991',
    contactName: 'Bro Insta'
}

export const FACILITY_DETAILS = [
    {
        name: 'Astroturf',
        playerSize: 14,
    },
]

async function createGround() {
    const ground = new Ground();
    ground.id = getRandomString(20);
    ground.name = GROUND_DETAILS.name;
    ground.addressLine = GROUND_DETAILS.address;
    ground.imgLinks = [GROUND_DETAILS.imageUrl];
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