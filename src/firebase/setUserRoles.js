/* eslint-disable @typescript-eslint/no-var-requires */

const admin = require("firebase-admin");
const serviceAccount = require("../../../../mini-paint-edf3c-firebase-adminsdk-8du98-400793e8bc.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mini-paint-edf3c-default-rtdb.firebaseio.com",
});

const database = admin.database(app);
const auth = admin.auth(app);

auth.listUsers().then((userList) => {
  userList.users.forEach((user) => {
    const userProfileRef = database.ref(user.uid).child("profile");

    userProfileRef.once("value").then((snapshot) => {
      if (!snapshot.hasChild("role")) {
        userProfileRef.child("role").set("user");
      }
    });
  });
});
