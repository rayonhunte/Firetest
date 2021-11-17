import * as firebase from '@firebase/rules-unit-testing';
import  'mocha';
// import { getEndpoints } from './firebase';

const app = firebase.initializeAdminApp({
    projectId: 'cloudfunctions-a783f'
})

const db = app.firestore();

before(async () => {
    await firebase.clearFirestoreData({
        projectId: 'cloudfunctions-a783f'
    });
})

describe('Firestore', () => {
    let applicationId: string

    it('Should', async () => {
        const edDocRef = await db.collection('alert-manager-endpoint').add({
            type: 'Grafana',
            endpoint: 'https://mygrafana.dashboard.io/xxxxx',
            correlationKey: '',
            templateName: '',
            apiKey: 'xxxxxxxxx',
            datasource: 'xxxxxx',
            username: 'xxxxx',
            password: 'xxxxx',
            height: '1234',
            width: '9999',
        });
        const destDocRef = await db.collection('destination').add({
            type: 'Slack',
            url: 'https://myslack.incomming.webhook.io/xxxxx',
            note: ''
        })

        const edptsDocRef = await db.collection('alert-manager-endpoints').add({
            name: 'my endpoint group',
            enspoints: [db.doc(`alert-manager-endpoint/${edDocRef.id}`)],
            destinations: [db.doc(`destination/${destDocRef.id}`)]
        })

        applicationId = edptsDocRef.id;

        await edptsDocRef.update({
            applicationId: applicationId
        });

        //const ret = await getEndpoints(applicationId, db);
        //expect(ret.id).to.equal(applicationId);
    });
});
