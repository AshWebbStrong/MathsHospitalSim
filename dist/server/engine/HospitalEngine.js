"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalEngine = void 0;
const uuid_1 = require("uuid");
class HospitalEngine {
    constructor(state, tickRateMs = 1000) {
        this.events = [];
        this.state = state;
        this.tickRate = tickRateMs;
        this.now = Date.now();
    }
    /** Start the engine’s main loop */
    start() {
        this.timer = setInterval(() => this.step(), this.tickRate);
    }
    /** Stop the loop & clear all pending events */
    stop() {
        clearInterval(this.timer);
        this.events = [];
    }
    /** Schedule something to run after `delayMs` */
    schedule(delayMs, callback) {
        const event = {
            id: (0, uuid_1.v4)(),
            fireAt: this.now + delayMs,
            callback,
        };
        this.events.push(event);
        return event.id;
    }
    /** Cancel a previously scheduled event */
    cancel(eventId) {
        this.events = this.events.filter((e) => e.id !== eventId);
    }
    /** One tick: advance time, fire due events, then do per-tick logic */
    step() {
        this.now += this.tickRate;
        // 1) Fire any due callbacks
        const [due, future] = this.events.reduce((acc, e) => {
            if (e.fireAt <= this.now)
                acc[0].push(e);
            else
                acc[1].push(e);
            return acc;
        }, [[], []]);
        this.events = future;
        due.forEach((e) => e.callback());
        // 2) Per-tick state updates (e.g. patient timers, satisfaction decay)
        this.processPatientTimers();
        // … any other global per-tick logic …
    }
    /** Example: decay painLevel, maybe mark critical, etc. */
    processPatientTimers() {
        this.state.hospital.patients.forEach((p) => {
            // e.g. every tick, increase pain by .1
            p.painLevel = Math.min(10, p.painLevel + 0.01);
        });
    }
}
exports.HospitalEngine = HospitalEngine;
