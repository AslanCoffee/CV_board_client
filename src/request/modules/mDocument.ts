import mReq from './mReq';
import { ActionContext } from 'vuex';

interface DocumentPayload {
  taskId: number;
  fileName: any;
  fileId: number;
}

export default {
  actions: {
    async getDocumentsByTaskId(context: ActionContext<any, any>, payload: DocumentPayload) {
        try {
        return mReq.actions.sendRequest(context, { url: `/documents/task/${payload.taskId}`, method: 'GET' });
        } catch (error) {
        console.error('Ошибка при получении документов для задачи:', error);
        throw error;
        }
    },
  },
  namespaced: true
};
