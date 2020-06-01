<template>
  <div class="profilePage">
    <v-app-bar flat app>
      <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Tech Wizard</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text v-if="!user" :to="{ name: 'SignupStudent' }">
        <span class="font-weight-regular">Sign Up</span>
      </v-btn>
      <v-btn text v-if="!user" :to="{ name: 'Login' }">
        <span class="font-weight-regular">Login</span>
      </v-btn>
      <v-btn text v-if="user">
        <a>{{ user.email }}</a>
      </v-btn>
      <v-btn text v-if="user">
        <a @click="logout">Logout</a>
      </v-btn>
    </v-app-bar>
    <v-card flat class="navDrawer">
      <v-navigation-drawer permanent expand-on-hover app>
        <v-list>
          <v-list-item class="px-2">
            <v-list-item-avatar>
              <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="title">Sandra Adams</v-list-item-title>
              <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav dense>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-android-messages</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Messages</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-bell-ring</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Notifications</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-heart</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Favourites</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-cog-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <div class="profileContent">
        <v-container class="mx-5">
          <v-row>
            <v-col xs12 sm6 md4 lg3>
              <v-card text class="text-center ma-3">
                <v-card-text>
                  <div class="subheading">{{ profile.firstName }}</div>
                  <div class="grey--text">{{ profile.lastName }}</div>
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="grey">
                    <v-icon small left>mdi-message</v-icon>
                    <span>Message</span>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card>
  </div>
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
        { text: "View Jobs", route: "/projects" },
        { text: "View Employers", route: "/team" },
        { text: "View Candidates", route: "/team" }
      ],
      profile: [
        {
          firstName: "Sandra",
          lastName: "Web developer",
          
        }
      ]
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
.v-content__wrap {
  margin-left: -16px;
}
</style>



