import { createApp } from 'vue'
import { createStore } from 'vuex'
import mReq from './modules/mReq';
import mTask from './modules/mTask';
import mAuth from '@/request/modules/mAuth';
import mDocument from '@/request/modules/mDocument';
import mUsers from './modules/mUsers';

const store = createStore({
  modules: {
    mReq: {
      ...mReq
    },
    mTask: {
      ...mTask
    },
    mAuth: {
      ...mAuth
    },
    mDocument: {
      ...mDocument
    },
    mUsers: {
      ...mUsers
    }
  }
});

const app = createApp({})

app.use(store)

export default store;
