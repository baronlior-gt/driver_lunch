app.controller("MapController", function($scope, $interval, $timeout) {


        var currentInfo;
        const zoom = 17;

        var that = this;

        //Initialize map
        function initializeMap() {
            var mapProp = {
                center: new google.maps.LatLng(32.086737852226356, 34.81067419052124),
                zoom: zoom, // Comfortable zoom level
                scaleControl: false,
                draggable: true,
                disableDoubleClickZoom: true,
                //OPTIONS:ROADMAP, SATELLITE, HYBRID, TERRAIN
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var googleMap = document.getElementById("map");
            if (googleMap) {
                map = new google.maps.Map(googleMap, mapProp);

                google.maps.event.addListener(map, "drag", function () {
                    followUser = false;
                });
                console.log("Map initialized");
                function showUserPosition() {
                    showCurrentPosition(function (location) {
                        that.currentPosition = location;
                        if (!currentInfo) {
                            setInfo(location, "You are here", true);
                        }
                    });
                }

                showUserPosition();
                $interval(showUserPosition, 5000);
            }
        }

        function showCurrentPosition(callback) {
            console.log("Showing current position");

            // Check if geolocation is supported
            if (!!navigator.geolocation) {

                var gotResponse = false;

                // If geolocation is supported, but user didn't allow it for our application, notify him
                $timeout(function () {
                    if (!gotResponse) {
                        callback();
                    }
                }, 5000);

                navigator.geolocation.getCurrentPosition(function (position) {
                    gotResponse = true;
                    var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    callback(geolocate);
                });
            } else {
                console.log("No geolocation support detected");
            }
        }

        function setInfo(position, content, draggable) {
            if (!draggable) {
                draggable = false;
            }
            map.setOptions({draggable: draggable});
            // Get position
            //var pos = new google.maps.LatLng( position.coords.latitude, position.coords.longitude);
            if (content) {
                // Close previous info
                closeInfo();

                // Render window at clicked position
                currentInfo = new google.maps.InfoWindow({
                    position: position,
                    map: map,
                    content: content
                });

                // When new cat window closes, disable the add new cat
                google.maps.event.addListener(currentInfo, "closeclick", function (e) {
                        map.setOptions({draggable: true});
                        disableInfo();
                    }
                );
            }
        }

        function closeInfo() {
            if (currentInfo) {
                currentInfo.close();
                currentInfo = null;
            }
        }

        google.maps.event.addDomListener(window, 'load', initializeMap);
    }
);