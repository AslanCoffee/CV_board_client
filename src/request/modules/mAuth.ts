// mAuth.ts
import mReq from './mReq';
import { ActionContext } from 'vuex';

interface AuthPayload {
  createUserData?: any;
  logInData?: any;
  logOutData?: any;
}

export default {
  state: {
    isAuthenticated: false,
    userRole: null,
    user: null
  },
  mutations: {
    SET_AUTH(state: { isAuthenticated: any; userRole: any; user: any; }, payload: { isAuthenticated: any; userRole: any; user: any; }) {
      state.isAuthenticated = payload.isAuthenticated;
      state.userRole = payload.userRole;
      state.user = payload.user;
    }
  },
  actions: {
    async createUser(context: ActionContext<any, any>, payload: AuthPayload) {
      return mReq.actions.sendRequest(context, { url: '/auth/create-user', method: 'POST', data: payload.createUserData });
    },
    async logIn(context: ActionContext<any, any>, payload: AuthPayload) {
      const response = await mReq.actions.sendRequest(context, { url: '/auth/log-in', method: 'POST', data: payload.logInData});
      context.commit('SET_AUTH', { isAuthenticated: true, userRole: response.role, user: response });
    },
    async logOut(context: ActionContext<any, any>) {
      await mReq.actions.sendRequest(context, { url: '/auth/log-out', method: 'POST'});
      context.commit('SET_AUTH', { isAuthenticated: false, userRole: null, user: null });
    },
    async authenticate(context: ActionContext<any, any>) {
      try {
        const response = await mReq.actions.sendRequest(context, { url: '/auth/check', method: 'GET' });
        context.commit('SET_AUTH', { isAuthenticated: true, userRole: response.role, user: response });
      } catch (error) {
        context.commit('SET_AUTH', { isAuthenticated: false, userRole: null, user: null });
      }
    }
  },
  getters: {
    isAuthenticated: (state: { isAuthenticated: any; }) => state.isAuthenticated,
    userRole: (state: { userRole: any; }) => state.userRole,
    user: (state: { user: any; }) => state.user
  },
  namespaced: true
};
