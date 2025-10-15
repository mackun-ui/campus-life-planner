import { load, save } from "./storage.js";

export const state = {
  events: load(),
  addEvent(event) {
    this.events.push(event);
    save(this.events);
  },
  updateEvent(updated) {
    this.events = this.events.map(e => e.id === updated.id ? updated : e);
    save(this.events);
  },
  deleteEvent(id) {
    this.events = this.events.filter(e => e.id !== id);
    save(this.events);
  }
};
