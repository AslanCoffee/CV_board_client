<template>
  <div class="login-page">
    <div class="head">

    </div>
    <div class="container">
      <!-- Авторизация -->
      <div class="block">
        <h2>Авторизация</h2>
        <form @submit.prevent="login">
          <div>
            <label for="loginUsername" class="login-from">Email:</label>
            <input type="text" id="loginUsername" v-model="loginData.email" required>
          </div>
          <div>
            <label for="loginPassword">Пароль:</label>
            <input type="password" id="loginPassword" v-model="loginData.password" required>
          </div>
          <button type="submit">Войти</button>
        </form>
      </div>
    </div>
</div>
</template>

<script>

export default {
  data() {
    return {
      loginData: {
        email: '',
        password: ''
      },
    };
  },
  mounted() {
    this.getLog();
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('mAuth/logIn', {logInData: this.loginData} );
        this.$router.push({ name: 'main' });
      } catch (error) {
        console.error('Ошибка при авторизации:', error);
        alert('Ошибка при авторизации. Пожалуйста, попробуйте снова.');
      }
    },
    async getLog() {
      try {
        await this.$store.dispatch('mAuth/authenticate');
      } catch (error) {
        console.error('Ошибка Авторизации', error);
      }
    }
  }
};
</script>

<style>

.login-page .head {
  text-align: center;
  margin-bottom: 20px;
}

.login-page .container {
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
  background-color: #45474c;
  justify-content: center;
}

.login-page .block {
  margin-top: 10%;
}

.login-page .auth-form {
  display: flex;
  flex-direction: column;
}

.login-page label {
  color: white;
}

.login-page input[type="text"],
.login-page input[type="password"] {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.login-page button {
  padding: 10px;
  border: none;
  border-radius: 3px;
  background-color: #ffd300;
  color: black;
  cursor: pointer;
}

.login-page button:hover {
  background-color: #bd9e00;
}

.container {
  margin: 0 auto;
  height: 84vh;
  margin-bottom: 100px;
  padding: 20px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #45474c;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: white;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  color: white;
}

input[type="text"],
input[type="password"] {
  padding: 8px;
  margin-bottom: 10px;
  /*margin-right: 20px;*/
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  font-family:  'Montserrat Alternates', sans-serif;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 3px;
  background-color: #ffd300;
  color: black;
  cursor: pointer;
}

button:hover {
  background-color: #bd9e00;
}
</style>
