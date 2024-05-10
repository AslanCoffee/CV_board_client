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
      
      <div v-if="files && files.length > 0">
        <h3>Загруженные файлsы:</h3>
        <ul>
          <li v-for="fileId in files" :key="fileId">
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

    <h3>Загруженные файлы down:</h3>
    <div v-if="files && files.length > 0">
      <ul>
        <li v-for="fileId in files" :key="fileId">
          <a :href="`${fileId}`" @click.prevent="downloadFileEvent(fileId)">File {{ fileId }}</a>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    task: Object,
    updateTaskData: Function,
    files: Array,
  },
  data() {
    return {
      editedTask: {}, 
      isEditing: false,
      documents: []
    };
  },
  watch: {
    task: {
      handler(newValue) {
        this.editedTask = { ...newValue };
      },
      immediate: true 
    }
  },
  methods: {
    saveChanges() {
      Object.assign(this.task, this.editedTask);
      this.updateTaskData({ id: this.task.id, editedTask: this.editedTask });
      this.isEditing = false;
      this.$emit('update', this.editedTask);
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
      console.log(fileId)
      this.$emit('file-downloaded', fileId);
    },
    // async downloadFile(fileId) {
    //   try {
    //     const response = await fetch("documents/download/"+fileId);
    //     const blob = await response.blob();
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', fileId);
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     window.URL.revokeObjectURL(url);
    //   } catch (error) {
    //     console.error('Ошибка при загрузке файла:', error);
    //   }
    // },
  },
  mounted() {
    this.editedTask = { ...this.task };
  },
};

// async downloadFile(filename) {
//   try {
//     console.log(filename);
//     const response = await axios.get(`/documents/download/${filename}`, {
//       responseType: 'blob', // Указываем, что ожидаем получить файл в виде blob
//     });
//     console.log(response.data);
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', filename); // Указываем имя файла
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error('Ошибка при скачивании файла:', error);
//     throw error;
//   }
// }
</script>

<style scoped>
.task-details {
  margin-left: 20px;
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
