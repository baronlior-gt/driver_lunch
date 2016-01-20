
var launches = new Firebase("https://gonzo1234.firebaseio.com/launches");

var model = {

    addLaunch: function (name, lat, long, time){
        launches.push({
            "name": name,
            "lat": lat,
            "long": long,
            'time': Math.random(), // "value" event will not trigger unless some value changes
        })
    }
};


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function onEventsChanged(cb) {
    launches.child("/").on("value", cb);
    console.log("event registered")
}


onEventsChanged(function(snapshot){
    console.log("event triggered");
    var lunches = snapshot.val();

    var container = $(".lunches");
    container.text("");
    $.each(lunches, function(index, value) {
        console.log(value.name);
        container.append("<div>" + value.name + "</div>");
        container.append("<br>");
    });

});


$(function(){
    var lunchName = getParameterByName("lunch");
    if (lunchName && lunchName != "") {
        console.log("["+lunchName+"]");

        model.addLaunch(lunchName, 0, 0, 19);
    }
});







