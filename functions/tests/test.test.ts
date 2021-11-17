import * as firebase from "@firebase/rules-unit-testing"
import 'mocha'

const PROJECT_ID = 'cloudfunctions-a783f';


const userAuth = { uid: 'test-user-id', displayName: 'Test User' };

const getFireStore = (authUser: any) =>
    firebase.initializeTestApp({ projectId: PROJECT_ID, auth: authUser }).firestore();



const getAdminFirestore = () =>
    firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore();


describe('Firestore security rules', () => {
    beforeEach(async () => {
        await firebase.clearFirestoreData({ projectId: PROJECT_ID });
    })


    // can user read/write to collection
    it('can read from the collection', async () => {
        // add auth user to firestore
        const db = getFireStore(userAuth);

        // add data to firestore
        const testDoc = db.collection('test').doc('test');
        await testDoc.set({ test: 'test' });
        await firebase.assertSucceeds(testDoc.get());

    });

    it('can read own messages', async () => {

        // init with user
        const db = getFireStore(userAuth);
        // admin init
        const admin = getAdminFirestore();

        const doc = admin.collection('message').doc('test');
        await doc.set({ uid: userAuth.uid, message: 'test' });

        const testDoc = db.collection('message').doc('test');
        await firebase.assertSucceeds(testDoc.get());

    })

})



