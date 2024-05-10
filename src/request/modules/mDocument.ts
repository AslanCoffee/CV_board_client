import mReq from './mReq';
import { ActionContext } from 'vuex';

interface DocumentPayload {
  taskId: number;
  fileName: any;
}

export default {
  actions: {
    async getDocumentsByTaskId(context: ActionContext<any, any>, payload: DocumentPayload) {
        try {
        console.log(payload.taskId)
        return mReq.actions.sendRequest(context, { url: `/documents/task/${payload.taskId}`, method: 'GET' });
        } catch (error) {
        console.error('Ошибка при получении документов для задачи:', error);
        throw error;
        }
    },
    async documentDownload(context: ActionContext<any, any>, payload: DocumentPayload) {
        try {
            // if(typeof "File" === payload.fileName) console.log(228);
            console.log(payload);
            return mReq.actions.sendRequest(context, { url: `/documents/download/${payload}`, method: 'GET' });
            } catch (error) {
            console.error('Ошибка при получении документов для задачи:', error);
            throw error;
            }
        },
  },
  namespaced: true
};
