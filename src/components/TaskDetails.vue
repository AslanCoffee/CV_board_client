<template>
  <div class="task-details">
    <h2>Детали задачи</h2>
    <div>
      <template v-if="isEditing">
        <div v-for="field in editFields" :key="field.id" class="form-field">
          <label :for="field.id" class="label">{{ field.label }}</label>
          <input :type="field.type" :id="field.id" v-model="editedTask[field.key]" class="input">
        </div>
        <div class="file-upload-section">
          <h3>Загруженные файлы:</h3>
          <ul class="file-list">
            <li v-for="fileId in files" :key="fileId" class="file-item">
              <a :href="`/files/${fileId}`" target="_blank" class="file-link">{{ getFileName(fileId.url) }}</a>
            </li>
          </ul>
          <label for="fileInput" class="file-input-label">Выберите файл:</label>
          <input type="file" id="fileInput" @change="handleFileUpload" class="file-input">
        </div>
        <div class="buttons">
          <button @click="saveChanges" class="save-button">Сохранить</button>
          <button @click="cancelEdit" class="cancel-button">Отмена</button>
        </div>
      </template>
      <template v-else>
        <div v-for="field in viewFields" :key="field.id" class="field">
          <label :for="field.id" class="label">{{ field.label }}
            <span class="value">{{ task[field.key] }}</span>
          </label>
        </div>
        <div class="status-section">
          <label class="status-label">Статус: {{ getStatusDisplayValue(this.task.statusStage) }}</label>
        </div>
        <button @click="toggleEditMode" class="edit-button">Редактировать</button>
        <h3>Загруженные файлы:</h3>
        <div v-if="files && files.length > 0" class="file-list">
          <ul>
            <li v-for="fileId in files" :key="fileId" class="file-item">
              <a :href="`${fileId}`" @click.prevent="downloadFileEvent(fileId)" class="file-link">{{ getFileName(fileId.url) }}</a>
            </li>
          </ul>
        </div>
        <div class="tab-buttons">
          <button class="tab-work" @click="setActiveTab('workgroup')" :class="{ active: activeTab === 'workgroup' }">Рабочая группа</button>
          <button class="tab-history" @click="setActiveTab('history')" :class="{ active: activeTab === 'history' }">История</button>
        </div>
      </template>
    </div>
    <WorkGroup
    v-if="activeTab === 'workgroup'"
    :users="users"
    />
    <UserForm @click="addGroup" />
  </div>
</template>

<script>
import Axios from 'axios';
import WorkGroup from './WorkGroup.vue';
import UserForm from './UserForm.vue';

