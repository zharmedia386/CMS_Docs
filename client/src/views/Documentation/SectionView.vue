<template>
  <v-container v-html="content">
    
  </v-container>
</template>

<script>
export default {
    data: () => ({
        id : null,
        content: ""
    }),
    beforeCreate(){
        // console.log(this.$route.params.id)
        this.axios.get(`${this.$apiuri}/sections/${this.$route.params.id}`)
            .then(response => {
                console.log(response.data)
                this.content = response.data[0].content
            })
    }
}
</script>

<style>

</style>