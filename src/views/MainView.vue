<template>
  <div class="head">
    <button @click="toggleFilter">Фильтры</button>
    {{ this.userName }}
    <button class="group-filter" :class="{ active: taskOptions === 'all' }" @click="setActiveFilter('all')">Все</button>
    <button class="group-filter" :class="{ active: taskOptions === 'created' }" @click="setActiveFilter('created')">Мои</button>
    <button class="group-filter" :class="{ active: taskOptions === 'workgroup' }" @click="setActiveFilter('workgroup')">Избранные</button>
    <button v-if="visibleRole()" @click="this.$router.push({ name: 'users' })">Пользователи</button>
    <button class="logout-button" @click="logOut">Exit</button>
  </div>
  <div class="container">
    <!-- Список задач слева -->
    <transition name="slide">
      <div class="filter-buttons" v-if="showFilter">
        <input type="text" v-model="searchQuery" @keyup.enter="performSearch" placeholder="Поиск..." />
        <button v-for="status in statusOptions" :key="status" @click="filterByStatus(status)" :class="{ active: selectedStatus === status }">{{ status }}</button>
        <button @click="filterByStatus('')">Все</button>
      </div>
    </transition>
    <div class="task-list-container">
      <div class="task-list" id="task-list">
        <TaskItem
          v-for="task in sortedTasks"
          :key="task.id"
          :task="task"
          :userRole="userRole"
          @update="loadTasks" 
          @click.prevent="selectTask(task)"
          @open-confirmation-dialog="openConfirmationDialog"
        />
      </div>
    </div>
    
    <!-- Окно с информацией о выбранном резюме справа -->
    <div class="task-details">
      <TaskDetails
      ref="taskDetailsRef"
      v-if="selectedTask"
      :task="selectedTask"
      :activeTab="activeTab"
      :files="selectedTaskDocuments"
      :update-task-data="updateTaskData"
      :sStage="stage"
      @active-tab="setActiveTab"
      @history-list="historyList"
      @update="loadTasks"
      @move-to-next-stage="confirmStatus"
      @update-files="fetchDocuments"
      />
      <History
      v-if="selectedTask && activeTab === 'history'"
      :history="history"
      :userList="users"
      />
    </div>


    <TaskCreate @create-task="createTask" />

    <!-- Модальное окно подтверждения -->
    <ConfirmationDialog
      :show="showConfirmationDialog"
      :options="statusOptions"
      @confirm="confirmStatus"
      @cancel="cancelStatus"
    />
    <!-- Кнопка создания задачи в углу слева-снизу -->
  </div>
</template>

<script>
import TaskItem from '../components/TaskItem.vue';
import TaskDetails from '../components/TaskDetails.vue';
import ConfirmationDialog from '../components/ConfirmationDialog.vue';
import TaskCreate from '../components/TaskCreate.vue';
import Axios from 'axios';
import History from '../components/HistoryTask.vue';
import store from '../request/index';

const VUE_APP_BACKEND_URL = `http://localhost:3000/`;

