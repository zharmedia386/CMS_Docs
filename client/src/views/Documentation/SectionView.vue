<template>
  <v-container v-html="content">
    
  </v-container>
</template>

<script>
export default {
    data: () => ({
        param : null,
        content: "<h1>Introduction</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><h2>Next</h2><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p><pre class=\"ql-syntax\" spellcheck=\"false\">\nprint(dummy)\n</pre><ul><li>That's</li><li>All</li><li>Bye</li></ul><p><br></p>"
    }),
    created(){
        this.param = this.$route.params
    }
}
</script>

<style>
h1{
    text-align : left
}

p{
    text-align : left
}

h2{
    text-align : left
}

pre{
    text-align : left
}

li{
    text-align: left;
}

</style>