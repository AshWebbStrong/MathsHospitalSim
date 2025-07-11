"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAllHandlers = registerAllHandlers;
const hospitalName_1 = require("./hospitalName");
const gameStart_1 = require("./gameStart");
const patient_1 = require("./patient");
const player_1 = require("./player");
function registerAllHandlers(room) {
    (0, hospitalName_1.registerHospitalNameHandlers)(room);
    (0, gameStart_1.registerGameStartHandlers)(room);
    (0, patient_1.registerPatientHandlers)(room);
    (0, player_1.registerPlayerHandlers)(room);
}
