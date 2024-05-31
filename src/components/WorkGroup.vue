<template>
  <div class="work-group-list">
    <div class="scrollable-list">
      <div class="work-group" v-for="user in users" :key="user.id">
        <div class="work-group-header">
          <p class="user-name">{{ user.name }}</p>
          <p class="department">Отдел: {{ user.department }}</p>
        </div>
        <p class="email">Почта: {{ user.email }}</p>
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
  background-color: #5d6064;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scrollable-list {
  overflow-y: auto;
  max-height: 400px;
  padding-right: 10px; /* Добавляем отступ для вертикальной прокрутки */
}

.work-group {
  background-color: #3a3a3a;
  color: white;
  border-radius: 8px;
  padding: 15px;
  margin-top: auto;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

/* .work-group:hover {
  transform: translateY(-5px);
} */

.work-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.user-name {
  font-weight: bold;
  color: #ffffff;
  font-size: 1.1em;
}

.department {
  font-size: 0.9em;
  color: #d0d0d0;
}

.email {
  font-size: 0.9em;
  color: #9e9e9e;
}
</style>
