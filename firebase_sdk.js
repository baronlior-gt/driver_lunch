
var launches = new Firebase("https://gonzo1234.firebaseio.com/launches");

var model = {

    addLaunch: function (name, lat, long, time){
        launches.push({
            "name": name,
            "lat": lat,
            "long": long,
            'time': Math.random(), // "value" event will not trigger unless some value changes
        })
    },

    onLaunchChange: function(cb) {
        launches.child("/").on("value", cb);
        console.log("event registered")
    },

    joinLaunch: function(lunch_id, driver_id) {
        var obj = {};
        obj[driver_id] = "I'll join";

        launches.child("/"+lunch_id+"/participants").push(obj);
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
    $.each(lunches, function(id, value) {
        console.log(value.name);
        container.append("<div>" + id + " - " + value.name + "</div>");
        container.append("<br>");
    });

});


$(function(){
    var lunchName = getParameterByName("lunch");
    if (lunchName && lunchName != "") {
        console.log("lunch: ["+lunchName+"]");

        model.addLaunch(lunchName, 0, 0, 19);
    }

    var joinLunchRecord = getParameterByName("join");
    if (joinLunchRecord && joinLunchRecord != "") {
        console.log("join: ["+joinLunchRecord+"]");

        var lunch_id = joinLunchRecord.split("|")[0];
        var driver_id = joinLunchRecord.split("|")[1];
        model.joinLaunch(lunch_id, driver_id);
    }
});







