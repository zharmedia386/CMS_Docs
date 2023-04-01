import Vue from 'vue';
import VueRouter from 'vue-router';
import AuthService from '@/services/AuthService';

const portalChildRoutes = (prefix) => [
  {
    path: 'docs/:id',
    name: prefix + '.section',
    component: () => import('@/views/Documentation/SectionView.vue'),
    props: true
  }
];

const cmsChildRoutes = (prefix) => [
  {
    path: 'section',
    name: prefix + '.section',
    component: () => import('@/views/CMS/SectionList.vue'),
    props : true
  },
  {
    path: 'section/:id',
    name: prefix + '.section-editor',
    component: () => import('@/views/CMS/SectionEditor.vue')
  },
  {
    path: 'chapter',
    name : prefix + '.chapter',
    component: () => import('@/views/CMS/ChapterList.vue')
  },
  {
    path: 'metadata',
    name: prefix + '.metadata',
    component: () => import('@/views/CMS/MetadataInfo.vue')
  },
  {
    path: 'version',
    name: prefix + '.version',
    component: () => import('@/views/CMS/VersioningEditor.vue')
  },
  {
    path: 'profile',
    name: prefix + '.profile',
    component: () => import('@/views/CMS/ProfileInfo.vue')
  }
];

const routes = [
  {
    path: '/',
    name: 'docs',
    component: () => import('@/views/Documentation/DocsView.vue'),
    children: portalChildRoutes('portal')
  },
  {
    path: '/cms',
    name: 'cms',
    component: () => import('@/views/CMS/CMSView.vue'),
    children: cmsChildRoutes('cms')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Auth/LoginView.vue'),
    props : true
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Auth/RegisterView.vue'),
    props : true
  },
  {
    path: '*',
    component: () => import('@/views/Error/NotFoundView.vue')
  }
];

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

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
});

export default router;
