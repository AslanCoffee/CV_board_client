<template>
  <div class="history-list">
    <div class="scrollable-list">
      <div class="history" v-for="historyArr in history" :key="historyArr.id">
        <div class="history-header">
          <p class="user-id">{{ getUser(historyArr.userId) }}</p>
          <p class="timestamp">{{ formatDate(historyArr.updatedAt) }}</p>
        </div>
        <div class="history-details">
          <p class="field-name">{{ historyArr.fieldName }}</p>
          <p class="change-values" v-if="historyArr.oldValue || historyArr.newValue">
            <span class="old-value" v-if="historyArr.oldValue" v-html="formatValue(historyArr.oldValue)"></span>
            <span class="arrow" v-if="historyArr.oldValue && historyArr.newValue">→</span>
            <span class="new-value" v-if="historyArr.newValue" v-html="formatValue(historyArr.newValue)"></span>
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
    userList: {
      type: Array,
      default: () => [] // добавляем пустой массив по умолчанию
    }
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleDateString('ru-RU', options);
    },
    formatValue(value) {
      const keywords = ["name", "email", "description", "phone", "jobTitle", "urlCV", "srcCV"];
      const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
      return value.replace(regex, '<br>$1');
    },
    getUser(userId) {
      if (!this.userList || this.userList.length === 0) {
        return 'Неизвестный пользователь';
      }
      if (this.userList.length === 1) {
        return this.userList[0].name;
      }
      const user = this.userList.find(user => user.id === userId);
      return user ? user.name : 'Неизвестный пользователь';
    }
  }
};
</script>

<style scoped>
.history-list {
  margin-bottom: 40px;
  padding: 20px;
  background-color: #686868;
  border-bottom-left-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding-bottom: 40px; /* Добавление внутреннего отступа снизу */
}

.scrollable-list::-webkit-scrollbar-thumb {
  background: #ffd300;
  border-radius: 5px;
}

.scrollable-list::-webkit-scrollbar {
  width: 8px;
  border-radius: 5px solid #ccc;
}

.scrollable-list {
  overflow-y: auto;
  max-height: 400px;
  padding-right: 10px; /* Добавляем отступ для вертикальной прокрутки */
}

.scrollable-list::after {
  content: "";
  display: block;
  height: 40px; /* Высота отступа */
  background-color: #3a3a3a
}

.history {
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
  color: #ffffff;
}

.timestamp {
  font-size: 0.9em;
  color: #c1c1c1;
}

.history-details {
  padding-left: 10px;
}

.field-name {
  font-weight: bold;
  color: #d3d3d3;
}

.change-values {
  display: flex;
  align-items: center;
  margin-top: 5px;
  flex-wrap: wrap;
  justify-content: center;
}

.old-value, .new-value {
  padding: 2px 4px;
  border-radius: 4px;
  max-width: 100%; /* Ограничиваем ширину для переноса строк */
  word-break: break-word; /* Перенос длинных слов */
}

.old-value {
  background-color: rgb(255, 139, 139);
  color: rgb(78, 59, 59);
}

.new-value {
  background-color: rgb(128, 255, 128);
  color: rgb(60, 85, 60);
}

.arrow {
  margin: 0 10px;
  color: #ffffff;
}
</style>
