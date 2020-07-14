<!--template>
  <v-container class="chat">
    <h2>Message</h2>
    <v-card>
      <v-card-content class="messages" v-chat-scroll>
        <v-list v-for="message in messages" :key="message.id">
          <v-list-item class="grey--text">{{ message.name + " "}}</v-list-item>
          <v-list-item class="black--text">{{ message.content }}</v-list-item>
          <v-list-item class="black--text time">{{ message.timestamp}}</v-list-item>
        </v-list>
      </v-card-content>
    </v-card>
    <v-card-action>
      <NewMessage :name="name" />
    </v-card-action>
  </v-container>
</template>

<script>
import NewMessage from "@/components/chat/NewMessage";
import db from "@/firebase/init";
import moment from "moment";
import firebase from 'firebase';

export default {
  name: "Messaging",
  components: {
    NewMessage
  },
  data() {
    return {
      messages: [],
      name: "",
      userData: null,
      role: null
    };
  },
  methods: {
    getRole() {
      return new Promise(resolve => {
        firebase
          .auth()
          .currentUser.getIdTokenResult()
          .then(idTokenResult => {
            if (idTokenResult.claims.candidate) {
              resolve("candidate");
            } else if (idTokenResult.claims.employer) {
              resolve("employer");
            }
          });
      });
    }
  },
  created() {
    let ref = db.collection("messages").orderBy("timestamp");
    let userRef;

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == "added") {
          let doc = change.doc;
          this.messages.push({
            id: doc.id,
            name: doc.data().name,
            content: doc.data().content,
            timestamp: moment(doc.data().timestamp).format("lll")
          });
        }
      });
    });
    this.getRole()
      .then(role => {
        if (role == "candidate") {
          userRef = db.collection("candidateUsers"); // set ref variable for candidate user type
        } else if (role == "employer") {
          userRef = db.collection("employerUsers"); // set ref variable for employer user type
        }
        this.role = role;
      })
      .then(() => {
        //get current user data from database
        userRef
          .where("user_id", "==", firebase.auth().currentUser.uid)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              this.userData = doc.data();
            });
          });
      });
  }
};
</script>

<style>
.chat h2 {
  font-size: 2.6em;
  margin-bottom: 40px;
}
.chat span {
  font-size: 1.4em;
}
.chat .time {
  display: block;
  font-size: 0.8em;
}
.messages {
  max-height: 300px;
  overflow: auto;
}
.messages::-webkit-scrollbar {
  width: 3px;
}
.messages::-webkit-scrollbar-track {
  background: #ddd;
}
.messages::-webkit-scrollbar-thumb {
  background: #aaa;
}
