<template>
    <v-app>
        <div 
            v-if="loading" 
            class="d-flex justify-content-center align-items-center" 
            style="width: 100%; height: 100%;"
        >
            <v-container>
                <img src="@/assets/docmslogo.png" alt="logo" height="400" class="mb-16">
                <p class="linear-wipe">Loading your content...</p>
                <div class="animated-gradient progress-bar"></div>
            </v-container>
        </div>

        <div v-if="error">
            Error
        </div>

        <div v-if="documentation" class="mt-16">
            <!-- Header Starts Here -->
            <v-app-bar 
                class="portal-navbar"
                app 
                dark 
            >
                <v-app-bar-nav-icon 
                    @click.stop="drawer = !drawer"
                    v-show="this.$vuetify.breakpoint.mobile"
                ></v-app-bar-nav-icon>

                <v-toolbar-title class="d-flex justify-center align-center px-0">
                    <img 
                        class="logo mr-2"
                        v-if="!this.$vuetify.breakpoint.mobile" 
                        :src="documentation.logo" 
                    >
                    <v-select 
                        class="version-dropdown ml-auto"
                        v-model="selectedVersion" 
                        v-if="!this.$vuetify.breakpoint.mobile" 
                        :items="getVersions"
                        @change="changeVersion(getContentInVersion(selectedVersion))" 
                        outlined 
                        dense 
                        rounded
                    ></v-select>
                </v-toolbar-title>


                <div class="ml-auto mr-2 d-flex justify-center align-center">
                    <v-text-field 
                        @click="dialog = true"
                        v-if="!this.$vuetify.breakpoint.mobile" 
                        placeholder="Search section..."
                        append-icon="mdi-magnify" 
                        class="mr-4 pt-6" 
                        outlined 
                        dense 
                        readonly
                    ></v-text-field>
                    <v-btn 
                        @click="dialog = true"
                        v-else 
                        icon
                    >
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <v-btn 
                        :href="documentation.githubLink" 
                        target="_blank" 
                        icon
                    >
                        <v-icon>mdi-github</v-icon>
                    </v-btn>
                </div>
            </v-app-bar>
            <!-- Header Stop Here -->

            <!-- Sidebar Starts Here -->
            <v-navigation-drawer 
                class="side-bar fontstyle px-0 py-0" 
                v-model="drawer" 
                :permanent="$vuetify.breakpoint.mdAndUp"
                fixed 
                dark 
            >
                <div 
                    v-if="this.$vuetify.breakpoint.mobile"
                    class="d-flex justify-center align-center flex-column"
                >
                    <img 
                        v-if="this.$vuetify.breakpoint.mobile" 
                        class="mr-2" 
                        :src="documentation.logo" 
                        style="height: 100px;"
                    >
                    <v-select 
                        v-if="this.$vuetify.breakpoint.mobile"
                        v-model="selectedVersion" 
                        :items="getVersions"
                        @change="changeVersion(getContentInVersion(selectedVersion))" 
                        class="version-dropdown-mobile"
                        outlined 
                        dense 
                        rounded
                        >
                    </v-select>
                </div>
                <v-container v-for="(chapter, i) in getContentInVersion(selectedVersion)" :key="i">
                    <v-card-title class="chapter-title font-weight-bold" v-text="chapter.title"></v-card-title>
                    <v-list flat>
                        <v-list-item-group class="text-left ml-5">
                            <v-list-item dense class="section" v-for="(section, j) in chapter.section" :key="j"
                                :to="{ name: 'portal.section', params: { id: section._id } }">
                                <v-list-item-content>
                                    <v-list-item-title class="section-title" v-text="section.title"></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-container>
            </v-navigation-drawer>
            <!-- Sidebar Stop Here -->

            <v-main class="portal-main" :class="{ 'portal-main-mobile': this.$vuetify.breakpoint.mobile }">
                <v-container>
                    <router-view :key="$route.path" :title="documentation.title"></router-view>
                </v-container>
            </v-main>

            <!-- Footer Starts Here -->
            <v-footer v-html="documentation.footer" class="portal-footer text-center d-flex justify-center align-center "
                :class="{ 'portal-footer-mobile': this.$vuetify.breakpoint.mobile }" dark>
            </v-footer>
            <!-- Footer Stops Here -->
        </div>
        <v-dialog
            v-model="dialog"
            width="1000px"
        >
            <div>
                <div class="search-container-portal">
                    <v-icon color="#8B949E" class="mr-3">mdi-magnify</v-icon>
                    <input 
                        v-model="searchKeyword" 
                        class="search-portal-dialog"
                        placeholder="Search section..." type="text" 
                    >
                </div>
                <div class="search-content-container pa-3 mt-2 d-flex justify-center align-center">
                    <div class="search-result-found mt-2" v-if="filteredSection.length > 0">
                        <div 
                            class="search-result-list mb-2 pa-5" 
                            v-for="section in filteredSection" :key="section._id"
                            @click="redirect(section._id)"
                        >
                            <p class="text-left ma-0">{{ section.title }}</p>
                        </div>
                    </div>
                    <div v-else>No results found "{{ searchKeyword }}"</div>
                </div>
            </div>
        </v-dialog>
    </v-app>
</template>

<script>
import router from '@/router'
import { storeToRefs } from 'pinia';
import { useDocumentationStore } from '../../stores/DocumentationStore';