export default {
  components: {
    TaskItem,
    TaskDetails,
    ConfirmationDialog,
    TaskCreate,
    History,
  },
  data() {
    return {
      tasks: [],
      showConfirmationDialog: false,
      statusOptions: ['Создан', 'Согласован', 'В сборке', 'Выполнен', 'Отказ', 'Доработать', 'Удалён'],
      selectedTask: null,
      selectedTaskId: null,
      searchQuery: '',
      searchPerformed: false,
      history: [],
      users: [],
      selectedStatus: '',
      activeTab: 'workgroup',
      taskOptions: 'all',
      userName: '',
      userRole: '',
      showFilter: false,
      stage: '',
    };
  },
  computed: {
    sortedTasks() {
      if (this.searchPerformed) {
        return this.filteredTasks.slice().sort((a, b) => a.id - b.id);
      } else {
        return this.tasks.slice().sort((a, b) => a.id - b.id);
      }
    },
    filteredTasks() {
      return this.tasks.filter(task => {
        const query = this.searchQuery.toLowerCase();
        const matchesSearchQuery = (task.name && task.name.toLowerCase().includes(query)) ||
                                   (task.email && task.email.toLowerCase().includes(query)) ||
                                   (task.phone && task.phone.toLowerCase().includes(query)) ||
                                   (task.createDate && task.createDate.includes(query)) ||
                                   (task.statusStage && task.statusStage.toLowerCase().includes(query)) ||
                                   (task.jobTitle && task.jobTitle.toLowerCase().includes(query)) ||
                                   (task.description && task.description.toLowerCase().includes(query));
        const matchesStatus = !this.selectedStatus || task.statusStage === this.getStatusDisplayValue(this.selectedStatus);
        return matchesSearchQuery && matchesStatus;
    });
    }
  },
  mounted() {
    this.loadTasks('all');
    console.log(process.env.VUE_APP_BACKEND_URL);
    const user = store.getters['mAuth/user'];
    this.userName = user.name;
    this.userRole = user.role;
  },
  methods: {
    async loadTasks(options) {
      try {
        switch(options){
          case 'created':
            {
              this.taskOptions = 'created'
              const res = await this.$store.dispatch('mTask/getCreatedTask');
              this.tasks = await res;
              break;
            }
          case 'workgroup':
            {
              this.taskOptions = 'workgroup'
              const res = await this.$store.dispatch('mTask/getWorkGroupTask');
              this.tasks = await res;
              break;
            }
          case 'all':
            {
              this.taskOptions = 'all'
              const res = await Axios.get(`${process.env.VUE_APP_BACKEND_URL}tasks/all`);
              this.tasks = await res.data;
              break;
            }
          default:
            this.loadTasks(this.taskOptions)
        }
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
      }
    },
    async createTask(data) {
      try {
        await this.$store.dispatch('mTask/createTask', data);
        await this.loadTasks(this.taskOptions);
      } catch (error) {
        console.error('Ошибка при отправке POST запроса:', error);
      }
    },
    openConfirmationDialog(taskId) {
      this.selectedTaskId = taskId;
      this.showConfirmationDialog = true;
    },
    async confirmStatus(selectedStatus) {
      try {
        if (this.selectedTaskId !== null) {
          await this.$store.dispatch('mTask/changeTaskStatus', { id: this.selectedTaskId, newStatus: selectedStatus });
          await this.loadTasks(this.taskOptions);
          this.historyList();
          this.showConfirmationDialog = false;
          this.selectedTaskId = null;
          this.stage = selectedStatus;
        }
      } catch (error) {
        console.error('Ошибка при изменении статуса задачи:', error);
      }
    },
    cancelStatus() {
      this.showConfirmationDialog = false;
      this.selectedTaskId = null;
    },
    async selectTask(task) {
      await this.fetchDocuments(task.id);
      this.selectedTask = task;
      this.selectedTaskId = task.id;
      this.historyList();
      this.stage = task.statusStage;
    },
    async updateTaskData({ id, editedTask }) {
      try {
        await this.$store.dispatch('mTask/updateTask', { id, taskData: editedTask });
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
          this.tasks[index] = editedTask;
        }
        this.historyList();
      } catch (error) {
        console.error('Ошибка при сохранении изменений задачи:', error);
      }
    },
    async fetchDocuments(taskId) {
      try {
        const response = await this.$store.dispatch('mDocument/getDocumentsByTaskId', { taskId: taskId });
        this.selectedTaskDocuments = response;
      } catch (error) {
        console.error('Ошибка при получении списка документов:', error);
      }
    },
    async historyList() {
      try {
        const res = await Axios.get(`${process.env.VUE_APP_BACKEND_URL}history/task/${this.selectedTask.id}`);
        this.history = await res.data;
        const response = await Axios.get(`${process.env.VUE_APP_BACKEND_URL}workgroup/find/${this.selectedTask.id}`);
        this.users = await response.data;
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    },
    getStatusDisplayValue(status) {
      switch (status) {
        case 'Согласован':
          return 'AGREEMENT';
        case 'Создан':
          return 'CREATE';
        case 'В сборке':
          return 'COLLECT';
        case 'Выполнен':
          return 'DONE';
        case 'Отказ':
          return 'CANCEL';
        case 'Доработать':
          return 'REWORK';
        case 'Удалён':
          return 'DELETED';
        default:
          return status; // Вернуть исходное значение, если неизвестный статус
      }
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    performSearch() {
      if (this.searchPerformed === true) this.searchPerformed = false;
      else this.searchPerformed = true;
    },
    openTaskCreate() {
      this.showTaskCreate = true;
    },
    filterByStatus(status) {
      this.selectedStatus = status;
      this.searchPerformed = true;
    },
    async logOut() {
      try {
        await this.$store.dispatch('mAuth/logOut');
        this.$router.push({ name: 'log' });
        alert('Вы успешно вышли из системы.');
      } catch (error) {
        console.error('Ошибка при выходе из системы:', error);
        alert('Ошибка при выходе из системы. Пожалуйста, попробуйте снова.');
      }
    },
    visibleRole(){
      if(this.userRole==='MANAGER' || this.userRole==='ADMIN') return true;
      else return false;
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    setActiveFilter(filter) {
      this.taskOptions = filter;
      this.loadTasks(filter);
    },
  }
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0; /* Убираем отступы */
  background-color: #45474c; /* Цвет фона */
  color: #fff;
}

.head {
  padding: 30px;
  text-align: left;
}

.head button {
  margin-top: 0px;
  font-size: 15px;
}

.group-filter.active {
  background-color: white;
  color: black;
}

.logout-button {
  position: absolute;
  right: 30px;
}


.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 20px;
  margin-bottom: 40px; /* Добавлено пространство снизу */
  height: calc(100% - 60px); /* Учитываем margin */
  background-color: #45474c; /* Цвет фона */
}

.filter-buttons {
  font-family:  'Montserrat Alternates', sans-serif;
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  background-color: #45474c;
}

.filter-buttons :hover{
  background-color: #adadad;
}

.filter-buttons input[type="text"] {
  margin-bottom: 10px;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white; /* Цвет фона ввода */
  color: black; /* Белый цвет шрифта ввода */
}

.filter-buttons button {
  margin-bottom: 10px;
  padding: 10px;
  font-family:  'Montserrat Alternates', sans-serif;
  font-size: 14px;
  cursor: pointer;
  background-color: white;
  color: black;
  border: none;
  border-radius: 5px;
}

.filter-buttons button:last-child {
  margin-bottom: 0;
}

.filter-buttons button.active {
  background-color: #ffd300;
}

.task-list-container {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 80px); /* Учитываем высоту родительского контейнера и margin */
  color: #212327;
}

