<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="mt-4 mb-2"
          color="blue"
          dark
          v-bind="attrs"
          v-on="on"
          @click="loadCareerData"
        >More Info</v-btn>
      </template>
      <v-card v-for="careerPath in careerPaths" :key="careerPath.name">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Career Path Info</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-title>{{ careerPath.name }}</v-card-title>
        <v-card-text>{{ careerPath.longDescription }}</v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import db from "@/firebase/init";

export default {
  data() {
    return {
      careerPaths: [],
      model: null,
      dense: false,
      dialog: false
    };
  },
  props: {
    careerPath: Object
  },
  methods: {
    loadCareerData() {
      //fetch data from firestore
      db.collection("careerPaths")
        .where("name", "==", this.careerPath.name)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            console.log(doc.data());
            let careerPath = doc.data();
            careerPath.id = doc.id;
            this.careerPaths.push(careerPath);
          });
        });
    }
  }
};
</script>