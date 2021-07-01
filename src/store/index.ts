import {
  ActionContext,
  ActionTree,
  createStore,
  GetterTree,
  MutationTree,
  Store,
  useStore as baseUseStore,
} from "vuex";
import { InjectionKey } from "vue";
import authService, { KeyCloakTokens } from "@/services/authService";
import jwtDecode from "jwt-decode";
import VuexPersistence from "vuex-persist";

export interface State {
  loggedIn: boolean;
  accessToken: string;
  accessTokenExpiry: Date | null;
  refreshToken: string;
  refreshTokenExpiry: Date | null;
}

export const key: InjectionKey<Store<State>> = Symbol();
const state: State = {
  loggedIn: false,
  accessToken: "",
  accessTokenExpiry: null,
  refreshToken: "",
  refreshTokenExpiry: null,
};

// enum for auto-completion
export const enum MUTATIONS {
  SET_LOGGED_IN = "SET_LOGGED_IN",
  SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN",
  SET_ACCESS_EXPIRY = "SET_ACCESS_EXPIRY",
  SET_REFRESH_TOKEN = "SET_REFRESH_TOKEN",
  SET_REFRESH_EXPIRY = "SET_REFRESH_EXPIRY",
  CLEAR_TOKENS = "CLEAR_TOKENS",
  UPDATE_TUTORS_CLASSES = "UPDATE_STUDENT_CLASSES",
  CLEAR_TUTORS_CLASSES = "CLEAR_STUDENT_CLASSES",
}

const mutations: MutationTree<State> = {
  [MUTATIONS.SET_LOGGED_IN](state, loggedIn: boolean) {
    state.loggedIn = loggedIn;
  },

  [MUTATIONS.SET_ACCESS_TOKEN](state, tokenString: string) {
    state.accessToken = tokenString;
  },

  [MUTATIONS.SET_ACCESS_EXPIRY](state, dateTime: Date) {
    state.accessTokenExpiry = dateTime;
  },

  [MUTATIONS.SET_REFRESH_TOKEN](state, tokenString: string) {
    state.refreshToken = tokenString;
  },

  [MUTATIONS.SET_REFRESH_EXPIRY](state, dateTime: Date) {
    state.refreshTokenExpiry = dateTime;
  },

  [MUTATIONS.CLEAR_TOKENS](state) {
    state.accessToken = "";
    state.accessTokenExpiry = null;
    state.refreshToken = "";
    state.refreshTokenExpiry = null;
  },
};

// enum for auto-completion
export const enum ACTIONS {
  LOG_IN = "LOG_IN",
  FETCH_TOKENS_PWD_GRANT = "FETCH_TOKENS_PWD_GRANT",
  LOG_OUT = "LOG_OUT",
  FETCH_TOKENS_REFRESH_GRANT = "FETCH_TOKENS_REFRESH_GRANT",
  UPDATE_ACCESS_TOKEN = "UPDATE_ACCESS_TOKEN",
}

// actions helper function
function updateTokens(
  state: ActionContext<State, any>,
  data: KeyCloakTokens
): Promise<void> {
  return new Promise((resolve, reject) => {
    const decodedJWT: any = jwtDecode(data.access_token);

    if (
      decodedJWT.authorities === undefined ||
      !decodedJWT.authorities.includes("attendance_tutor")
    ) {
      reject(new Error("User does not have tutor privileges"));
    }
    const accessExpiry: Date = new Date();
    accessExpiry.setSeconds(accessExpiry.getSeconds() + data.expires_in);
    const refreshExpiry: Date = new Date();
    refreshExpiry.setSeconds(
      refreshExpiry.getSeconds() + data.refresh_expires_in
    );
    state.commit(MUTATIONS.SET_ACCESS_TOKEN, data.access_token);
    state.commit(MUTATIONS.SET_ACCESS_EXPIRY, accessExpiry);
    state.commit(MUTATIONS.SET_REFRESH_TOKEN, data.refresh_token);
    state.commit(MUTATIONS.SET_REFRESH_EXPIRY, refreshExpiry);
    resolve();
  });
}

