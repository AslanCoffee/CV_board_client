<template>
  <div class="work-group-list">
    <div class="scrollable-list">
      <div class="work-group" v-for="user in users" :key="user.id">
        <div class="work-group-header">
          <p class="user-name">{{ user.name }}</p>
          <p class="department">Department: {{ user.department }}</p>
        </div>
        <p class="email">Email: {{ user.email }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    users: Array // Массив пользователей
  }
};
</script>

<style scoped>
.work-group-list {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scrollable-list {
  overflow-y: auto;
  max-height: 400px;
  padding-right: 10px; /* Добавляем отступ для вертикальной прокрутки */
}

.work-group {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.work-group:hover {
  transform: translateY(-5px);
}

.work-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.user-name {
  font-weight: bold;
  color: #333;
  font-size: 1.1em;
}

.department {
  font-size: 0.9em;
  color: #666;
}

.email {
  font-size: 0.9em;
  color: #555;
}
</style>
