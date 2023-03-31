import Vue from 'vue'
import VueRouter from 'vue-router'
import DocsView from '../views/Documentation/DocsView.vue'
import CMSView from '../views/CMS/CMSView.vue'
import SectionView from '../views/Documentation/SectionView.vue'
import SectionList from '../views/CMS/SectionList.vue'
import ChapterList from '../views/CMS/ChapterList.vue'
import Metadata from '../views/CMS/MetadataInfo.vue'
import SectionEditor from '../views/CMS/SectionEditor.vue'
import Versioning from '../views/CMS/VersioningEditor.vue'
import Login from '../views/Auth/LoginView.vue'
import Register from '../views/Auth/RegisterView.vue'
import ProfileInfo from '../views/CMS/ProfileInfo.vue'
import AuthService from '@/services/AuthService'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'docs',
    component: DocsView,
    children: [
      {
        path: 'docs/:id',
        name: 'section',
        component: SectionView,
        props: true
      }
    ]
  },
  {
    path: '/cms',
    name: 'cms',
    component: CMSView,
    children: [
      {
        path: 'section',
        name: 'sectionList',
        component: SectionList,
        props : true
      },
      {
        path: 'section/:id',
        name: 'sectionEditor',
        component: SectionEditor
      },
      {
        path: 'chapter',
        name : 'chapterList',
        component: ChapterList
      },
      {
        path: 'metadata',
        name: 'metadata',
        component: Metadata
      },
      {
        path: 'version',
        name: 'version',
        component: Versioning
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfileInfo
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    props : true
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    props : true
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if(to.path.includes("cms")){
    if(localStorage.token){
      try {
        await AuthService.refreshToken();
        next()
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        next({
          name: "login",
          replace: true,
          params : {
            message : "Your login session is expired",
            status : true,
            msgtype : 'error'
          }
        })
      }
    }
    else{
      next({
        name: "login",
        replace: true
      })
    }
  }
  next()
})

export default router
