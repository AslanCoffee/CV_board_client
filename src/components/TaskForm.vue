<template>
    <div class="button-container">
      <button class="send-button" @click="sendPostRequest">Создать карточку</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        taskData: ''
      }
    },
    methods: {
      sendPostRequest() {
        this.$emit('create-task', this.taskData);
      }
    }
  }
  </script>
  
  <style scoped>
  .button-container {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 20px; /* Убираем фиксированную ширину */
  }
  
  .send-button {
    width: 200px; /* Устанавливаем фиксированную ширину */
    padding: 15px;
    border: none;
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  