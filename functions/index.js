const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.checkAlias = functions.https.onCall((data, context) => {

    const ref = admin.firestore().collection('users').doc(data.slug); 
    return ref.get().then(doc => {
        return { unique: !doc.exists }
    }).catch(err => {
        throw new functions.https.HttpsError('failed to connect');
    });
});

//adding user based authentication
exports.AddUserRole = functions.auth.user().onCreate(async (authUser) => {

  if (authUser.email) {
    const customClaims = {
      customer: true,
    };
    try {
      var _ = await admin.auth().setCustomUserClaims(authUser.uid, customClaims)

      return db.collection("roles").doc(authUser.uid).set({
        email: authUser.email,
        role: customClaims
      })

    } catch (error) {
      console.log(error)
    }

  }

});
