
var launches = new Firebase("https://gonzo1234.firebaseio.com/launches");


function addEvent(name, lat, long, time){
    launches.set({
        "name": name,
        "lat": lat,
        "long": long,
        'time': Math.random(), // "value" event will not trigger unless some value changes
    })
}

function onEventsChanged(cb) {
    launches.child("/").on("value", cb);
    console.log("event registered")
}


onEventsChanged(function(snapshot){
    console.log("event triggered");
    $("body").append("<div>" + snapshot.val().name + "</div>");
    $("body").append("<br>");
});

$(function(){
    addEvent("Shiskabbab", 0, 0, 19);
});







