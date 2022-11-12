<template>
  <v-container v-html="content">
    
  </v-container>
</template>

<script>
export default {
    data: () => ({
        param : null,
        content: "<h1>Introduction</h1><p>hey this is a dummy data</p><h2>Next</h2><p>told ya this is a dummy data</p><pre class=\"ql-syntax\" spellcheck=\"false\">for dummy in dummies:\nprint(dummy)\n</pre><ul><li>That's</li><li>All</li><li>Bye</li></ul><p><br></p>"
    }),
    created(){
        this.param = this.$route.params
    }
}
</script>

<style>

</style>