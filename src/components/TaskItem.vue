<template>
  <div class="task-item" @click="goToDetails">
    <div>
      {{ task.id }} - {{ task.name }} - {{ task.statusStage }}
    </div>
    <button class="status-button" @click="openConfirmationDialog(task.id)">Сменить статус</button>
  </div>
</template>

<script>
import Axios from 'axios';

export default {
  props: {
    task: Object
  },
  methods: {
    openConfirmationDialog(taskId) {
      this.$emit('open-confirmation-dialog', taskId);
    },
    handleClick() {
      this.$emit('update-task', this.task);
    },
    async workGroupList() {
      try {
        const res = await Axios.get(`${process.env.VUE_APP_BACKEND_URL}workgroup/${this.task.id}`);
        const response = await res.data;
        console.log(res);
        console.log(response);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
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
