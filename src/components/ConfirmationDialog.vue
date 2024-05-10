<template>
  <div v-if="show" class="confirmation-dialog">
    <div class="dialog-content">
      <h3>Выберите новый статус</h3>
      <select v-model="selectedStatus">
        <option v-for="status in statusOptions" :key="status">{{ status }}</option>
      </select>
      <button @click="confirmStatus">Подтвердить</button>
      <button @click="cancel">Отмена</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    statusOptions: Array,
    taskId: Number
  },
  data() {
    return {
      selectedStatus: ''
    }
  },
  methods: {
    confirmStatus() {
      this.$emit('confirm', this.selectedStatus);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>
.confirmation-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
}

.dialog-content {
  display: flex;
  flex-direction: column;
}

.dialog-content button {
  margin-top: 10px;
}
</style>
