<template>
  <div class="user-container">
    <!-- Поисковая панель -->
    <div class="search-panel">
      <input type="text" v-model="searchQuery" placeholder="Поиск...">
      <div class="filter-buttons">
        <button v-for="role in roleOptions" :key="role" @click="filterByRole(role)" :class="{ active: selectedRole === role }">{{ role }}</button>
        <button @click="filterByRole('')">All</button>
      </div>
    </div>

    <!-- Список пользователей слева -->
    <div class="user-list-container">
      <div class="user-list" id="user-list">
        <UserItem
          v-for="user in filteredUsers"
          :key="user.id"
          :user="user"
          @click.prevent="selectUser(user)"
          @open-confirmation-dialog="openConfirmationDialog"
        />
      </div>
    </div>
    
    <!-- Окно с информацией о выбранном пользователе справа -->
    <div class="user-details">
      <UserDetails
        v-if="selectedUser"
        :user="selectedUser"
        :update-user-data="updateUserData"
        @update="loadUsers"
        @history-list="historyList"/>
      <History :history="history"/>
    </div>

    <ConfirmationDialog
      :show="showConfirmationDialog"
      :options="roleOptions"
      :objectId="selectedUserId"
      @confirm="confirmRole"
      @cancel="cancelRole"
    />
  </div>
</template>

<script>
import UserItem from '../components/UserItem.vue';
import UserDetails from '../components/UserDetails.vue';
import Axios from 'axios';
import ConfirmationDialog from '../components/ConfirmationDialog.vue'
import History from '../components/HistoryTask.vue';

export default {
  components: {
    UserItem,
    UserDetails,
    ConfirmationDialog,
    History,
  },
  data() {
    return {
      users: [],
      showConfirmationDialog: false,
      selectedUser: null,
      selectedUserId: null,
      roleOptions: ['EMPLOYEE', 'MANAGER', 'ADMIN'],
      searchPerformed: false,
      searchQuery: '',
      selectedRole: '',
      history: [],
    };
  },
  mounted() {
    this.loadUsers();
  },
  computed: {
    sortedTasks() {
      if (this.searchPerformed) {
        return this.filteredTasks.slice().sort((a, b) => a.id - b.id);
      } else {
        return this.users.slice().sort((a, b) => a.id - b.id);
      }
    },
    filteredUsers() {
      return this.users.filter(user => {
        const query = this.searchQuery.toLowerCase();
        const matchesSearchQuery = (user.name && user.name.toLowerCase().includes(query)) ||
                                   (user.department && user.department.toLowerCase().includes(query)) ||
                                   (user.role && user.role.toLowerCase().includes(query)) ||
                                   (user.email && user.email.toLowerCase().includes(query));
                                   const matchesRole = !this.selectedRole || user.role === this.selectedRole;
        return matchesSearchQuery && matchesRole;
    });
    }
  },
  methods: {
    async loadUsers() {
      try {
        const response = await Axios.get(`${process.env.VUE_APP_BACKEND_URL}users/all`);
        this.users = await response.data;
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
      }
    },
    async selectUser(user) {
      this.selectedUser = user;
      this.historyList()
    },
    async updateUserData({ id, editedUser }) {
      try {
        await this.$store.dispatch('mUsers/updateUser', { id, userData: editedUser });
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
          this.users[index] = editedUser;
        }
      } catch (error) {
        console.error('Ошибка при сохранении изменений пользователя:', error);
      }
    },
    performSearch() {
      if (this.searchPerformed === true) this.searchPerformed = false;
      else this.searchPerformed = true;
    },
    filterByRole(role) {
      console.log(this.selectedRole);
      console.log(role);
      this.selectedRole = role;
      this.searchPerformed = true;
    },
    openConfirmationDialog(userId) {
      this.selectedUserId = userId;
      this.showConfirmationDialog = true;
    },
    async confirmRole(selectedRole) {
      try {
        if (this.selectedUser !== null) {
          await this.$store.dispatch('mUsers/changeRole', { id: this.selectedUserId, newRole: selectedRole });
          await this.loadUsers();
          this.showConfirmationDialog = false;
          this.selectedUser = null;
        }
      } catch (error) {
        console.error('Ошибка при изменении статуса задачи:', error);
      }
    },
    cancelRole() {
      this.showConfirmationDialog = false;
      this.selectedUser = null;
    },
    async historyList() {
      try {
        const res = await Axios.get(`${process.env.VUE_APP_BACKEND_URL}history/user/${this.selectedUser.id}`);
        this.history = await res.data;
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    },
  }
};
</script>

<style>
.user-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px;
}

.search-panel {
  flex: 0 0 auto;
  margin-bottom: 20px;
}

.user-list-container {
  flex: 1;
  overflow-y: auto; /* Включаем вертикальную прокрутку по мере необходимости */
}

.user-list {
  max-height: 600px; /* Ограничиваем высоту списка, чтобы активировать прокрутку при необходимости */
  overflow-y: auto; /* Включаем вертикальную прокрутку по мере необходимости */
  padding-right: 10px; /* Добавляем небольшой отступ справа для избежания наложения прокрутки на контент */
}

.user-details {
  flex: 1;
  margin-left: 20px;
}
</style>
