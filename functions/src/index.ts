// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');

// Custom imports
import { config } from './config/config-local';
import { initialStateToAccount } from './mapper';

// Headless browser for values
const puppeteer = require('puppeteer');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Cloud Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req: any, res: any) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('messages').add({original: original});
    // Send back a message that we've succesfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.`});
  });

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
.onCreate((snap: any, context: any) => {
  // Grab the current value of what was written to Cloud Firestore.
  const original = snap.data().original;

  // Access the parameter `{documentId}` with `context.params`
  functions.logger.log('Uppercasing', context.params.documentId, original);
  
  const uppercase = original.toUpperCase();
  
  // You must return a Promise when performing asynchronous tasks inside a Functions such as
  // writing to Cloud Firestore.
  // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
  return snap.ref.set({uppercase}, {merge: true});
});
// Take the name parameter and grabs the html from stats
exports.addRanks = functions.https.onRequest(async (req: any, res: any) => {
    // Grab the name parameter.
    // const username = req.query.name;
    // Get the browser request
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // await page.goto(`${config.base_url}${config.base_path}${username}/${config.base_appendix}`);
    await page.goto(`${config.test_url}`);
    console.log(`Went to ${config.test_url}`);
    // wait for window to have user object context
    const watchDog = page.waitForFunction('window.__INITIAL_STATE__ != undefined');
    await watchDog;
    // evaluate the user details
    let userDetails = await page.evaluate(() => {
        const w: any = window;
        return w.__INITIAL_STATE__;
    });
    // close down the browser
    await browser.close();
    // map details to schema
    const account = initialStateToAccount(userDetails);
    // Send back a message with json found
    res.json(account);
});