/* Width */
.task-list-container::-webkit-scrollbar {
  width: 8px;
  border-radius: 5px solid #ccc;
}

/* Thumb */
.task-list-container::-webkit-scrollbar-thumb {
  background: #ffd300;
  border-radius: 5px;
}

.task-list {
  height: 80vh;
  width: 100%;
}

.task-details {
  flex: 1;
  margin-left: 20px;
  background-color: #686868;
  border-radius: 5px;
  color: white;
  max-width: 500px;
}

.task-list .task-item {
  margin-bottom: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  color: black;
}

.task-list .task-item:hover {
  background-color: rgb(198, 198, 198);
}

.task-list .task-item.selected {
  background-color: #505050;
}

.task-list .task-item h3 {
  margin: 0;
  font-size: 16px;
}

.task-list .task-item p {
  margin: 5px 0;
  font-size: 14px;
}

.task-details .task-detail {
  margin-bottom: 10px;
}

.task-details .task-detail h3 {
  margin: 0;
  font-size: 18px;
}

.task-details .task-detail p {
  margin: 5px 0;
  font-size: 16px;
}

.task-details .file-list {
  margin-top: 10px;
}

.task-details .file-list .file-item {
  margin-bottom: 5px;
}

.task-details .file-list .file-item a {
  text-decoration: none;
  color: #e5ff00;
  font-size: 14px;
}

.task-details .file-list .file-item a:hover {
  text-decoration: underline;
}


.task-create {
  margin-top: 20px;
}

.confirmation-dialog {
  margin-top: 20px;
}

.slide-enter-active, .slide-leave-active {
  transition: transform ease;
}

</style>
