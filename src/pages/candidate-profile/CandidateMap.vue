<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col sm="12" md="8" lg="6">
        <h1 class="text-center my-3 mb-5" style="font-weight: 400;">Candidate Map</h1>
        <v-card-text class="mapText text-center grey--text text--darken-2">Click on Map Markers to View Candidate Profiles via Location</v-card-text>
        <v-card max-width="700px" height="400px" class="map text-center my-2">
          <div class="google-map" id="map"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

export default {
  name: "CandidateMap",
  data() {
    return {
      lat: 53,
      lng: -2
    };
  },
  methods: {
    renderMap() {
      const google = window.google;
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: this.lat, lng: this.lng },
        zoom: 6,
        maxZoom: 15,
        minZoom: 3,
        streetViewControl: false
      });

      db.collection("candidateUsers")
        .get()
        .then(candidateUsers => {
          candidateUsers.docs.forEach(doc => {
            let data = doc.data();
            if (data.geolocation) {
              let marker = new google.maps.Marker({
                position: {
                  lat: data.geolocation.lat,
                  lng: data.geolocation.lng
                },
                map
              });
              //add click event to marker
              marker.addListener("click", () => {
                this.$router.push({
                  name: "CandidateProfile",
                  params: { id: doc.id }
                });
              });
            }
          });
        });
    }
  },
  mounted() {
    //get current user
    let user = firebase.auth().currentUser;
    console.log(user);
    //get user geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.lat = pos.coords.latitude;
          this.lng = pos.coords.longitude;

          //find the user record and then update geocoords
          db.collection("candidateUsers")
            .where("user_id", "==", user.uid)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                db.collection("candidateUsers")
                  .doc(doc.id)
                  .update({
                    geolocation: {
                      lat: pos.coords.latitude,
                      lng: pos.coords.longitude
                    }
                  });
              });
            })
            .then(() => {
              this.renderMap();
            });
        },
        err => {
          console.log(err);
          this.renderMap();
        },
        { maximumAge: 999960000, timeout: 5000 }
      );
    } else {
      //position centre by default values
      this.renderMap();
    }
  }
};
</script>

<style>
.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: #fff;
  position: absolute;
  top: 0px;
  left: 0;
  z-index: 0;
}
.mapText {
  font-size: 18px;
}
</style>