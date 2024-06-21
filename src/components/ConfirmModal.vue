<template>
    <div v-if="visible" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button @click="confirm" class="confirm-button">Подтвердить</button>
          <button @click="cancel" class="cancel-button">Отмена</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    props: {
      visible: Boolean,
      title: String,
      message: String,
    },
    methods: {
      confirm() {
        this.$emit('confirm');
      },
      cancel() {
        this.$emit('cancel');
      }
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: #5e5e5e;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }
  .modal-actions {
    margin-top: 20px;
  }
  .confirm-button,
  .cancel-button {
    margin: 0 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
  }
  .confirm-button {
    background: #4caf50;
    color: #fff;
  }
  .cancel-button {
    background: #f44336;
    color: #fff;
  }
  </style>
  