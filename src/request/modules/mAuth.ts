// mAuth.ts
import mReq from './mReq';
import { ActionContext } from 'vuex';

interface AuthPayload {
  registrationData?: any;
  logInData?: any;
  logOutData?: any;
}

export default {
  actions: {
    async register(context: ActionContext<any, any>, payload: AuthPayload) {
      return mReq.actions.sendRequest(context, { url: '/auth/register', method: 'POST', data: payload.registrationData });
    },
    async logIn(context: ActionContext<any, any>, payload: AuthPayload) {
      return mReq.actions.sendRequest(context, { url: '/auth/log-in', method: 'POST', data: payload.logInData/*{email: payload.logInData.email, password: payload.logInData.password}*/});
    },
    async logOut(context: ActionContext<any, any>) {
      return mReq.actions.sendRequest(context, { url: '/auth/log-out', method: 'POST'});
    },
    async authenticate(context: ActionContext<any, any>) {
      return mReq.actions.sendRequest(context, { url: '/auth', method: 'GET' });
    },
  },
  namespaced: true
};
