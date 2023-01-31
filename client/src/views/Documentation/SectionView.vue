<template>
  <v-container class="content ql-editor" v-html="content">
    
  </v-container>
</template>

<script>
export default {
    data: () => ({
        id : null,
        title : "",
        content: ""
    }),
    created(){
        this.axios.get(`${this.$apiuri}/sections/${this.$route.params.id}`)
            .then(response => {
                this.content = response.data[0].content
                this.axios.get(`${this.$apiuri}/documentations/metadata`)
                    .then(res => {
                        document.title = response.data[0].title + " - " + res.data.title
                    })
            })
        
    }
}
</script>

<style>
.content{
    text-align: left;
}

.content > pre{
    padding: 10px 15px 10px 15px;
    background-color: rgba(0, 0, 0, 0.875);
    border-radius: 25px;
    color: yellowgreen;
    font-family: "Consolas";
    font-size: 13px;
    white-space: pre-wrap;  
}

</style>