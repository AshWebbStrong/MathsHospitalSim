// server/engine/HospitalEngine.ts
import { ScheduledEvent } from "./ScheduledEvent";
import { HospitalState } from "../../common/HospitalState";
import { v4 as uuidv4 } from "uuid";

export class HospitalEngine {
  private state: HospitalState;
  private tickRate: number;
  private timer!: NodeJS.Timeout;
  private now: number;
  private events: ScheduledEvent[] = [];

  constructor(state: HospitalState, tickRateMs = 1000) {
    this.state    = state;
    this.tickRate = tickRateMs;
    this.now      = Date.now();
  }

  /** Start the engine’s main loop */
  public start() {
    this.timer = setInterval(() => this.step(), this.tickRate);
  }

  /** Stop the loop & clear all pending events */
  public stop() {
    clearInterval(this.timer);
    this.events = [];
  }

  /** Schedule something to run after `delayMs` */
  public schedule(delayMs: number, callback: () => void): string {
    const event: ScheduledEvent = {
      id:     uuidv4(),
      fireAt: this.now + delayMs,
      callback,
    };
    this.events.push(event);
    return event.id;
  }

  /** Cancel a previously scheduled event */
  public cancel(eventId: string) {
    this.events = this.events.filter((e) => e.id !== eventId);
  }

  /** One tick: advance time, fire due events, then do per-tick logic */
  private step() {
    this.now += this.tickRate;

    // 1) Fire any due callbacks
    const [due, future] = this.events.reduce<[ScheduledEvent[], ScheduledEvent[]]>(
      (acc, e) => {
        if (e.fireAt <= this.now) acc[0].push(e);
        else                acc[1].push(e);
        return acc;
      },
      [[], []]
    );
    this.events = future;
    due.forEach((e) => e.callback());

    // 2) Per-tick state updates (e.g. patient timers, satisfaction decay)
    this.processPatientTimers();
    // … any other global per-tick logic …
  }

  /** Example: decay painLevel, maybe mark critical, etc. */
  private processPatientTimers() {
    this.state.hospital.patients.forEach((p) => {
      // e.g. every tick, increase pain by .1
      p.painLevel = Math.min(10, p.painLevel + 0.01);
    });
  }
}
