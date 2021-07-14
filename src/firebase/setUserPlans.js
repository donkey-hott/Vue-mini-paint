/* eslint-disable @typescript-eslint/no-var-requires */

const admin = require("firebase-admin");
const serviceAccount = require("../../../../mini-paint-edf3c-firebase-adminsdk-8du98-400793e8bc.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mini-paint-edf3c-default-rtdb.firebaseio.com",
});

const database = admin.database(app);
const auth = admin.auth(app);

(async function () {
  const userList = await auth.listUsers();

  userList.users.forEach(async (user) => {
    const userPlanRef = database.ref(user.uid).child("profile").child("plan");
    const snapshot = await userPlanRef.once("value");
    const value = snapshot.val();

    if (!value || typeof value === "string") {
      userPlanRef.set({
        type: value,
        price: 0,
      });
    }
  });
})();
