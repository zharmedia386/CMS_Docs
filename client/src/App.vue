<template>
  <div id="app">
    <v-app>
      <SnackBar ref="SnackBar" />
      <router-view/>
    </v-app>
  </div>
</template>

<script>
import SnackBar from './components/SnackBar.vue';

export default {

  name: 'App',
  components: {
    SnackBar
  },
  mounted() {
    // Register SnackBar to root so that it can use anywhere in child components
    this.$root.SnackBar = this.$refs.SnackBar;
  }

}
</script>


<style lang="scss">
@import './assets/css/style.css';


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
<<<<<<< HEAD
  background: linear-gradient(116deg, #181C32, #181C32,#181C32, #00E0FF, #FF00DA);
}

#navigation-icon {
  padding: 10px 10px 20px;
  margin-right: 10px;
  cursor: pointer;

  i {
    font-size: 2rem;
  }
=======
  background-color: var(--primary-dark);
>>>>>>> 025f18e943d174b48e3fe0c7fddc60f7d0dc72f1
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
