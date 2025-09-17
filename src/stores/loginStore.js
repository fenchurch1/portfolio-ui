// stores/loginStore.ts
import { makeAutoObservable } from "mobx";

class LoginStore {
  user = null;
  token = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLogin(user, token) {
    this.user = user;
    this.token = token;
  }

  logout() {
    this.user = null;
    this.token = null;
  }

  get isLoggedIn() {
    return !!this.token;
  }
}

export const loginStore = new LoginStore();
