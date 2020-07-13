<template>
  <div>
    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>Awesome! You added a new job.</span>
      <v-btn text color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-container class="my-5">
      <div class="text-left">
        <AddJobPopup @jobHasBeenAdded="snackbar = true" />
      </div>
      <v-card v-for="job in employerJobs" :key="job.jobTitle" class="my-4 mx-2" color="#2F4858">
        <v-row row wrap :class="`py-3 px-6 job ${job.status}`">
          <v-col cols="12" md="6" lg="6">
            <div class="caption grey--text font-weight-bold text-uppercase">Job Title</div>
            <div class="white--text">{{ job.jobTitle }}</div>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text font-weight-bold text-uppercase">Company Name</div>
            <div class="white--text">{{ job.companyName }}</div>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text font-weight-bold text-uppercase">Closing Date</div>
            <div class="white--text">{{ job.due }}</div>
          </v-col>
          <v-col xs="2">
            <div>
              <!--v-btn color="blue" dark :class="`${job.status} caption my-2`">{{job.status}}</v-btn-->
              <JobInfoPopup :job="job" />
            </div>
          </v-col>
          <v-col xs="2">
            <div>
              <v-btn class="mx-2 my-1" fab dark small color="orange">
                <v-icon dark>mdi-pencil</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import JobInfoPopup from "@/pages/jobs/JobInfoPopup.vue";
import AddJobPopup from "@/pages/employer-profile/AddJobPopup.vue";

export default {
  components: {
    AddJobPopup,
    JobInfoPopup
  },
  data() {
    return {
      jobs: [], //Stores all jobs from the database
      employerJobRefs: null, //Stores the employer user's job reference IDs
      employerJobs: [], //Stores the jobs of the employer user
      snackbar: false
    };
  },
  methods: {
    /**
     * Find Jobs: Iterates over all jobs and finds the jobs which match the employers jobs reference IDs
     */
    findJobs() {
      this.employerJobs = [];
      console.log("findJobs: ");
      console.log(this.jobs)
      console.log(this.employerJobRefs)
      console.log(this.jobs.length)
      this.jobs.forEach(job => {
        console.log('1');
        this.employerJobRefs.forEach(ref => {
          console.log(ref);
          if (job.id == ref) this.employerJobs.push(job);
        });
      });
    },
    editJobs() {}
  },
  watch: {
    jobs: function(){
      this.findJobs()
    }
  },
  created() {
    let employerUsersDB = db.collection("employerUsers"); 
    //let allJobsDB = db.collection("jobs");.

    // get current user
    employerUsersDB
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          (this.employerUser = doc.data()), (this.employerUser.id = doc.id); // get employer user data and store it locally
          
          // If the employer user has no jobs created yet, set the corresponding array to an empty array
          if (!this.employerUser.jobs) {
            console.log("There are no jobs listed yet");
            this.employerJobRefs = [];
          } else {
            // If the employer has created jobs before, store the references of these jobs in the corresponding array
            this.employerJobRefs = this.employerUser.jobs;
          }
        });
      })
      .then(() => {
        // Set listener on database collection which stores all jobs. Listener fires on any change of the collection in the database
        db.collection("jobs").onSnapshot(res => {
          const changes = res.docChanges(); // Get all changes of documents in the collection
          changes.forEach(change => {       // Iterate over changes
            if (change.type === "added") {  // If documents has been added to collection
              this.jobs.push({              // Add added document to the locally stored jobs array
                ...change.doc.data(),
                id: change.doc.id
              });
            }
          });
          //this.findJobs();
        });

        // Set listener on document of the employer user in the database. Listener fires if employer user document changes
        db.collection("employerUsers")
          .doc(this.employerUser.username)
          .onSnapshot(res => {
            this.employerJobRefs = res.data().jobs; // Update local array of employer's job reference IDs
            this.findJobs(); // Execute findJobs method to populate the employerJobs array with the jobs that match the updated employer job reference IDs and therefore to display these jobs.
          });
      })
      /*.then(() => {
        this.findJobs();
      });*/
  }
};
</script>

<style>
.v-main__wrap {
  background-color: #3e5769;
}
</style>

