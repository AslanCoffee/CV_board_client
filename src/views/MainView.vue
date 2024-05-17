<template>
  <div class="container">
    <!-- Список задач слева -->
    <div class="filter-buttons">
      <input type="text" v-model="searchQuery" @keyup.enter="performSearch" placeholder="Поиск..." />
      <button v-for="status in statusOptions" :key="status" @click="filterByStatus(status)" :class="{ active: selectedStatus === status }">{{ status }}</button>
      <button @click="filterByStatus('')">All</button>
    </div>
    <div class="task-list-container">
      <div class="task-list" id="task-list">
        <TaskItem
          v-for="task in sortedTasks"
          :key="task.id"
          :task="task"
          @click.prevent="selectTask(task)"
          @open-confirmation-dialog="openConfirmationDialog"
        />
      </div>
    </div>
    
    <!-- Окно с информацией о выбранной задаче справа -->
    <div class="task-details">
      <TaskDetails
      ref="taskDetailsRef"
      v-if="selectedTask"
      :task="selectedTask"
      :files="selectedTaskDocuments"
      :update-task-data="updateTaskData"
      @file-uploaded="handleFileUploaded"
      @file-downloaded="downloadFile"
      @history-list="historyList"
      @update="loadTasks" />
      <History
      :history="history"
      />
    </div>

    <TaskCreate @create-task="createTask" />

    <!-- Модальное окно подтверждения -->
    <ConfirmationDialog
      :show="showConfirmationDialog"
      :options="statusOptions"
      :objectId="selectedTaskId"
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
//import UserForm from '../components/UserForm.vue';
import TaskCreate from '../components/TaskCreate.vue';
import Axios from 'axios';
import History from '../components/HistoryTask.vue';


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
      statusOptions: ['CREATE', 'AGREEMENT', 'COLLECT', 'DONE', 'CANCEL', 'REWORK', 'DELETED'],
      selectedTask: null,
      selectedTaskId: null,
      searchQuery: '',
      searchPerformed: false,
      history: [],
      selectedStatus: '',
      userRole: 'EMPLOYEE',
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
                                   (task.statusStage && task.statusStage.toLowerCase().includes(query)) ||
                                   (task.jobTitle && task.jobTitle.toLowerCase().includes(query)) ||
                                   (task.description && task.description.toLowerCase().includes(query));
        const matchesStatus = !this.selectedStatus || task.statusStage === this.selectedStatus;
        return matchesSearchQuery && matchesStatus;
    });
    }
  },
  mounted() {
    this.loadTasks();
  },
  methods: {
    async loadTasks() {
      try {
        const response = await this.$store.dispatch('mTask/getAll');
        this.tasks = await response;
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
      }
    },
    async createTask(data) {
      try {
        await this.$store.dispatch('mTask/createTask', data);
        await this.loadTasks();
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
          await this.loadTasks();
          this.historyList();
          this.showConfirmationDialog = false;
          this.selectedTaskId = null;
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
      this.historyList();
    },
    async handleFileUploaded(file) {
      try {
        await this.$store.dispatch('mTask/uploadDocument', { file, taskData: {taskId: this.selectedTask.id, number: "4551"} });
        this.historyList();
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
      }
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
    async downloadFile(fileId) {
      try {   
        const response = await Axios.get(`${process.env.VUE_APP_BACKEND_URL}documents/download/${fileId.id}`, {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileId.url}`); // Установите имя файла для скачивания
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
      }
    },
    async historyList() {
      try {
        const res = await Axios.get(`${process.env.VUE_APP_BACKEND_URL}history/task/${this.selectedTask.id}`);
        this.history = await res.data;
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    },
    // async historyNames() {
    //   try {
    //     const res = await Axios.get(`${process.env.VUE_APP_BACKEND_URL}history/task/${this.selectedTask.id}`);
    //   } catch (error) {
    //     console.error('Ошибка при загрузке данных:', error);
    //   }
    // },
    performSearch() {
      if (this.searchPerformed === true) this.searchPerformed = false;
      else this.searchPerformed = true;
    },
    openTaskCreate() {
      this.showTaskCreate = true;
    },
    filterByStatus(status) {
      console.log(this.selectedStatus);
      console.log(status);
      this.selectedStatus = status;
      this.searchPerformed = true;
    },
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 20px;
}

.filter-buttons {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}

.filter-buttons input[type="text"] {
  margin-bottom: 10px;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.filter-buttons button {
  margin-bottom: 10px;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
}

.filter-buttons button:last-child {
  margin-bottom: 0;
}

.filter-buttons button.active {
  background-color: #0056b3;
}

.task-list-container {
  flex: 1;
  overflow-y: auto;
  max-height: 600px;
}

.task-list {
  width: 100%;
}

.task-details {
  flex: 1;
  margin-left: 20px;
}

.task-list .task-item {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
  cursor: pointer;
}

.task-list .task-item:hover {
  background-color: #e5e5e5;
}

.task-list .task-item.selected {
  background-color: #d4d4d4;
}

.task-list .task-item h3 {
  margin: 0;
  font-size: 16px;
}

.task-list .task-item p {
  margin: 5px 0;
  font-size: 14px;
}

.task-details {
  margin-top: 20px;
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
  color: #007bff;
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
</style>
