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
const serviceAccount = require("../secret-keys/football-platform-dev-firebase-adminsdk-zwhyn-2f830bef43.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
exports.GROUND_ID = (0, core_1.getRandomString)(20);
exports.GROUND_DETAILS = {
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
};
exports.FACILITY_DETAILS = [
    {
        name: 'Astroturf',
        playerSize: 14,
    },
];
function createGround() {
    return __awaiter(this, void 0, void 0, function* () {
        const ground = new core_1.Ground();
        ground.id = (0, core_1.getRandomString)(20);
        ground.name = exports.GROUND_DETAILS.name;
        ground.addressLine = exports.GROUND_DETAILS.address;
        ground.imgLinks = [exports.GROUND_DETAILS.imageUrl];
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
