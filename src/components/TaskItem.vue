<template>
  <div class="task-item">
    <div>
      {{ task.name }} - {{ task.jobTitle }} - {{ task.createDate }}
      <button v-if="visibleRole()" class="status-button" @click="openConfirmationDialog(task.id)">Сменить статус</button>
      <button v-if="visibleRole()" class="delete-button" @click="deleteTask(task.id)">Удалить</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: Object,
    userRole: String,
  },
  methods: {
    openConfirmationDialog(taskId) {
      this.$emit('open-confirmation-dialog', taskId);
    },
    async deleteTask(id){
      await this.$store.dispatch('mTask/deleteTask', {id: id} );
      this.$emit('update');
    },
    visibleRole(){
      if(this.userRole==='MANAGER' || this.userRole==='ADMIN') return true;
      else return false;
    }
  }
}
</script>

<style scoped>
.task-item {
  text-align: left;
  cursor: pointer;
  height: 30px;
  padding: 10px;
  border-bottom: 2px solid #212327;
  position: relative;
  border-bottom: 1px solid #ccc;
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-button {
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
  right: 180px;
  position: absolute;
}


.status-button:hover{
  background-color: #bd9e00;
}
</style>
