import Vuex from "vuex";

export enum FlashType {
  INFO,
  SUCCESS,
  ERROR,
  NEUTRAL,
}

export interface Flash {
  id?: string;
  type: FlashType; // Type of message
  title: string;
  body: string;

  length?: number;
  duration?: number; // in miliseconds
  createdOn?: number;
}

const flash = new Vuex.Store({
  state: {
    notifications: [] as Flash[],
  },
  getters: {
    pop(state): Flash | undefined {
      return state.notifications.pop();
    },
  },
  mutations: {
    // Change authentication
    add(state, message: Flash) {
      state.notifications.push(message);
    },
  },
});

export default flash;
