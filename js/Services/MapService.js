app.service("MapService", function ($compile, $http, $rootScope, $timeout, $interval) {


    var map;
    var mapClickListenerHandle;
    // Event that is counted as tapping at the map (mousedown/click)
    var tapEvent = 'mousedown';

    const MIN_ZOOM = 10;
    const DEFAULT_ZOOM = 17;

    var markers = [];
    var currentInfo = null;
    var that = this;
    var isInfoEnabled = false;
    var zoom = DEFAULT_ZOOM;

    var icons = [];

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

            // Map was moved/resized/loaded
            /*
            google.maps.event.addListener(map, 'bounds_changed', function () {
                $rootScope.$broadcast(Events.MAP_RESIZED);
            });
            */

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

    google.maps.event.addDomListener(window, 'load', initializeMap);

    function setInfo(position, content, draggable) {
        if (!draggable) {
            draggable = false;
        }
        map.setOptions({draggable: draggable});
        // Get position

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

    /**
     * Place marker at (X,Y)
     * @param markerData - x, y, id of the entity that the marker represents
     * @param icon - what the marker looks like
     * @param callback - what happens when the marker is called
     * @returns {google.maps.Marker}
     */
    function placeMarker(markerData, type, callback) {

        var x = markerData.location ? markerData.location.x : markerData.x;
        var y = markerData.location ? markerData.location.y : markerData.y;
        var id = markerData.entityId ? markerData.entityId : markerData.id;

        // Validate that the object contains at least coordinates
        if (!y || !x) {
            console.error("No coordinates received", markerData);
            return;
        }

        var position = new google.maps.LatLng(y, x);

        //TODO create method makeMarker?
        var marker = new google.maps.Marker({
            position: position,
            map: map
        });

        var icon = getIcon(type);
        if (icon) {
            marker.setIcon(icon);
        }

        if (callback) {
            google.maps.event.addListener(marker, "click", function () {
                    callback(marker, id, $rootScope);
                }
            );
        }

        // Store in array to be able to clear it
        if (!markers[type]) {
            markers[type] = [];
        }

        markers[type].push(marker);
        return marker;
    }

    function getIcon(type) {
        switch (type) {
            case MarkerTypes.FEED_SPOT:
                return that.makeIcon("/image/feedSpot.png");
            case MarkerTypes.CAT:
                return that.makeIcon("/image/cat.svg");
        }
    }

    function placeInfo(position, content) {
        closeInfo();
        disableInfo();

        currentInfo = new google.maps.InfoWindow({
            position: position,
            map: map
        });
        setTimeout(function () {
            currentInfo.setContent(content)
        }, 100);
    }

    this.placeInfo = placeInfo;

    function closeInfo() {
        if (currentInfo) {
            currentInfo.close();
            currentInfo = null;
        }
    }

    this.closeInfo = closeInfo;
    this.placeMarker = placeMarker;

    this.getPositionOfCurrentInfo = function () {
        if (currentInfo) {
            return {x: currentInfo.position.lng(), y: currentInfo.position.lat()};
        }
    };

    /**
     * Convert GoogleMaps Bounds object to coordinates
     * @param bounds
     * @returns {{fromX: *, toX: *, fromY: *, toY: *}}
     */
    function boundsToCoordinates(bounds) {
        if (!bounds)
            return;

        var northEast = bounds.getNorthEast();
        var southWest = bounds.getSouthWest();
        var fromX = southWest.lng();
        var toY = northEast.lat();
        var fromY = southWest.lat();
        var toX = northEast.lng();

        return {
            "fromX": fromX,
            "toX": toX,
            "fromY": fromY,
            "toY": toY
        }
    }

    function disableInfo() {
        console.log("Info disabled");

        isInfoEnabled = false;
        google.maps.event.removeListener(mapClickListenerHandle);
    }

    function enableInfo(content) {
        console.log("Info enabled");

        closeInfo();
        disableInfo();

        isInfoEnabled = true;
        mapClickListenerHandle = google.maps.event.addListener(map, tapEvent, function (e) {
            setInfo(e.latLng, content);
        });
    }


    var followUser = true;


    this.shouldFollowUser = function (should) {
        followUser = should;
    };

    function showCurrentPosition(callback) {
        console.log("Showing current position");

        // Check if geolocation is supported
        if (!!navigator.geolocation) {

            var gotResponse = false;

            // If geolocation is supported, but user didn't allow it for our application, notify him
            $timeout(function () {
                if (!gotResponse) {
                   // MessageService.warning("Please allow using your location by clicking Allow button");
                    callback();
                }
            }, 5000);

            navigator.geolocation.getCurrentPosition(function (position) {
                gotResponse = true;
                var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                if (followUser) {
                    that.panTo(position.coords.latitude, position.coords.longitude);
                }

                callback(geolocate);
            });
        } else {
            console.log("No geolocation support detected");
          //  MessageService.warning("We couldn't locate you on the map");
        }
    }

    this.panTo = function (latitude, longitude) {
        map.panTo(new google.maps.LatLng(latitude, longitude));
    };


    this.getMapCoordinates = function () {
        return boundsToCoordinates(map.getBounds());
    };


    this.makeIcon = function (iconPath) {
        if (!icons[iconPath]) {
            icons[iconPath] = new google.maps.MarkerImage(
                iconPath,
                null, /* size is determined at runtime */
                null, /* origin is 0,0 */
                null, /* anchor is bottom center of the scaled image */
                new google.maps.Size(50, 50)
            );
        }

        return icons[iconPath];
    };

    this.setInfo = setInfo;

    this.zoomOut = function () {
        if (zoom - 1 > MIN_ZOOM) {
            map.setZoom(--zoom);
            return true;
        }
        return false;
    };

    this.defaultZoom = function () {
        zoom = DEFAULT_ZOOM;
        map.setZoom(zoom);
    };

    this.clearMarkers = function (type) {
        if (markers && markers.length > 0) {
            var markersOfType = markers[type];
            if (markersOfType) {
                for (var i = 0; i < markersOfType.length; i++) {
                    var marker = markersOfType[i];
                    marker.setMap(null);
                    marker = null;
                }
                markers[type] = [];
            }
            else {
                console.warn("clearMarkers", "Unknown marker type", type);
            }
        }
    };

    this.enableInfo = enableInfo;

    this.initializeMap = initializeMap;

    this.showCurrentPosition = showCurrentPosition;
});