// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');

// Custom imports
import { config } from './config/config-local';
import { ADMINID } from './config/config';
import { initialStateToAccount } from './mapper';

// Headless browser for values
const puppeteer = require('puppeteer');
admin.initializeApp();

// Take the name parameter and grabs the html from stats
exports.addRanks = functions.https.onRequest(async (req: any, res: any) => {
    // Grab the name parameter.
    const username = req.query.name;
    // Get the browser request
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${config.base_url}${config.base_path}${username}/${config.base_appendix}`);
    // await page.goto(`${config.test_url}`); // for testing
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
    const upsert = await admin.firestore().collection('accounts').doc(account.id).set(account);
    console.log(upsert);
    // Send back a message with json found
    res.json({
      account: account
    });
});

exports.updateRanks = functions.https.onCall(async (data: any, context: any) => {
  const allowed = context.auth.token.isCow || false;
  if (allowed) {
    // Grab the name parameter.
    const username = data.name;
    // Get the browser request
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${config.base_url}${config.base_path}${username}/${config.base_appendix}`);
    // await page.goto(`${config.test_url}`); // for testing
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
    const upsert = await admin.firestore().collection('accounts').doc(account.id).set(account);
    console.log(upsert);
    return {
      account: account
    };
  } else {
    return { error: 'Not allowed'};
  }
});

exports.turnToCow = functions.https.onRequest(async (req: any, res: any) => {
  const tokenId = req.get('Authorization').split('Bearer ')[1];
  const uid = req.query.id;
  return admin.auth().verifyIdToken(tokenId)
    .then((decoded: any) => {
      if (decoded.uid === ADMINID) {
        admin.auth().setCustomUserClaims(uid, { isCow: true }).then(() => {
          // The new custom claims will propagate to the user's ID token the
          // next time a new one is issued.
        });
      }
      return res.status(200).send('Success');
    })
    .catch((err: any) => res.status(401).send(err));
});