export default {
  components: {
    WorkGroup,
    UserForm,
  },
  props: {
    task: Object,
    updateTaskData: Function,
    files: Array,
    activeTab: String,
  },
  data() {
    return {
      users: [],
      editedTask: {},
      isEditing: false,
      editFields: [
        { id: 'taskName', label: 'ФИО:', type: 'text', key: 'name' },
        { id: 'email', label: 'Email:', type: 'text', key: 'email' },
        { id: 'phone', label: 'Телефон:', type: 'text', key: 'phone' },
        { id: 'jobTitle', label: 'Должность:', type: 'text', key: 'jobTitle' },
        { id: 'urlCV', label: 'Ссылка на резюме:', type: 'text', key: 'urlCV' },
        { id: 'srcCV', label: 'Источник:', type: 'text', key: 'srcCV' },
        { id: 'description', label: 'Комментарий:', type: 'text', key: 'description' },
      ],
      viewFields: [
        { id: 'taskName', label: 'ФИО:', key: 'name' },
        { id: 'email', label: 'Email:', key: 'email' },
        { id: 'phone', label: 'Телефон:', key: 'phone' },
        { id: 'jobTitle', label: 'Должность:', key: 'jobTitle' },
        { id: 'urlCV', label: 'Ссылка на резюме:', key: 'urlCV' },
        { id: 'srcCV', label: 'Источник:', key: 'srcCV' },
        { id: 'description', label: 'Комментарий:', key: 'description' },
      ],
      temporaryFiles: [],
    };
  },
  watch: {
    task: {
      handler(newValue) {
        this.editedTask = { ...newValue };
        this.workGroupList();
      },
      immediate: true 
    },
  },
  methods: {
    async saveChanges() {
      Object.assign(this.task, this.editedTask);
      this.updateTaskData({ id: this.task.id, editedTask: this.editedTask });
      this.isEditing = false;
      
      if (this.temporaryFiles.length > 0) {
        for (const file of this.temporaryFiles) {
          await this.uploadFile(file);
        }
        this.temporaryFiles = []; // очищаем временный массив файлов после загрузки
      }
    },
    setActiveTab(tab){
      this.$emit('active-tab', tab)
    },
    cancelEdit() {
      this.isEditing = false;
      this.editedTask = { ...this.task };
    },
    toggleEditMode() {
      this.isEditing = true;
    },
    async handleFileUpload(event) {
      try {
        const file = event.target.files[0];
        const fileName = file.name;
        await this.$store.dispatch('mTask/uploadDocument', { file, taskData: {taskId: this.task.id, number: "4551", fileName: fileName} });
        this.$emit('history-list');
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
      }
    },
    async downloadFileEvent(fileId) {
      try {   
        const response = await Axios.get(`${process.env.VUE_APP_BACKEND_URL}documents/download/${fileId.id}`, {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileId.url}`); // Установите имя файла для скачивания
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
      }
    },
    async workGroupList() {
      try {
        const res = await Axios.get(`${process.env.VUE_APP_BACKEND_URL}workgroup/find/${this.task.id}`);
        this.users = await res.data;
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    },
    async addGroup() {
      try {
        await this.$store.dispatch('mTask/addWorkGroup', this.task.id);
        this.workGroupList();
        this.$emit('history-list');
      } catch (error) {
        console.error('Ошибка при отправке POST запроса:', error);
      }
    },
    getFileName(url) {
      const startIndex = 14; // Индекс, с которого начинается нужная часть имени файла
      return url.substring(startIndex); // Обрезаем начальную часть и возвращаем оставшуюся
    },
    getStatusDisplayValue(status) {
      switch (status) {
        case 'AGREEMENT':
          return 'Согласован';
        case 'CREATE':
          return 'Создан';
        case 'COLLECT':
          return 'В сборке';
        case 'DONE':
          return 'Выполнен';
        case 'CANCEL':
          return 'Отказ';
        case 'REWORK':
          return 'Доработать';
        case 'DELETED':
          return 'Удалён';
        default:
          return status; // Вернуть исходное значение, если неизвестный статус
      }
    },
  },
  mounted() {
    this.editedTask = { ...this.task };
    this.workGroupList();
  },
};
</script>

<style scoped>
.task-details {
  padding: 20px;
}

.form-field {
  margin-bottom: 15px;
}

.label {
  display: block;
  font-weight: bold;
}

.status-section {
  font-weight: bold;
}

.value {
  font-weight: normal;
}

.input {
  width: 90%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.file-upload-section {
  margin-top: 20px;
}

.file-list {
  margin-top: 10px;
}

.file-item {
  margin-bottom: 5px;
  list-style-type: none;
}

.file-link {
  text-decoration: none; /* Убираем подчеркивание ссылок */
  color: #007bff; /* Цвет ссылок */
}

.file-link:hover {
  text-decoration: underline; /* Добавляем подчеркивание при наведении */
}

.file-input-label {
  display: block;
  margin-top: 10px;
}

.file-input {
  margin-top: 5px;
}

.buttons {
  margin-top: 20px;
}

.save-button,
.cancel-button,
.edit-button {
  font-family:  'Montserrat Alternates', sans-serif;
  padding: 8px 15px;
  margin-right: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  background-color: #ffd300;
  color: black;
  cursor: pointer;
}

.save-button:hover,
.cancel-button:hover,
.edit-button:hover {
  opacity: 0.8;
}

.tab-work {
  top: 100px;
  right: 500px;
  background-color: #ffd300;
  border-bottom: white;
  color: black;
  font-family:  'Montserrat Alternates', sans-serif;
}

.tab-buttons button.active {
  background-color: #5d6064;
  color: white;
}

.tab-work:hover {
  background-color: #c3a200;
}

.tab-history {
  font-family:  'Montserrat Alternates', sans-serif;
  top: 100px;
  right: 30px;
  background-color: #ffd300;
  color: black;
}

.tab-history:hover {
  background-color: #b69800;
}

</style>
