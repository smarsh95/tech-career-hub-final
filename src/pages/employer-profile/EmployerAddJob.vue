<template>
  <div>
    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>Awesome! You added a new job.</span>
      <v-btn text color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <AddJobPopup @jobHasBeenAdded = "snackbar = true"/>
  </div>
</template>

<script>
import AddJobPopup from "@/pages/employer-profile/AddJobPopup.vue";
export default {
  components: {
    AddJobPopup
  },
  data() {
    return {
      snackbar: false
    }
  }
};
</script>

<style>
.v-main__wrap {
  background-color: #3e5769;
}

</style>

