
var launches = new Firebase("https://gonzo1234.firebaseio.com/launches");

var model = {

    rests : {
        "0": { "lat": 32.108880, "lng": 34.839711, "name": "פלאפל רצון", "pic_url": "https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/20405/1377403/De0pKwdsXiYnQug/1249731-5.jpg"},
        "1": { "lat": 32.109246, "lng": 34.840262, "name": "כלביה", "pic_url": "https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/20405/1377403/Njh1PyTa13R65sC/images.jpeg"},
        "2": { "lat": 32.107515, "lng": 34.837325, "name": "חתוליה", "pic_url": "https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/20405/1377403/DP617N3jaeTA9VT/2_wa.jpg"},
        "3": { "lat": 32.106909, "lng": 34.836031, "name": "המסעדה של צחי", "pic_url": "https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/20405/1377403/QUkmSwI27A0AbZC/tsachi.jpg"}
    },

    drivers : {
        "0":  { "driver_name":"ISIS",         "driver_id":"1", "pic_url":"https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/20405/1377403/FRDFYXChw8u3HKZ/Screen%20Shot%202016-01-20%20at%2015.47.49.png"},
        "1":  { "driver_name":"AlexeyLO",     "driver_id":"2", "pic_url":"https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/20405/1377403/5k2JqyXETopEdIf/upload.jpg"},
        "2":  { "driver_name":"Ohad DDOS",    "driver_id":"3", "pic_url":"https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/20405/1377403/5743zvmn9PoQUoF/ohad.jpg"},
        "3":  { "driver_name":"Prison Break", "driver_id":"4", "pic_url":"https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/20405/1377403/v94BUIvb5CaPe1h/Screen%20Shot%202016-01-20%20at%2016.08.44.png"},
        "4":  { "driver_name":"Rambo",        "driver_id":"5", "pic_url":"https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/20405/1377403/Mk1tGd5JDCKx5qv/Screen%20Shot%202016-01-20%20at%2016.00.03.png"}
    },

    addLaunch: function (rest_id, time){
        launches.push({
            "rest_id": rest_id,
            'time': time,
        })
    },

    onLaunchChange: function(cb) {
        launches.child("/").on("value", cb);
        console.log("event registered")
    },

    joinLaunch: function(lunch_id, driver_id) {

        var obj = {};
        obj[driver_id] = "I'll join";

        debugger
        launches.child("/" + lunch_id).push(obj);
    }


};


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}



model.onLaunchChange(function(snapshot){
    console.log("event triggered");
    var lunches = snapshot.val();

    var container = $(".lunches");
    container.text("");
    $.each(lunches, function(id, data) {
        var participants = [];
        $.each(data, function(id, text){
            participants.push(id);
        });
        console.log(participants);
        container.append("<div>" + id + " - " + participants + "</div>");
        container.append("<br>");
    });

});










