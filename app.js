const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const Request = require("request");
var firebase = require("firebase");
var restify = require('restify');
//firebase.initializeApp(config);
var config = {
  apiKey: "AIzaSyBeCkanUegQwCzrNeUEm22cSJ3SNV2-IQI",
  authDomain: "raffle-160ed.firebaseapp.com",
  databaseURL: "https://raffle-160ed.firebaseio.com",
  projectId: "raffle-160ed",
  storageBucket: "raffle-160ed.appspot.com",
  messagingSenderId: "708155368287"
};
firebase.initializeApp(config);
let name = '';

//var server = express();
var server = restify.createServer();

// server.use(bodyParser.urlencoded({
//     extended: true
// }));

// server.use(bodyParser.json());

server.listen((process.env.PORT || 3978), function () {
  console.log("Server is up and running...");
});

server.post('/getwinner', function (req, res) {

 // let eventToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.EventName ? req.body.result.parameters.EventName : 'Sorry the event is not available could you repeat';
//call the avnu api to search for the event
debugger;
//write logic to get the players from the list
var sel_list = [];
var Winner = "";
var db_list = firebase.database().ref('users/');
db_list.once('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    var name = childData.FName + ' ' + childData.LName
    sel_list.push(name);
  });
}).then(function whenOk(response) {
  //console.log(response)
  if(sel_list){
    Winner = sel_list[Math.floor(Math.random()*sel_list.length)];
    
  }else{
    Winner = "Technical error"
  }
    
    var text = "The winner is " + Winner
    var ssmltext = "<speak><audio src=\"https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg\">your wave file</audio> Winner is " + Winner + "</speak>"
    let responses = {
      fulfillmentText: text,
      fulfillmentMessages: [
        {
          card: {
          title: 'card title',
          subtitle: text,
          imageUri: 'https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png',
          buttons: [
              {
                text: 'button text',
                postback: 'https://assistant.google.com/'
              }
            ]
          }
        }
      ],
      source: 'example.com',
      payload: {
        google: {
          expectUserResponse: true,
          richResponse: {
          items: [
              {
                simpleResponse: {
                  textToSpeech: text,
                  ssml:ssmltext
                }
              }
            ]
          }
        },
    
      },
    }
    
    console.log(text);
            // return res.json({
            //     speech: text,
            //     displayText: text,
            //     source: 'getevents'
            // });
    
    return res.json(responses);
    
      
})
.catch(function notOk(err) {
  console.error(err)
});
//console.log(sel_list);

});

