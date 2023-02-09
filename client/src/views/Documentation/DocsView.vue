<template>
  <v-app>
    <!-- Header Starts Here -->
    <v-app-bar app dark class="portal-navbar">
        <v-app-bar-nav-icon 
            @click.stop="drawer = !drawer" 
            v-show="this.$vuetify.breakpoint.mobile"
        ></v-app-bar-nav-icon>
        
        <v-toolbar-title
            class="d-flex justify-center align-center"
        >
            <img :src="metadata.logo" style="max-height: 25px;" class="mr-2">
            <span class="mr-2" v-show="metadata.title">{{metadata.title}}</span>
            <v-select 
                v-model="choosenVersion"
                :items="versions"
                @change="getVersion()"
                outlined
                dense
                rounded
                class="ml-auto"
                style="width: 120px; height: 40px; font-size: 12px; background-color: #23273b; border: 1 px solid black;"
            ></v-select>
        </v-toolbar-title>
        
        
        <div class="ml-auto mr-2 d-flex justify-center align-center">
            <v-text-field
                outlined
                placeholder="Search section..."
                append-icon="mdi-magnify"
                style="padding-top: 25px;"
                class="mr-4"
                dense
                readonly
            ></v-text-field>
            <v-btn
                :href="metadata.githubLink"
                target="_blank"
                icon
            ><v-icon>mdi-github</v-icon></v-btn>
        </div>
    </v-app-bar> 
    <!-- Header Stop Here -->

    <!-- Sidebar Starts Here -->
    <v-navigation-drawer fixed dark class="fontstyle px-0 py-0" v-model="drawer" style="margin-top: 64px; background-color: #16192d;">
        <v-container v-for="(chapter,i) in chapters" :key="i">
            <v-card-title class="chapter-title font-weight-bold" style="white-space: pre-wrap; word-wrap: break-word;" v-text="chapter.title"></v-card-title>
            <v-list flat>
                <v-list-item-group class="text-left" style="margin-left: 20px;">
                    <v-list-item  dense class="section font-weight-thin" v-for="(section,j) in chapter.section" :key="j" :to="{name : 'section', params: { id : section._id}}">
                        <v-list-item-content>
                            <v-list-item-title class="section-title" v-text="section.title" ></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-container>
    </v-navigation-drawer>
    <!-- Sidebar Stop Here -->
    <v-main class="portal-main" style="padding-top: 16px; margin-left: 270px;">
        <v-container>
            <router-view :key="$route.path"></router-view>
        </v-container>
    </v-main>
    <!-- Footer Starts Here -->
    <v-footer
        v-html="metadata.footer"
        class="portal-footer text-center d-flex justify-center align-center "
        dark
    >
    </v-footer>
    <!-- Footer Stops Here -->
    </v-app>
</template>

<script>
import router from '@/router' 

export default {
    data(){
        return {
            chapters : [],
            versions: [],
            arr : [],
            choosenVersion: '',
            metadata : {
                title : "",
                logo : "",
                githubLink : "",
                footer : ""
            },
            drawer: true
        }
    },
    methods : {
        getVersion(){
            this.axios.get(`${this.$apiuri}/documentations/${this.choosenVersion}`).then(response => {
                this.chapters = response.data[0].content[0].chapter
                router.push(`/docs/${this.chapters[0].section[0]._id}`)
            }).catch(message => {
                console.log(message)
            })
        }
    },
    created(){
        // let temp = JSON.parse(JSON.stringify(this.versions))
        this.axios.get(`${this.$apiuri}/documentations/version`)
            .then((response) => {
                response.data[0].content.forEach(v => {
                    this.versions.push(v.version)
                });
                this.choosenVersion = this.versions[0]
                this.getVersion()
            })
        this.axios.get(`${this.$apiuri}/documentations/metadata`)
            .then(response => {
                this.metadata = response.data
            })
    }
}
</script>

<style>
    .portal-navbar {
        z-index: 99 !important;
        box-shadow: none !important;
        background-color: #16192d !important;
        background: rgba(22, 25, 45, 0.46) !important;
        border-radius: 16px !important;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
        backdrop-filter: blur(10.5px) !important;
        -webkit-backdrop-filter: blur(10.5px) !important;
        border: 1px solid rgba(22, 25, 45, 0.3) !important;
        border-bottom: 1px solid #282d4b !important;
    }

    .portal-main {
        background: #212542;
        background: -moz-radial-gradient(top right, ellipse cover, #272c52 0%, #16192d 57%);
        background: -webkit-gradient(radial, top right, 0px, top right, 100%, color-stop(0%,#272c52), color-stop(57%,#16192d));
        background: -webkit-radial-gradient(top right, ellipse cover, #272c52 0%,#16192d 57%);
        background: -o-radial-gradient(top right, ellipse cover, #272c52 0%,#16192d 57%);
        background: -ms-radial-gradient(top right, ellipse cover, #272c52 0%,#16192d 57%);
        background: radial-gradient(ellipse at top right, #272c52 0%,#16192d 57%);
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#272c52', endColorstr='#16192d',GradientType=1 );
    }

    .portal-footer {
        background: #212542 !important;
        margin-left: 256px !important; 
        padding-top: 16px !important; 
        background-color: #16192d !important; 
        border-top: 1px solid #282d4b !important; 
        color: #94a3b8 !important;
    }

    .chapter-title {
        color: white;
        font-size: 16px;
        padding: 10px;
    }

    .section {
        border-left: 2px solid rgb(43, 55, 70);
    }

    .section:not(.v-item--active ):hover {
        border-left: 2px solid white;
    }

    .v-item--active {
        border-left: 2px solid rgb(41, 210, 253);
    }

    .v-item--active .section-title {
        color: rgb(41, 210, 253);
    }

    .section-title {
        color: #727f90;
    }
</style>