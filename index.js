/* global Firebase */

var express = require('express');
var app = express();
var firebase = require('firebase');

var _subIds = [];

function init() {
    getFirebase().child('subscription_ids').on('value', function(snapshot) {
        _subIds = formatSubIdsFromSnapshot(snapshot.val());
        console.log('Sub Ids', _subIds);
    });
    
    // Listen for new questions, ignore initial batch by filtering out existing questions
    getFirebase().child('questions').orderByChild('time').startAt(Date.now()).on('child_added', function(snapshot) {
        console.log('Child added', snapshot.val());
        for (var i = 0; i < _subIds.length; i++) {
            notifySubscriber(_subIds[i], snapshot.val());
        }
    });
}

function notifySubscriber(subId, question) {
    console.log('Notifying subscriber: ' + subId, question);
    // TODO
}

function formatSubIdsFromSnapshot(obj) {
    var ids = [];
    for (var key in obj) {
        ids.push(key);
    }
    return ids;
}

function formatQuestionSnapshot(obj) {
        var questions = [];
        for (var key in obj) {
            var q = {
                key: key,
                name: obj[key].name,
                question: obj[key].question,
                computer_number: obj[key].computer_number,
                time: obj[key].time
            };
            questions.push(q);
        }
        return questions;
    }

function getFirebase() {
    return new Firebase('https://class-queue.firebaseio.com/');
}

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ' + process.env.PORT + '!');
  init();
});