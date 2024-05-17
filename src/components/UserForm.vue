<template>
    <div class="button-workgroup">
      <button class="add-workgroup" @click="addWorkGroup">Добавиться в группу</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      addWorkGroup() {
        this.$emit('add-group');
      }
    }
  }
  </script>
  
  <style scoped>
  .button-workgroup {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 20px; /* Убираем фиксированную ширину */
  }
  
  .add-workgroup {
    width: 200px; /* Устанавливаем фиксированную ширину */
    padding: 15px;
    border: none;
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  