<template>
  <div v-if="show" class="confirmation-dialog">
    <div class="dialog-content">
      <h3>Выберите новый статус</h3>
      <select v-model="selectedStatus">
        <option v-for="status in options" :key="status">{{ status }}</option>
      </select>
      <button @click="confirmStatus" class="confirmation-dialog-button">Подтвердить</button>
      <button @click="cancel" class="confirmation-dialog-button">Отмена</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    options: Array,
  },
  data() {
    return {
      selectedStatus: ''
    }
  },
  methods: {
    confirmStatus() {
      this.$emit('confirm', this.getStatusDisplayValue(this.selectedStatus));
    },
    cancel() {
      this.$emit('cancel');
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
        case 'Работник':
          return 'EMPLOYEE';
        case 'Руководитель':
          return 'MANAGER';
        case 'Администратор':
          return 'ADMIN';
        default:
          return status;
      }
    },
  }
}
</script>

<style scoped>
.confirmation-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #3a3a3a;
  padding: 20px;
  border-radius: 5px;
  color: white;
}

.confirmation-dialog-button {
  background-color: #ffd300;
  font-family:  'Montserrat Alternates', sans-serif;
  color: black;
}

.dialog-content {
  display: flex;
  flex-direction: column;
}

.dialog-content button {
  font-family:  'Montserrat Alternates', sans-serif;
  margin-top: 10px;
}

.dialog-content button:hover {
  background-color: #b59700
}
</style>
