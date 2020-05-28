import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/home/Home.vue'
import Login from '@/pages/auth/Login.vue'
import Student from '@/pages/student-profile/Student.vue'
import StudentSignUpForm from '@/pages/student-profile/StudentSignUpForm.vue'
import Signup from '@/pages/auth/Signup.vue'
import Employer from '@/pages/employer-profile/Employer.vue'
import firebase from 'firebase'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
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
      path: '/Student',
      name: 'Student',
      component: Student,
      meta: {
        auth: true
      }
    },
    {
      path: '/StudentSignUpForm',
      name: 'StudentSignUpForm',
      component: StudentSignUpForm
    },
    {
      path: '/Signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/Employer',
      name: 'Employer',
      component: Employer,
      meta: {
        auth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // check to see if route requires auth
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    // check auth state of user 
    let user = firebase.auth().currentUser
    if (user) {
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
