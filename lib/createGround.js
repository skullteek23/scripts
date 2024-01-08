"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.FACILITY_DETAILS = exports.GROUND_DETAILS = exports.GROUND_ID = void 0;
const core_1 = require("@ballzo-ui/core");
const admin = __importStar(require("firebase-admin"));
// const serviceAccount = require("../secret-keys/football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json"); //dev
const serviceAccount = require("../secret-keys/football-platform-production-firebase-adminsdk-ofoor-e09ce7fcb2.json"); // prod
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
exports.GROUND_ID = (0, core_1.getRandomString)(20);
exports.GROUND_DETAILS = {
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
};
exports.FACILITY_DETAILS = [
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
];
function createGround() {
    return __awaiter(this, void 0, void 0, function* () {
        const ground = new core_1.Ground();
        ground.id = (0, core_1.getRandomString)(20);
        ground.name = exports.GROUND_DETAILS.name;
        ground.addressLine = exports.GROUND_DETAILS.address;
        ground.imgLinks = [...exports.GROUND_DETAILS.imageUrl];
        ground.mapLink = exports.GROUND_DETAILS.mapUrl;
        ground.city = ground.city;
        ground.state = exports.GROUND_DETAILS.state;
        ground.zip = exports.GROUND_DETAILS.pincode;
        ground.price.bulk = exports.GROUND_DETAILS.teamPrice;
        ground.price.single = exports.GROUND_DETAILS.individualPrice;
        ground.status = core_1.GroundStatus.approved;
        const groundAdditionalInfo = new core_1.GroundAdditionalInfo();
        groundAdditionalInfo.description = exports.GROUND_DETAILS.description;
        groundAdditionalInfo.rules = exports.GROUND_DETAILS.rules;
        groundAdditionalInfo.website = exports.GROUND_DETAILS.website;
        groundAdditionalInfo.contactInfo = new core_1.ContactInfo();
        groundAdditionalInfo.contactInfo.email = exports.GROUND_DETAILS.contactEmail;
        groundAdditionalInfo.contactInfo.phone = exports.GROUND_DETAILS.contactPhone;
        groundAdditionalInfo.contactInfo.name = exports.GROUND_DETAILS.contactName;
        const facilities = [];
        exports.FACILITY_DETAILS.forEach(facilityInput => {
            const facility = new core_1.GroundFacility();
            facility.name = facilityInput.name;
            facility.maxPlayers = facilityInput.playerSize;
            facility.status = core_1.FacilityStatus.available;
            facility.groundId = exports.GROUND_ID;
            facilities.push(facility);
        });
        if (!exports.FACILITY_DETAILS.length) {
            return;
        }
        const db = admin.firestore();
        const batch = db.batch();
        batch.set(db.collection('grounds').doc(exports.GROUND_ID), (0, core_1.convertObjectToFirestoreData)(ground));
        batch.set(db.collection('ground-additional-info').doc(exports.GROUND_ID), (0, core_1.convertObjectToFirestoreData)(groundAdditionalInfo));
        facilities.forEach(facility => {
            batch.set(db.collection('facilities').doc(), (0, core_1.convertObjectToFirestoreData)(facility));
        });
        yield batch.commit();
        console.log('ground added!');
    });
}
createGround();
