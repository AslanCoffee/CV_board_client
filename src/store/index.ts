import { createApp } from 'vue'
import { createStore } from 'vuex'
import mReq from '../request/modules/mReq';
import mTask from '../request/modules/mTask';
import mAuth from '@/request/modules/mAuth';

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
    }
  }
});

const app = createApp({})

app.use(store)

export default store;
