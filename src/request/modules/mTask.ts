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
      return mReq.actions.sendRequest(context, { url: '/tasks', method: 'POST', data: payload.taskData });
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
      try {
        const response = await mReq.actions.sendRequest(context, {
          url: '/tasks/upload', // Убедитесь, что это соответствует URL вашего сервера для загрузки файлов
          method: 'POST',
          data: formData, // Убираем headers, так как библиотека axios автоматически устанавливает правильный Content-Type
        });
        return response;
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        throw error;
      }
    }
  },
  namespaced: true
};
