<template>
  <v-app>
    <v-navigation-drawer>
        <router-link to="/cms">Hello</router-link>
    </v-navigation-drawer>
    <v-main>
        <v-container>
            <router-view></router-view>
        </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {

}
</script>

<style>

</style>