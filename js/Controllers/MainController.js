app.controller("MainController", function($scope, $interval, $timeout, $location, $compile, $rootScope,
                                          MapService) {



    $scope.rests = [];

    model.onLaunchChange(function(snapshot){
        console.log("event triggered");
        var lunches = snapshot.val();

        if (lunches) {
            $.each(lunches, function(id, data) {
                console.log(id);
                $scope.rests[id] = [];
                var participants = [];
                if (data) {
                    $.each(data, function(id, text){
                        participants.push(id);
                    });
                    $scope.rests[id] = participants.slice(0);
                    console.log(id + " - " + participants);
                }

            });

            console.log("Rests ", $scope.rests);
        }

    });

        $scope.lunch = "בא לי לאכול עם החבר'ה";

        $scope.getDriverId = function getDriverId(){
            return parseInt($location.search().driver) || 1;
        };

        $scope.displayOptions = function displayOptions() {
            MapService.showLunchesPositions($scope.rests);
        };

        $scope.getDriverImage = function getDriverImage() {
            return model.drivers[$scope.getDriverId()].pic_url;
        };

        $scope.chooseEatHere = function chooseEatHere(id) {
            driver_id = $scope.getDriverId();
            model.joinLaunch(id, driver_id);
            MapService.closeInfo();
        };


        $scope.chooseJoinForLunch = function chooseJoinForLunch(restId) {
            model.joinLaunch(restId, $scope.getDriverId());
            MapService.closeInfo();
        };



        $scope.joinLunch = function joinLunch() {
            MapService.showCurrentPosition(renderJoinLunch);
        }

    }
);