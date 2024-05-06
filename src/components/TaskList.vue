<template>
  <div class="task-list-container">
    <div class="task-list">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-item"
        @click="showTaskDetails(task)"
      >
        {{ task.id }} - {{ task.name }} - {{ task.statusStage }}
      </div>
    </div>

    <!-- Отображаем детали задачи, если задача выбрана -->
    <TaskDetails v-if="selectedTask" :task="selectedTask" />
  </div>
</template>

<script>
import TaskDetails from './TaskDetails.vue';

export default {
  components: {
    TaskDetails
  },
  data() {
    return {
      tasks: [], // Ваши задачи
      selectedTask: null // Выбранная задача для отображения деталей
    };
  },
  methods: {
    showTaskDetails(task) {
      this.selectedTask = task;
    }
  }
}
</script>

<style scoped>
.task-list-container {
  display: flex;
}

.task-list {
  flex: 1;
}

.task-item {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
</style>
