import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

let app = null;

//wait for firebase auth to init before creating the app 
firebase.auth().onAuthStateChanged(() => {

  // init app if not already created
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app');
  }
})

  
