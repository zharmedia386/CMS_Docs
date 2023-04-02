<template>
    <div class="not-found-container d-flex justify-center align-center" style="width: 100%; height: 100%;">
        <v-container>
            <img 
                src="@/assets/images/404.png" 
                alt="Not Found" 
                :class="{ 'not-found-mobile': this.$vuetify.breakpoint.mobile }"
            >
            <h1 
                class="white--text" 
                :class="{ 'not-found-h1': this.$vuetify.breakpoint.mobile }"
            >
                Oops! This Page is Not Found
            </h1>
            <h2
                :class="{ 'not-found-h2': this.$vuetify.breakpoint.mobile }"
            >
                We can’t find the page that you’re looking for
            </h2>
            <v-btn 
                class="animated-gradient white--text mt-7"
                @click="backToHomePage"
            >
                Back To Home
            </v-btn>
        </v-container>
    </div>
</template>

<script>
export default {
    methods: {
        backToHomePage(){
            this.$router.push({ name: 'docs' });
        }
    }
}
</script>

<style scoped>
img {
    width: 50%;
}

h2 {
    color: #AEAEAE;
    font-weight: normal;
}

.not-found-mobile {
    width: 80%;
}

.not-found-h1 {
    font-size: 1.5rem;
}
.not-found-h2 {
    font-size: 1rem;
}
</style>