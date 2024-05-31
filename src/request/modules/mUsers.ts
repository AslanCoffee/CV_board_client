import mReq from './mReq';
import { ActionContext } from 'vuex';

interface UserPayload {
    userData?: any;
    id?: number;
    newRole?: string;
    file?: File;
    taskId?: number;
    options?: string;
  }

export default {
    actions: {
      async createUser(context: ActionContext<any, any>) {
        return mReq.actions.sendRequest(context, { url: '/users', method: 'POST'});
      },
      async getAll(context: ActionContext<any, any>, payload: UserPayload) {
        return mReq.actions.sendRequest(context, { url: `/users/all`, method: 'GET' });
      },
      async getUserById(context: ActionContext<any, any>, payload: UserPayload) {
        return mReq.actions.sendRequest(context, { url: `/users/${payload.id}`, method: 'GET' });
      },
      async updateUser(context: ActionContext<any, any>, payload: UserPayload) {
        console.log(123)
        return mReq.actions.sendRequest(context, { url: `/users/update/${payload.id}`, method: 'PATCH', data: payload.userData });
      },
      async deleteUser(context: ActionContext<any, any>, payload: UserPayload) {
        return mReq.actions.sendRequest(context, { url: `/users/${payload.id}`, method: 'DELETE' });
      },
      async groupUsers(context: ActionContext<any, any>, payload: UserPayload) {
        return mReq.actions.sendRequest(context, { url: `/users/find/group/${payload}`, method: 'GET' });
      },
      async changeRole(context: ActionContext<any, any>, payload: UserPayload) {
        return mReq.actions.sendRequest(context, { url: '/users/role', method: 'PATCH', data: { id: payload.id, role: payload.newRole } });
      },
      async userHistoryEdit(context: ActionContext<any, any>, payload: UserPayload) {
        return mReq.actions.sendRequest(context, { url: `/history/${payload.id}/keywords`, method: 'GET' });
      },
      async userHistoryMany(context: ActionContext<any, any>, payload: UserPayload) {
        return mReq.actions.sendRequest(context, { url: `/history/${payload.id}/${payload.options}`, method: 'GET' });
      },
    },
    namespaced: true
  };
  