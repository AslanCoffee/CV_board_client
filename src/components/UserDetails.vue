<template>
  <div v-if="user" class="user-details">
    <h2>Детали задачи</h2>
    <div v-if="isEditing">
      <!-- Режим редактирования -->
      <div v-for="field in fields" :key="field.key">
        <label :for="field.key">{{ field.label }}</label>
        <input type="text" :id="field.key" v-model="editedUser[field.key]">
      </div>
      <button @click="saveChanges">Сохранить</button>
      <button @click="cancelEdit">Отмена</button>
    </div>
    <div v-else>
      <!-- Режим просмотра -->
      <div v-for="field in fields" :key="field.key">
        <label :for="field.key">{{ field.label }}
        <span>{{ user[field.key] }}</span>
      </label>
      </div>
      <button @click="toggleEditMode">Редактировать</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: Object,
    updateUserData: Function
  },
  data() {
    return {
      editedUser: {},
      isEditing: false,
      fields: [
        { key: 'name', label: 'Имя:' },
        { key: 'email', label: 'email:' },
        { key: 'department', label: 'department:' },
        { key: 'role', label: 'role:' }
      ]
    };
  },
  watch: {
    user: {
      handler(newValue) {
        this.editedUser = { ...newValue };
      },
      immediate: true 
    }
  },
  methods: {
    saveChanges() {
      Object.assign(this.user, this.editedUser);
      this.updateUserData({ id: this.user.id, editedUser: this.editedUser });
      this.isEditing = false;
      this.$emit('update', this.editedUser);
    },
    cancelEdit() {
      this.isEditing = false;
      this.editedUser = { ...this.user };
    },
    toggleEditMode() {
      this.isEditing = true;
    },
  },
  mounted() {
    this.editedUser = { ...this.user };
  },
};
</script>

<style scoped>
.user-details {
  color: white;
  padding: 20px;
  background-color: #686868;
  border-start-start-radius: 5px;
}
</style>
