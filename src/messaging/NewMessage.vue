<!--template>
    <div class="new-message">
        <v-form @submit.prevent="addMessage">

            <v-text-field v-model="message">
                <label for="new-message">New Message (enter to add):</label>
            </v-text-field>
            <p class="red-text" v-if="feedback">{{ feedback }}</p>
        </v-form>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
export default {
    name: 'NewMessage', 
    props: ['name'],
    data() {
        return {
            newMessage: null,
            feedback: null,  

        }
    }, 
    methods: { 
        addMessage(){
            if(this.newMessage){
                db.collection('messages').add({
                    content: this.newMessage, 
                    name: this.name, 
                    timestamp: Date.now()
                }).catch(err => {
                    console.log(err)
                }) 
                this.newMessage = null
                this.feedback = null
            }else {
                this.feedback = "You must enter a message in order to send one"
            }
        }
    }
}
</script-->