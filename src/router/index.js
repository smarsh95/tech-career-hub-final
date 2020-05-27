import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/home/Home.vue'
import Login from '@/pages/auth/Login.vue'
import StudentProfile from '@/pages/student-profile/StudentProfile.vue'
import StudentSignUpForm from '@/pages/student-profile/StudentSignUpForm.vue'
import SignupCandidate from '@/pages/auth/SignupCandidate.vue'
import firebase from 'firebase'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/about/About.vue')
  }, 
  {
    path: '/Login', 
    name: 'Login', 
    component: Login
  }, 
  {
    path: '/StudentProfile', 
    name: 'StudentProfile', 
    component: StudentProfile
  }, 
  {
    path: '/StudentSignUpForm', 
    name: 'StudentSignUpForm', 
    component: StudentSignUpForm
  }, 
  {
    path: '/SignupCandidate', 
    name: 'SignupCandidate', 
    component: SignupCandidate
  }


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  // check to see if route requires auth
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    // check auth state of user 
    let user = firebase.auth().currentUser
    if(user){
      // user signed in, proceed to route
      next()
    } else {
      // no user signed in, redirect to login 
      next({ name: 'Login' })
    }
  } else {
    next()
  }
})

export default router
