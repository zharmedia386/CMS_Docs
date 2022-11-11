<template>
  <v-container>
    {{ param }}
  </v-container>
</template>

<script>
export default {
    data: () => ({
        param : null
    }),
    mounted(){
        this.param = this.$route.params
    }
}
</script>

<style>

</style>