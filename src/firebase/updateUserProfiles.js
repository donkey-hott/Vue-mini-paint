/* eslint-disable @typescript-eslint/no-var-requires */

const admin = require("firebase-admin");
const serviceAccount = require("../../../../mini-paint-edf3c-firebase-adminsdk-8du98-400793e8bc.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mini-paint-edf3c-default-rtdb.firebaseio.com",
});

const database = admin.database(app);
const auth = admin.auth(app);

auth.listUsers(100).then((listUserResult) => {
  listUserResult.users.forEach((user) => {
    const userRef = database.ref(user.uid);

    userRef.once("value").then((snapshot) => {
      const hasProfile = snapshot.hasChild("profile");
      if (!hasProfile) {
        createProfile(user);
      }
    });
  });
});

function createProfile(user) {
  const { email, uid } = user;
  const userRef = database.ref(uid);
  /* we pass only "email" because
    Firebase doesn't support empty values */
  const profileData = { email };

  userRef.child("profile").set(profileData);
}