export default {
    data() {
        return {
            drawer: true,
            dialog: false,
            searchKeyword: ''
        }
    },
    setup() {
        // Use documentation store and fetch the data from db
        const documentationStore = useDocumentationStore()
        documentationStore.fetchData(true);

        // Extract the required data and getters as refs
        const {
            documentation, loading, error, selectedVersion,
            getVersions, getContentInVersion,
        } = storeToRefs(useDocumentationStore());

        // Return the data so it's can be used in template
        return {
            documentation, loading, error, selectedVersion,
            getVersions, getContentInVersion
        }
    },
    methods: {
        changeVersion(content) {
            // Load first section in first chapter of the selected version
            if (content && content[0]?.section) {
                router.push(`/docs/${content[0].section[0]._id}`)
            }
        },
        redirect(id){
            router.push(`/docs/${id}`)
            this.dialog = false
        }
    },
    computed: {
        sections() {
            const content = this.getContentInVersion(this.selectedVersion)
            return content.map(item => item?.section).flat()
        },
        filteredSection() {
            return this.sections.filter((item) => item.title.toLowerCase().includes(this.searchKeyword.toLowerCase()))
        }
    }
}
</script>

<style scoped>
.search-container-portal {
    display: flex;
    background-color: #2D3748; 
    color: white; 
    padding: 20px; 
    border-radius: 5px;
}

.search-portal-dialog:focus{
    outline: none !important;
    width: 100%; 
    height: 100%; 
    color: white;
}

.search-content-container {
    background-color: #2D3748; 
    min-height: 200px; 
    color: #8B949E; 
    border-radius: 5px;
}

.search-result-found{
    width: 100%;
}

.search-result-list {
    background-color: #242C3A; 
    cursor: pointer; 
    border-radius: 5px;
}

.linear-wipe {
    --bg-size: 400%;
    font-weight: bold;
    background: linear-gradient(90deg,
            var(--secondary-purple),
            var(--secondary-blue),
            var(--secondary-purple)) 0 0 / var(--bg-size) 100%;
    color: transparent;
    background-clip: text;
}

@media (prefers-reduced-motion: no-preference) {
    .linear-wipe {
        animation: move-bg 8s linear infinite;
    }

    @keyframes move-bg {
        to {
            background-position: var(--bg-size) 0;
        }
    }
}

.progress-bar {
    width: 100%;
    height: 20px;
}

.animated-gradient {
    background: repeating-linear-gradient(to right, var(--secondary-purple) 0%, var(--secondary-blue) 50%, var(--secondary-purple) 100%);
    width: 100%;
    background-size: 200% auto;
    background-position: 0 100%;
    animation: gradient 2s infinite;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
}

@keyframes gradient {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: -200% 0;
    }
}

/* App bar styling */
.portal-navbar {
    z-index: 99 !important;
    box-shadow: none !important;
    background-color: var(--primary-dark) !important;
    background: var(--primary-dark-transparant) !important;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
    backdrop-filter: blur(10.5px) !important;
    -webkit-backdrop-filter: blur(10.5px) !important;
    border: 1px solid rgba(22, 25, 45, 0.3) !important;
    border-bottom: 1px solid #282d4b !important;
}

.logo {
    max-height: 60px;
}

.version-dropdown {
    /* width: 120px;  */
    max-height: 45px;
    font-size: 11px;
    background-color: none;
    line-height: 1 !important;
    width: 120px;
}

.version-dropdown-mobile {
    /* width: 120px;  */
    max-height: 45px;
    font-size: 11px;
    background-color: none;
    line-height: 1 !important;
    margin: 0 20px;
}

/* Side bar styling */
.side-bar {
    margin-top: 64px;
    background-color: var(--primary-dark);
}

.chapter-title {
    color: var(--secondary-purple-darker);
    font-size: 16px;
    padding: 10px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.section {
    border-left: 2px solid rgb(43, 55, 70);
}

.section:not(.v-item--active):hover {
    border-left: 2px solid rgba(255, 255, 255, 0.521);
}

.v-item--active {
    border-left: 2px solid var(--secondary-purple-darker);
}

.v-item--active .section-title {
    color: var(--secondary-purple-darker);
}

.section-title {
    color: #727f90;
}

/* Main section styling */
.portal-main {
    margin-left: 270px;
    padding-top: 0 !important;

    /* background: #212542;
        background: -moz-radial-gradient(top right, ellipse cover, #272c52 0%, var(--primary-dark) 57%);
        background: -webkit-gradient(radial, top right, 0px, top right, 100%, color-stop(0%,#272c52), color-stop(57%,var(--primary-dark)));
        background: -webkit-radial-gradient(top right, ellipse cover, #272c52 0%,var(--primary-dark) 57%);
        background: -o-radial-gradient(top right, ellipse cover, #272c52 0%,var(--primary-dark) 57%);
        background: -ms-radial-gradient(top right, ellipse cover, #272c52 0%,var(--primary-dark) 57%);
        background: radial-gradient(ellipse at top right, #272c52 0%,var(--primary-dark) 57%); */
    background-image: url('@/assets/portalbg.png');
    background-size: 100% auto;
}

.portal-main-mobile {
    margin-left: 0;
    background-image: url('@/assets/portalbgmobile.png');
    background-size: 100% auto;
}

/* Footer Styling */
.portal-footer {
    background: #212542 !important;
    margin-left: 256px !important;
    padding-top: 16px !important;
    background-color: #16192d !important;
    border-top: 1px solid #282d4b !important;
    color: #94a3b8 !important;
}

.portal-footer-mobile {
    margin-left: 0 !important;
}
</style>