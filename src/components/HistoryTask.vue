<template>
  <div class="history-list">
    <div class="scrollable-list">
      <div class="history" v-for="historyArr in history" :key="historyArr.id">
        <div class="history-header">
          <p class="user-id">{{ historyArr.id }}</p>
          <p class="timestamp">{{ formatDate(historyArr.updatedAt) }}</p>
        </div>
        <div class="history-details">
          <p class="field-name">{{ historyArr.fieldName }}</p>
          <p class="change-values">
            <span class="old-value">{{ historyArr.oldValue }}</span>
            <span class="arrow">→</span>
            <span class="new-value">{{ historyArr.newValue }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    history: Array,
    //usernames: Array,
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleDateString('ru-RU', options);
    },
  }
};
</script>

<style scoped>
.history-list {
  width: 100%;
  max-width: 600px;
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

.history {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.history:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.user-id {
  font-weight: bold;
  color: #333;
}

.timestamp {
  font-size: 0.9em;
  color: #666;
}

.history-details {
  padding-left: 10px;
}

.field-name {
  font-weight: bold;
  color: #555;
}

.change-values {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.old-value, .new-value {
  padding: 2px 4px;
  border-radius: 4px;
}

.old-value {
  background-color: #fdd;
  color: #900;
}

.new-value {
  background-color: #dfd;
  color: #090;
}

.arrow {
  margin: 0 10px;
  color: #333;
}
</style>
