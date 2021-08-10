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
import { TutorModule, TutorModuleInterface } from "@/model/TutorModule";
import tutorModuleService from "@/services/tutorModuleService";
import { TutorClass } from "@/model/TutorClass";
import { SSEListenerService } from "@/services/SSEListenerService";

export interface State {
  loggedIn: boolean;
  accessToken: string;
  accessTokenExpiry: Date | null;
  refreshToken: string;
  refreshTokenExpiry: Date | null;
  tutorModules: Array<TutorModule>;
}

export const key: InjectionKey<Store<State>> = Symbol();
const state: State = {
  loggedIn: false,
  accessToken: "",
  accessTokenExpiry: null,
  refreshToken: "",
  refreshTokenExpiry: null,
  tutorModules: new Array<TutorModule>(),
};

// enum for auto-completion
export const enum MUTATIONS {
  SET_LOGGED_IN = "SET_LOGGED_IN",
  SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN",
  SET_ACCESS_EXPIRY = "SET_ACCESS_EXPIRY",
  SET_REFRESH_TOKEN = "SET_REFRESH_TOKEN",
  SET_REFRESH_EXPIRY = "SET_REFRESH_EXPIRY",
  CLEAR_TOKENS = "CLEAR_TOKENS",
  UPDATE_TUTORS_MODULES = "UPDATE_STUDENT_MODULES",
  CLEAR_TUTORS_MODULES = "CLEAR_STUDENT_MODULES",
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
  [MUTATIONS.UPDATE_TUTORS_MODULES](state, modules: Array<TutorModule>) {
    state.tutorModules = modules;
  },
  [MUTATIONS.CLEAR_TUTORS_MODULES](state) {
    state.tutorModules = [];
  },
};

// enum for auto-completion
export const enum ACTIONS {
  LOG_IN = "LOG_IN",
  FETCH_TOKENS_PWD_GRANT = "FETCH_TOKENS_PWD_GRANT",
  LOG_OUT = "LOG_OUT",
  FETCH_TOKENS_REFRESH_GRANT = "FETCH_TOKENS_REFRESH_GRANT",
  UPDATE_ACCESS_TOKEN = "UPDATE_ACCESS_TOKEN",
  FETCH_TUTOR_MODULES = "FETCH_TUTOR_MODULES",
  MARK_STUDENT_ATTENDED = "MARK_STUDENT_ATTENDED",
  UPDATE_CLASS = "UPDATE_CLASS",
}

// actions helper function
function updateTokens(
  state: ActionContext<State, unknown>,
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

const actions: ActionTree<State, unknown> = {
  [ACTIONS.LOG_IN](state, [username, password]): Promise<void> {
    return new Promise((resolve, reject) => {
      state
        .dispatch(ACTIONS.FETCH_TOKENS_PWD_GRANT, [username, password])
        .then(() => {
          state
            .dispatch(ACTIONS.FETCH_TUTOR_MODULES)
            .then(() => {
              state.commit(MUTATIONS.SET_LOGGED_IN, true);
              resolve();
            })
            .catch((e: Error) => reject(e));
        })
        .catch((e: Error) => reject(e));
    });
  },

  [ACTIONS.LOG_OUT](state) {
    SSEListenerService.closeConnection();
    state.commit(MUTATIONS.SET_LOGGED_IN, false);
    state.commit(MUTATIONS.CLEAR_TOKENS);
    state.commit(MUTATIONS.CLEAR_TUTORS_MODULES);
    state.commit(MUTATIONS.CLEAR_TUTORS_MODULES);
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
                .catch((e: Error) => reject(e));
            } else {
              reject(new Error("unable to get tokens from password grant"));
            }
          } else {
            reject(
              new Error(
                "unable to get tokens from password grant, status:".concat(
                  response.statusText
                )
              )
            );
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
                .catch((e: Error) => reject(e));
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
          reject(new Error("UPDATE_ACCESS_TOKEN: refresh token is expired"));
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

  [ACTIONS.FETCH_TUTOR_MODULES](state): Promise<void> {
    return new Promise((resolve, reject) => {
      state
        .dispatch(ACTIONS.UPDATE_ACCESS_TOKEN)
        .then(() => {
          const accessToken: string = state.getters.getAccessToken;

          tutorModuleService
            .fetchTutorModules(accessToken)
            .then((response) => {
              if (response.status === 200) {
                // tutor has modules, so update them
                const interfaceArray: Array<TutorModuleInterface> =
                  response.data;
                const modulesArray: Array<TutorModule> =
                  TutorModule.toCollection(interfaceArray);

                state.commit(MUTATIONS.UPDATE_TUTORS_MODULES, modulesArray);
                resolve();
              } else if (response.status === 204) {
                // tutor doesn't have any modules, so clear them
                state.commit(MUTATIONS.CLEAR_TUTORS_MODULES);
                resolve();
              } else {
                reject(
                  new Error(
                    "Unable to get tutors classes from the resource server"
                  )
                );
              }
            })
            .catch((e: Error) => reject(e));
        })
        .catch((e: Error) => reject(e));
    });
  },
  [ACTIONS.MARK_STUDENT_ATTENDED](state, [studentId, classId]): Promise<void> {
    return new Promise((resolve, reject) => {
      state
        .dispatch(ACTIONS.UPDATE_ACCESS_TOKEN)
        .then(() => {
          const accessToken: string = state.getters.getAccessToken;

          tutorModuleService
            .markStudentAttended(accessToken, studentId, classId)
            .then((response) => {
              if (response.status === 200) {
                const theClass: TutorClass = new TutorClass(response.data);

                state
                  .dispatch(ACTIONS.UPDATE_CLASS, theClass)
                  .then(() => {
                    resolve();
                  })
                  .catch((e: Error) => {
                    reject(e);
                  });
              } else if (response.status === 204) {
                reject(new Error("Class / student combination not found"));
              }
            })
            .catch((e: Error) => {
              reject(e);
            });
        })
        .catch((e: Error) => {
          reject(e);
        });
    });
  },
  [ACTIONS.UPDATE_CLASS](state, tutorClass: TutorClass): Promise<void> {
    return new Promise((resolve, reject) => {
      const moduleArray: Array<TutorModule> = new Array<TutorModule>();

      const stateArray = state.getters.getModules;

      stateArray.forEach((module: TutorModule) => {
        moduleArray.push(module);
      });

      if (moduleArray.length === 0) {
        reject(new Error("Error updating class: no modules present in store"));
      }

      moduleArray.forEach((module) => {
        const classes: TutorClass[] = module.classes;

        for (let i = 0; i < classes.length; i++) {
          if (classes[i].classId === tutorClass.classId) {
            classes[i] = tutorClass;
          }
        }
      });

      state.commit(MUTATIONS.UPDATE_TUTORS_MODULES, moduleArray);
      resolve();
    });
  },
};

const getters: GetterTree<State, unknown> = {
  getLoggedIn(state): boolean {
    return state.loggedIn;
  },
  getRefreshIsExpired(state): boolean {
    if (state.refreshTokenExpiry === null) {
      return true;
    } else {
      return new Date() > state.refreshTokenExpiry;
    }
  },
  getAccessTokenIsExpired(state): boolean {
    if (state.accessTokenExpiry === null) {
      return true;
    } else {
      return new Date() > state.accessTokenExpiry;
    }
  },
  getAccessToken(state): string {
    return state.accessToken;
  },
  getModules(state): TutorModule[] {
    return state.tutorModules;
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
