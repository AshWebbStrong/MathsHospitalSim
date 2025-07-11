// server/engine/ScheduledEvent.ts
export interface ScheduledEvent {
  /** Unique ID so we can cancel if needed */
  id: string;

  /** Timestamp (ms since epoch) at which to fire */
  fireAt: number;

  /** A callback that mutates the state */
  callback: () => void;
}
