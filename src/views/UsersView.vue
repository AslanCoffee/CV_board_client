<template>
  <div class="head">
    {{ this.userName }}
    <button @click="this.$router.push({name: 'main'})">Главная</button>
    <button class="logout-button" @click="logOut">Exit</button>
  </div>
  <div class="user-container">
    <!-- Поисковая панель -->
    <div class="search-panel">
      <div class="filter-buttons">
        <input type="text" v-model="searchQuery" placeholder="Поиск...">
        <button v-for="role in roleOptions" :key="role" @click="filterByRole(role)" :class="{ active: selectedRole === role }">{{ role }}</button>
        <button @click="filterByRole('')">Все</button>
      </div>
    </div>

    <!-- Список пользователей слева -->
    <div class="user-list-container">
      <div class="user-list" id="user-list">
        <UserItem
          v-for="user in filteredUsers"
          :key="user.id"
          :user="user"
          @update="loadUsers"
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
        
        <div id="chart">
          <ChartComponent
          v-if="selectedUser"
          :user="selectedUser"
          />

      <History
      class="user-history"
      :history="history"
      :userList="userList"
      />
    </div>

    <ConfirmationDialog
      :show="showConfirmationDialog"
      :options="roleOptions"
      :objectId="selectedUserId"
      @confirm="confirmRole"
      @cancel="cancelRole"
    />

    <UserCreate
    @user-create="userCreate"
    />

    </div>

  </div>

</template>

<script>
import UserItem from '../components/UserItem.vue';
import UserDetails from '../components/UserDetails.vue';
import Axios from 'axios';
import ConfirmationDialog from '../components/ConfirmationDialog.vue'
import History from '../components/HistoryTask.vue';
import UserCreate from '../components/UserCreate.vue';
import store from '../request/index';
import ChartComponent from '../components/apextest.vue';

export default {
  components: {
    UserItem,
    UserDetails,
    ConfirmationDialog,
    History,
    UserCreate,
    ChartComponent,
  },
  data() {
    return {
      users: [],
      showConfirmationDialog: false,
      selectedUser: null,
      selectedUserId: null,
      roleOptions: ['Работник', 'Руководитель', 'Администратор'],
      searchPerformed: false,
      searchQuery: '',
      selectedRole: '',
      history: [],
      userList: [],
      userName: '',
    };
  },
  mounted() {
    this.loadUsers();
    const user = store.getters['mAuth/user'];
    this.userName = user.name;
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
                                   const matchesRole = !this.selectedRole || user.role === this.getRoleDisplayValue(this.selectedRole);
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
        this.userList = [this.selectedUser];
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    },
    getRoleDisplayValue(status) {
      switch (status) {
        case 'Работник':
          return 'EMPLOYEE';
        case 'Менеджер':
          return 'MANAGER';
        case 'Администратор':
          return 'ADMIN';
        default:
          return status; // Вернуть исходное значение, если неизвестный статус
      }
    },
    async userCreate(createUserData) {
      try {
        await this.$store.dispatch('mAuth/createUser', { createUserData: createUserData });
        console.log('Регистрация прошла успешно!');
      } catch (error) {
        console.error('Ошибка при регистрации:', error);
      }
    },
    async logOut() {
      try {
        await this.$store.dispatch('mAuth/logOut');
        this.$router.push({ name: 'log' });
        alert('Вы успешно вышли из системы.');
      } catch (error) {
        console.error('Ошибка при выходе из системы:', error);
        alert('Ошибка при выходе из системы. Пожалуйста, попробуйте снова.');
      }
    },
  }
};
</script>

<style>

.logout-button {
  position: absolute;
  right: 30px;
}

.user-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #45474c;
  border-radius: 5px;
  padding: 20px;
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
  min-width: 500px;
}

.user-details {
  flex: 1;
  margin-left: 20px;
}

.user-history {
  margin-left: 20px;
}

</style>
