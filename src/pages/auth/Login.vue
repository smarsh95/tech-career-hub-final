<template>
  <div class="login">
    <v-container class="mx-auto mt-6">
      <v-row justify="center">
        <v-col xs="12" sm="8" md="8" lg="6" class="text-center">
          <v-card class="pa-4">
            <v-card-title class="headline blue-grey--text justify-center">Login</v-card-title>
            <v-form class="px-6 py-3">
              <v-text-field label="Email:" v-model="email" type="email" name="email"></v-text-field>
              <v-text-field label="Password:" v-model="password" type="password" name="password"></v-text-field>
              <p v-if="feedback" class="orange--text text--darken-2 text-center">{{ feedback }}</p>
              <div class="my-4">
                <v-btn class="block rounded blue-grey lighten-1 white--text" @click="login">Login</v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      feedback: null
    };
  },
  created() {
        firebase.auth().onAuthStateChanged(userAuth => {
            if (userAuth) {
                firebase
                    .auth()
                    .currentUser.getIdTokenResult()
                    .then(tokenResult => {
                        console.log(tokenResult.claims.candidate);
                    });
            }
        });
    },
  methods: {
    login() {
      if (this.email && this.password) {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            console.log(cred.user);
            this.$router.push({ name: "Home" });
          })
          .catch(err => {
            this.feedback = err.message;
          });
        this.feedback = null;
      } else {
        this.feedback = "Please fill in both fields";
      }
    },
  }
};
</script>

<style>
.v-main__wrap {
  background-color: #3e5769;
}

</style>
