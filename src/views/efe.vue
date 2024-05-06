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
        :update-task-data="updateTaskData" />
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
  import { defineComponent, ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  
  export default defineComponent({
    components: {
      TaskItem,
      TaskForm,
      TaskDetails,
      ConfirmationDialog
    },
    setup() {
      const store = useStore();
      const tasks = ref([]);
      const showConfirmationDialog = ref(false);
      const statusOptions = ref(['AGREEMENT', 'COLLECT', 'DONE', 'CANCEL', 'REWORK']);
      const selectedTask = ref(null);
      const selectedTaskId = ref(null);
  
      onMounted(async () => {
        await loadTasks();
      });
  
      const loadTasks = async () => {
        try {
          const response = await store.dispatch('mTask/getAll');
          tasks.value = await response;
        } catch (error) {
          console.error('Ошибка при загрузке задач:', error);
        }
      };
  
      const createTask = async (taskData) => {
        try {
          await store.dispatch('mTask/createTask', taskData);
          await loadTasks();
        } catch (error) {
          console.error('Ошибка при отправке POST запроса:', error);
        }
      };
  
      const openConfirmationDialog = (taskId) => {
        selectedTaskId.value = taskId;
        showConfirmationDialog.value = true;
      };
  
      const confirmStatus = async (selectedStatus) => {
        try {
          if (selectedTaskId.value !== null) {
            await store.dispatch('mTask/changeTaskStatus', { id: selectedTaskId.value, newStatus: selectedStatus });
            await loadTasks(); // После изменения статуса обновляем список задач
            showConfirmationDialog.value = false;
            selectedTaskId.value = null;
          }
        } catch (error) {
          console.error('Ошибка при изменении статуса задачи:', error);
        }
      };
  
      const cancelStatus = () => {
        showConfirmationDialog.value = false;
        selectedTaskId.value = null;
      };
  
      const selectTask = (task) => {
        selectedTask.value = task;
      };
  
      const handleFileUploaded = async (file) => {
        try {
          console.log("123");
          // Вызываем метод uploadDocument, передавая файл
          await store.dispatch('mTask/uploadDocument', { file });
          // Можно выполнить дополнительные действия после загрузки файла, если необходимо
        } catch (error) {
          console.log("0000");
          console.error('Ошибка при загрузке файла:', error);
        }
      };
  
      const updateTaskData = async ({ id, editedTask }) => {
        try {
          await store.dispatch('mTask/updateTask', { id, taskData: editedTask });
          // Обновляем данные задачи в списке после сохранения изменений
          const index = tasks.value.findIndex(task => task.id === id);
          if (index !== -1) {
            tasks.value.splice(index, 1, editedTask);
          }
        } catch (error) {
          console.error('Ошибка при сохранении изменений задачи:', error);
        }
      };
  
      const handleUpdateTask = (task) => {
        // Вызываем метод обновления данных задачи
        updateTaskData({ id: task.id, editedTask: task });
      };
  
      return {
        tasks,
        showConfirmationDialog,
        statusOptions,
        loadTasks,
        createTask,
        openConfirmationDialog,
        confirmStatus,
        cancelStatus,
        selectTask,
        selectedTask,
        handleFileUploaded,
        updateTaskData,
        handleUpdateTask
      };
    }
  });
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
  