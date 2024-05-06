<template>
  <div class="task-item" @click="goToDetails">
    <div>
      {{ task.id }} - {{ task.name }} - {{ task.statusStage }}
    </div>
    <button class="status-button" @click="openConfirmationDialog(task.id)">статус</button>
  </div>
</template>

<script>
export default {
  props: {
    task: Object
  },
  methods: {
    openConfirmationDialog(taskId) {
      this.$emit('open-confirmation-dialog', taskId);
    },
    handleClick() {
      // Эмитируем событие для обновления данных задачи
      this.$emit('update-task', this.task);
    }
  }
}
</script>

<style scoped>
.task-item {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.status-button {
  padding: 8px 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
