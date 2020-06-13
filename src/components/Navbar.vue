<template>
  <nav>
    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>Awesome! You added a new job.</span>
      <v-btn text color="white" @click="snackbar = false" >Close</v-btn>
    </v-snackbar>

    <v-app-bar flat app>
      <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <router-link class="routerLink" :to="{name: 'Home'}">
          <span class="font-weight-light grey--text">Tech Wizard</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text v-if="!user" :to="{ name: 'SignupCandidate' }">
        <span class="font-weight-regular grey--text text--darken-2">Sign Up</span>
      </v-btn>
      <v-btn text v-if="!user" :to="{ name: 'Login' }">
        <span class="font-weight-regular grey--text text--darken-2">Login</span>
      </v-btn>
      <v-btn text v-if="user">
        <a>{{ user.email }}</a>
      </v-btn>
      <v-btn text v-if="user">
        <a @click="logout">Logout</a>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer temporary v-model="drawer" app color="primary">
      <v-row>
        <v-col class="mt-5">
          <v-list class="navDrawer">
            <v-list-item
              v-for="link in links"
              :key="link.text"
              router
              :to="link.route"
              class="ml-2"
            >
              <v-list-item-content class="white--text mt-0 ml-6 left display-2 font-weight-light">
                <v-list-item-title>{{ link.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Navbar",
  data() {
    return {
      user: null,
      drawer: false,
      links: [
        { text: "Explore Tech Careers", route: "/" },
        { text: "View Jobs", route: "/jobs" },
        { text: "View Employers", route: "/team" },
        { text: "View Candidates", route: "/team" }
      ], 
      snackbar: false
    };
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "Login" });
        });
    }
  },
  created() {
    //let user = firebase.auth().currentUser
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  }
};
</script>



<style>
.navDrawer {
  padding: 0px 0 !important;
}

.routerLink{
  text-decoration: none;
}
</style>



