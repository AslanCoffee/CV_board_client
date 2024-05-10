import axios, { AxiosResponse } from 'axios';
import { ActionContext } from 'vuex';

interface RequestPayload {
  url: string;
  method: string;
  data?: any;
}

const BASE_URL = 'http://localhost:3000';

export default {
  actions: {
    async sendRequest(context: ActionContext<any, any>, payload: RequestPayload): Promise<any> {
      try {
        const requestOptions: Record<string, any> = {
          method: payload.method,
          url: BASE_URL + payload.url,
          data: payload.data,
          withCredentials: true,
        };

        // Установка заголовка Content-Type для запросов POST и PATCH
        // if (payload.method === "POST" || payload.method === "PATCH") {
        //   requestOptions.headers = {
        //     "Content-Type": "application/json"
        //   };
        // }

        const response: AxiosResponse = await axios(requestOptions);

        return response.data;
      } catch (error) {
        throw new Error(`Request failed: ${error}`);
      }
    }
  },
  namespaced: true
};
