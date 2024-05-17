<template>
    <div class="user-list-container">
      <div class="user-list">
        <div
          v-for="user in users"
          :key="user.id"
          class="user-item"
          @click="showUserDetails(user)"
        >
        </div>
      </div>
  
      <!-- Отображаем детали задачи, если задача выбрана -->
      <UserDetails v-if="selectedUser" :user="selectedUser" />
    </div>
  </template>
  
  <script>
  import UserDetails from './UserDetails.vue';
  
  export default {
    components: {
      UserDetails
    },
    data() {
      return {
        users: [], 
        selectedUser: null 
      };
    },
    methods: {
      showUserDetails(user) {
        this.selectedUser = user;
      }
    }
  }
  </script>
  
  <style scoped>
  .user-list-container {
    display: flex;
  }
  
  .user-list {
    flex: 1;
  }
  
  .user-item {
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  </style>
  