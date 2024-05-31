<template>

  <router-view/>
</template>

<script>
// export default {
  // data() {
  //   return {
  //     userName: '',
  //   };
  // },
  // mounted() {
  //   this.getName();
  // },
  // methods: {
  //   async getName() {
  //     try {
  //       const response = await this.$store.dispatch('mAuth/authenticate');
  //       this.userName = response.name;
  //     } catch (error) {
  //       console.error('Ошибка Авторизации', error);
  //     }
  //   }
  // }
// }
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@100;200;300;400;500;600;700;800;900&display=swap');

#app {
  font-family: 'Montserrat Alternates', sans-serif; /*Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  background-color: #ffd300;
}

.button {
  font-family:  'Montserrat Alternates', sans-serif;
}



nav {
  
}

nav a {
  font-weight: bold;
}

nav a {
  color: black;
}
</style>
