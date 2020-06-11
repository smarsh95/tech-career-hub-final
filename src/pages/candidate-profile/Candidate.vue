<template>
  <div class="view-profile">
    <v-row>
      <v-card flat class="navDrawer center my-10">
        <v-navigation-drawer permanent expand-on-hover dark color="blue-grey darken-2">
          <v-list nav>
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
      </v-card>
      <v-card v-if="profile" class="mx-auto my-5" min-width="400">
        <v-list-item-title class="headline my-8 mx-5">{{ profile.username }}'s Profile</v-list-item-title>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

export default {
  name: "Candidate",
  data() {
    return {
      candidateUser: null,
      drawer: false,
      links: [
        { text: "Explore Tech Careers", route: "/" },
        { text: "View Jobs", route: "/projects" },
        { text: "View Employers", route: "/team" },
        { text: "View Candidates", route: "/team" }
      ],
      profile: null
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
    let ref = db.collection("candidateUsers");

    // get current user
    ref
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          (this.candidateUser = doc.data()), (this.candidateUser.id = doc.id);
        });
      });

    //profile data
    ref
      .doc(this.$route.params.id)
      .get()
      .then(candidateUser => {
        this.profile = candidateUser.data();
      });
  }
};
</script>

<style>
.v-content__wrap {
  margin-left: -16px;
}
</style>



