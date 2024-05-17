// mTask.ts
import mReq from './mReq';
import { ActionContext } from 'vuex';

interface TaskPayload {
  taskData?: any;
  id?: number;
  newStatus?: string;
  file?: File;
}

export default {
  actions: {
    async createTask(context: ActionContext<any, any>, payload: TaskPayload) {
      return mReq.actions.sendRequest(context, { url: '/tasks', method: 'POST', data: payload});
    },
    async getAll(context: ActionContext<any, any>, payload: TaskPayload) {
      return mReq.actions.sendRequest(context, { url: `/tasks/all`, method: 'GET' });
    },
    async getTaskById(context: ActionContext<any, any>, payload: TaskPayload) {
      return mReq.actions.sendRequest(context, { url: `/tasks/${payload.id}`, method: 'GET' });
    },
    async updateTask(context: ActionContext<any, any>, payload: TaskPayload) {
      return mReq.actions.sendRequest(context, { url: `/tasks/update/${payload.id}`, method: 'PATCH', data: payload.taskData });
    },
    async deleteTask(context: ActionContext<any, any>, payload: TaskPayload) {
      return mReq.actions.sendRequest(context, { url: `/tasks/${payload.id}`, method: 'DELETE' });
    },
    async changeTaskStatus(context: ActionContext<any, any>, payload: TaskPayload) {
      return mReq.actions.sendRequest(context, { url: '/tasks/status', method: 'PATCH', data: { id: payload.id, statusStage: payload.newStatus } });
    },
    async uploadDocument(context: ActionContext<any, any>, payload: TaskPayload) {
      if (!payload.file) {
        throw new Error('Файл не выбран');
      }
      const formData = new FormData();
      formData.append('file', payload.file);
      formData.append('number', payload.taskData.number);
      formData.append('taskId', payload.taskData.taskId);
      try {
        const response = await mReq.actions.sendRequest(context, {
          url: '/tasks/documents',
          method: 'POST',
          data: formData, 
        });
        return response;
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        throw error;
      }
    },
    async addWorkGroup(context: ActionContext<any, any>, payload: number) {//мб стоит сделать отдельный mWorkGroup, но смысла особо не вижу ради одной команды
      return mReq.actions.sendRequest(context, { url: `/workgroup/add-user`, method: 'POST', data: {taskId: payload} });
    },
  },
  namespaced: true
};
