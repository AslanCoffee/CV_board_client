<template>
  <div>
    <!-- Регистрация -->
    <div v-if="!isLoggedIn">
      <h2>Регистрация</h2>
      <form @submit.prevent="register">
        <div>
          <label for="registerUsername">email:</label>
          <input type="text" id="registerUsername" v-model="registerData.email" required>
        </div>
        <div>
          <label for="registerPassword">Пароль:</label>
          <input type="password" id="registerPassword" v-model="registerData.password" required>
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>

    <!-- Авторизация -->
    <div v-if="!isLoggedIn">
      <h2>Авторизация</h2>
      <form @submit.prevent="login">
        <div>
          <label for="loginUsername">email:</label>
          <input type="text" id="email" v-model="loginData.email" required>
        </div>
        <div>
          <label for="loginPassword">Пароль:</label>
          <input type="password" id="password" v-model="loginData.password" required>
        </div>
        <button type="submit">Войти</button>
      </form>
    </div>

    <!-- Сообщение об успешной авторизации -->
    <div>
      <h2>Вы вошли в систему!</h2>
      <button @click="logout">Выйти</button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';

export default {
  data() {
    return {
      registerData: {
        email: '',
        password: ''
      },
      loginData: {
        email: '',
        password: ''
      },
      isLoggedIn: false
    };
  },
  methods: {
    async register() {
      try {
        await this.$store.dispatch('mAuth/register', { registrationData: this.registerData });
        alert('Регистрация прошла успешно!');
      } catch (error) {
        console.error('Ошибка при регистрации:', error);
        alert('Ошибка при регистрации. Пожалуйста, попробуйте снова.');
      }
    },
    async login() {
      try {
        await this.$store.dispatch('mAuth/logIn', { logInData: this.loginData });
        this.isLoggedIn = true; 
        alert('Вы успешно вошли в систему!');
        //await this.$store.dispatch('mAuth/authenticate');
      } catch (error) {
        console.error('Ошибка при авторизации:', error);
        alert('Ошибка при авторизации. Пожалуйста, попробуйте снова.');
      }
    },
    async logout() {
      try {
        await this.$store.dispatch('mAuth/logOut');
        this.isLoggedIn = false; 
        alert('Вы успешно вышли из системы.');
      } catch (error) {
        console.error('Ошибка при выходе из системы:', error);
        alert('Ошибка при выходе из системы. Пожалуйста, попробуйте снова.');
      }
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
}

input[type="text"],
input[type="password"] {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 3px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.alert {
  margin-top: 20px;
  padding: 10px;
  border-radius: 3px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}
</style>
