<template>
  <div class="view-profile">
    <v-row>
      <v-card v-if="profile" class="mx-auto my-5" min-width="400">
        <v-list-item-title class="headline my-8 mx-5" justify="center">{{ profile.username }}'s Profile</v-list-item-title>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

export default {
  name: "CandidateProfile",
  data() {
    return {
      candidateUser: null,
      profile: null
    };
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



