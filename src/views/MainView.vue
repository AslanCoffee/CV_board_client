<template>
  <div class="container">
    <!-- Список задач слева -->
    <div class="task-list-container">
      <div class="task-list" id="task-list">
        <TaskItem
          v-for="task in tasks"
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
      v-if="selectedTask"
      :task="selectedTask"
      @file-uploaded="handleFileUploaded"
      :update-task-data="updateTaskData"
      @update="loadTasks" />
    </div>
    
    <!-- Кнопка создания задачи в углу слева-снизу -->
    <TaskForm @create-task="createTask" />

    <!-- Модальное окно подтверждения -->
    <ConfirmationDialog
      :show="showConfirmationDialog"
      :statusOptions="statusOptions"
      :taskId="selectedTaskId"
      @confirm="confirmStatus"
      @cancel="cancelStatus"
    />
  </div>
</template>

<script>
import TaskItem from '../components/TaskItem.vue';
import TaskForm from '../components/TaskForm.vue';
import TaskDetails from '../components/TaskDetails.vue';
import ConfirmationDialog from '../components/ConfirmationDialog.vue';
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  components: {
    TaskItem,
    TaskForm,
    TaskDetails,
    ConfirmationDialog
  },
  data() {
    return {
      tasks: [],
      showConfirmationDialog: false,
      statusOptions: ['AGREEMENT', 'COLLECT', 'DONE', 'CANCEL', 'REWORK'],
      selectedTask: null,
      selectedTaskId: null
    };
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
    async createTask(taskData) {
      try {
        await this.$store.dispatch('mTask/createTask', taskData);
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
    selectTask(task) {
      this.selectedTask = task;
    },
    async handleFileUploaded(file) {
      try {
        await this.$store.dispatch('mTask/uploadDocument', { file, taskId: this.selectedTask.id });
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
      }
    },
    async updateTaskData({ id, editedTask }) {
      try {
        //console.log(this.tasks);
        await this.$store.dispatch('mTask/updateTask', { id, taskData: editedTask });
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
          // Обновляем данные в массиве tasks через реактивную ссылку ref
          this.tasks[index] = editedTask;
        }
      } catch (error) {
        console.error('Ошибка при сохранении изменений задачи:', error);
      }
    }
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

.task-list-container {
  flex: 1;
  overflow-y: scroll; /* Добавляем вертикальную прокрутку при необходимости */
}

.task-list {
  height: 600px;
  width: 70%;
}

.task-details {
  flex: 1;
  margin-left: 20px;
}
</style>
