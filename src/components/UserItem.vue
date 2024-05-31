<template>
  <div class="user-item" @click="goToDetails">
    <div>
      {{ user.id }} - {{ user.name }}
      <button class="role-button" @click="openConfirmationDialog(user.id)">Сменить роль</button>
      <button class="delete-button" @click="deleteUser(user.id)">Удалить</button>
    </div>
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
    async deleteUser(id){
      await this.$store.dispatch('mUsers/deleteUser', {id: id} );
      this.$emit('update')
    },
  }
}
</script>

<style scoped>
.user-item {
  text-align: left;
  cursor: pointer;
  height: 30px;
  padding: 10px;
  color: black;
  border-bottom: 2px solid #212327;
  position: relative;
  background-color: white;
  border-radius: 5px;
  margin-top: 5px;
  margin-left: 10px;
}

.user-item:hover {
  background-color: rgb(172, 172, 172);
}

.role-button {
  font-family:  'Montserrat Alternates', sans-serif;
  padding: 8px 12px;
  margin-top: 0;
  background-color: #ffd300;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  right: 10px;
}

.delete-button {
  margin-top: 0;
  padding: 8px 12px;
  right: 150px;
  position: absolute;
}

.role-button:hover{
  background-color: #bd9e00;
}
</style>
