<template>
  <v-container class="content" v-html="content">
    
  </v-container>
</template>

<script>
import { store } from '../../store'

export default {
    data: () => ({
        id : null,
        content: ""
    }),
    beforeCreate(){
        // console.log(this.$route.params.id)
        const token = store.getters.getTokens
        this.axios.get(`${this.$apiuri}/sections/${this.$route.params.id}`,
        {
            headers: {
                "Authorization": 'Bearer ' + token,
                "x-access-token": token ,
                "Content-type": "application/json"
            },
        }
        )
            .then(response => {
                console.log(response.data)
                this.content = response.data[0].content
            })
    }
}
</script>

<style>
.content{
    text-align: left;
}

.content > pre{
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.875);
    color: white;
}

.content > ol{
    
}

</style>