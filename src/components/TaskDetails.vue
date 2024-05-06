<template>
  <div v-if="task" class="task-details">
    <h2>Детали задачи</h2>
    <div v-if="isEditing">
      <!-- Режим редактирования -->
      <div>
        <label for="taskName">Название:</label>
        <input type="text" id="taskName" v-model="editedTask.name">
      </div>
      <!-- Дополнительные поля для редактирования информации о задаче -->
      <div>
        <label for="email">email:</label>
        <input type="text" id="email" v-model="editedTask.email">
      </div>
      <div>
        <label for="phone">phone:</label>
        <input type="text" id="phone" v-model="editedTask.phone">
      </div>
      <div>
        <label for="jobTitle">job title:</label>
        <input type="text" id="jobTitle" v-model="editedTask.jobTitle">
      </div>
      <div>
        <label for="description">Комментарий:</label>
        <input type="text" id="description" v-model="editedTask.description">
      </div>
      <div>
        <label for="taskStatus">Статус:</label>
        <span>{{ editedTask.statusStage }}</span>
      </div>
      
      <div v-if="task.files && task.files.length > 0">
        <h3>Загруженные файлы:</h3>
        <ul>
          <li v-for="fileId in task.files" :key="fileId">
            <a :href="`/files/${fileId}`" target="_blank">File {{ fileId }}</a>
          </li>
        </ul>
      </div>


      <div>
        <label for="fileInput">Выберите файл:</label>
        <input type="file" id="fileInput" @change="handleFileUpload">
      </div>
      <button @click="saveChanges">Сохранить</button>
      <button @click="cancelEdit">Отмена</button>
    </div>
    <div v-else>
      <!-- Режим просмотра -->
      <div>
        <label for="taskName">Название:</label>
        <span>{{ task.name }}</span>
      </div>
      <div>
        <label for="email">email:</label>
        <span>{{ task.email }}</span>
      </div>
      <div>
        <label for="phone">phone:</label>
        <span>{{ task.phone }}</span>
      </div>
      <div>
        <label for="jobTitle">job title:</label>
        <span>{{ task.jobTitle }}</span>
      </div>
      <div>
        <label for="description">Комментарий:</label>
        <span>{{ task.description }}</span>
      </div>
      <div>
        <label for="taskStatus">Статус:</label>
        <span>{{ task.statusStage }}</span>
      </div>
      <button @click="toggleEditMode">Редактировать</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: Object,
    updateTaskData: Function // Функция для обновления данных задачи
  },
  data() {
    return {
      editedTask: {}, // Объект для хранения отредактированных данных задачи
      isEditing: false // Флаг режима редактирования
    };
  },
  watch: {
    task: {
      handler(newValue) {
        // Копируем данные задачи в объект editedTask при обновлении свойства task
        this.editedTask = { ...newValue };
      },
      immediate: true // Вызываем handler сразу после создания компонента
    }
  },
  methods: {
    saveChanges() {
      Object.assign(this.task, this.editedTask);
      // Вызываем функцию для сохранения изменений с передачей отредактированных данных
      this.updateTaskData({ id: this.task.id, editedTask: this.editedTask });
      // Переключаем режим в просмотр после сохранения изменений
      this.isEditing = false;
      this.$emit('update', this.editedTask);
    },
    cancelEdit() {
      // Отменяем редактирование и возвращаем исходные данные задачи
      this.isEditing = false;
      this.editedTask = { ...this.task };
    },
    toggleEditMode() {
      // Переключаем режим между просмотром и редактированием
      this.isEditing = true;
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      // Эмитируем событие для загрузки файла
      this.$emit('file-uploaded', file);
    }
  },
  mounted() {
    // Загрузка данных задачи при открытии страницы
    this.editedTask = { ...this.task };
  },
};
</script>

<style scoped>
.task-details {
  margin-left: 20px; /* Располагаем детали справа от списка задач */
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