const actions: ActionTree<State, any> = {
  [ACTIONS.LOG_IN](state, [username, password]): Promise<void> {
    return new Promise((resolve, reject) => {
      state
        .dispatch(ACTIONS.FETCH_TOKENS_PWD_GRANT, [username, password])
        .then(() => {
          state.commit(MUTATIONS.SET_LOGGED_IN, true);
          resolve();
          //TODO: fetch tutors classes
        })
        .catch((e) => reject(e));
    });
  },

  [ACTIONS.LOG_OUT](state) {
    state.commit(MUTATIONS.SET_LOGGED_IN, false);
    state.commit(MUTATIONS.CLEAR_TOKENS);
    // TODO: Clear tutors classes
  },

  [ACTIONS.FETCH_TOKENS_PWD_GRANT](state, [username, password]): Promise<void> {
    return new Promise((resolve, reject) => {
      authService
        .fetchTokensPwdGrant(username, password)
        .then((response) => {
          let data: KeyCloakTokens | null = null;

          if (response.statusText === "OK") {
            data = response.data;

            if (data !== null) {
              updateTokens(state, data)
                .then(() => resolve())
                .catch((e) => reject(e));
            } else {
              reject(new Error("unable to get tokens from password grant"));
            }
          }
        })
        .catch((e: Error) => reject(e));
    });
  },

  [ACTIONS.FETCH_TOKENS_REFRESH_GRANT](state): Promise<void> {
    return new Promise((resolve, reject) => {
      const refreshToken = store.state.refreshToken;

      authService
        .fetchTokensRefreshTokenGrant(refreshToken)
        .then((response) => {
          let data: KeyCloakTokens | null = null;

          if (response.statusText === "OK") {
            data = response.data;

            if (data !== null) {
              updateTokens(state, data)
                .then(() => resolve())
                .catch((e) => reject(e));
            } else {
              reject(new Error("unable to get tokens from refresh grant"));
            }
          }
        })
        .catch((e: Error) => reject(e));
    });
  },

  [ACTIONS.UPDATE_ACCESS_TOKEN](state): Promise<void> {
    return new Promise((resolve, reject) => {
      if (state.getters.getAccessTokenIsExpired) {
        // if the access token is expired check the refresh token
        const refreshIsExpired: boolean = state.getters.getRefreshIsExpired;

        if (refreshIsExpired) {
          // reject log out and push to log in screen should be implemented in the view controller
          reject(new Error("refresh token is expired"));
        } else {
          // otherwise update the tokens
          state
            .dispatch(ACTIONS.FETCH_TOKENS_REFRESH_GRANT)
            .then(() => resolve())
            .catch((e: Error) => reject(e));
        }
      } else {
        // if the access token is not expired then resolve
        resolve();
      }
    });
  },
};

const getters: GetterTree<State, any> = {
  getLoggedIn(state): boolean {
    return state.loggedIn;
  },
  getRefreshIsExpired(): boolean {
    if (state.refreshTokenExpiry === null) {
      return true;
    } else {
      return new Date() > state.refreshTokenExpiry;
    }
  },
  getAccessTokenIsExpired(): boolean {
    if (state.accessTokenExpiry === null) {
      return true;
    } else {
      return new Date() > state.accessTokenExpiry;
    }
  },
};

const vuexLocal = new VuexPersistence<State>({
  storage: window.sessionStorage,
  reducer: (state) => ({
    loggedIn: state.loggedIn,
    accessToken: state.accessToken,
    accessTokenExpiry: state.accessTokenExpiry,
    refreshToken: state.refreshToken,
    refreshTokenExpiry: state.refreshTokenExpiry,
  }),
});

export const store = createStore<State>({
  state,
  getters,
  actions,
  mutations,
  plugins: [vuexLocal.plugin],
});

export function useStore(): Store<State> {
  return baseUseStore(key);
}
