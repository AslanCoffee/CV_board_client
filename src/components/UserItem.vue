<template>
  <div class="user-item" @click="goToDetails">
    <div>
      {{ user.id }} - {{ user.name }}
    </div>
    <button class="role-button" @click="openConfirmationDialog(user.id)">Сменить роль</button>
  </div>
</template>

<script>
export default {
  props: {
    user: Object
  },
  methods: {
    openConfirmationDialog(userId) {
      this.$emit('open-confirmation-dialog', userId);
    },
    handleClick() {
      this.$emit('update-user', this.user);
    }
  }
}
</script>

<style scoped>
.user-item {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.role-button {
  padding: 8px 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
