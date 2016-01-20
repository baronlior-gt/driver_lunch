app.controller("MapController", function($scope, $interval, $timeout,
                MapService) {

        MapService.initializeMap();
        model.onLaunchChange(function(snapshot){
		   console.log("event triggered");
		   var lunches = snapshot.val();

		   $.each(lunches, function(rest_id, value) {
		      // console.log(value.time + " " + value.participants);

		      // var drive = model.drivers[value.participants[0]] // remove.

		   });
        });
    }
);