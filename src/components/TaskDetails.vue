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
              <a :href="`/files/${fileId}`" target="_blank" class="file-link">{{ fileId.url }}</a>
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
          <label :for="field.id" class="label">{{ field.label }}</label>
          <span class="value">{{ task[field.key] }}</span>
        </div>
        <div class="status-section">
          <label class="status-label">Статус: {{ this.task.statusStage }}</label>
        </div>
        <button @click="toggleEditMode" class="edit-button">Редактировать</button>
        <h3>Загруженные файлы:</h3>
        <div v-if="files && files.length > 0" class="file-list">
          <ul>
            <li v-for="fileId in files" :key="fileId" class="file-item">
              <a :href="`${fileId}`" @click.prevent="downloadFileEvent(fileId)" class="file-link">{{ fileId.url }}</a>
            </li>
          </ul>
        </div>
      </template>
    </div>
    <WorkGroup :users="users" />
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
        { id: 'description', label: 'Комментарий:', type: 'text', key: 'description' },
      ],
      viewFields: [
        { id: 'taskName', label: 'ФИО:', key: 'name' },
        { id: 'email', label: 'Email:', key: 'email' },
        { id: 'phone', label: 'Телефон:', key: 'phone' },
        { id: 'jobTitle', label: 'Должность:', key: 'jobTitle' },
        { id: 'description', label: 'Комментарий:', key: 'description' },
      ]
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
    },
    cancelEdit() {
      this.isEditing = false;
      this.editedTask = { ...this.task };
    },
    toggleEditMode() {
      this.isEditing = true;
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      this.$emit('file-uploaded', file);
    },
    async downloadFileEvent(fileId) {
      this.$emit('file-downloaded', fileId);
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
  },
  mounted() {
    this.editedTask = { ...this.task };
    this.workGroupList();
  },
};
</script>

<style scoped>
.task-details {
  margin-left: 20px;
  padding: 20px;
  border: 1px solid #ccc;
}

.form-field {
  margin-bottom: 15px;
}

.label {
  display: block;
  font-weight: bold;
}

.input {
  width: 100%;
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
  padding: 8px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.edit-button {
  background-color: #28a745;
}

.save-button:hover,
.cancel-button:hover,
.edit-button:hover {
  opacity: 0.8;
}
</style>
