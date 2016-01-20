app.controller("MainController", function($scope, $interval, $timeout, $location, $compile, $rootScope,
                                          MapService) {

        var users = [
            {
                "driver_name": "אלכסיי",
                "pic_url": ""
            },
            {
                "driver_name": "אוהד",
                "pic_url": ""
            }
        ];

        $scope.lunch = "בא לי לאכול עם החברה";

        $scope.getDriverId = function getDriverId(){
            return parseInt($location.search().driver) || 1;
        };

        $scope.displayOptions = function displayOptions() {
            MapService.showLunchesPositions();
        };

        $scope.getDriverImage = function getDriverImage() {
            return model.drivers[$scope.getDriverId()].pic_url;
        };

        $scope.chooseEatHere = function chooseEatHere() {
            MapService.closeInfo();
        };


        this.chooseJoinForLunch = function chooseJoinForLunch(restId) {
            model.joinLaunch(restId, $scope.getDriverId());
            MapService.closeInfo();
        };

        function renderJoinLunch(location, restId) {
            var str = "<div ng-controller='MainController'><div class = 'pull-left'>" +
                "<img class = 'lunchPlaceImage' src = 'http://forumsgallery.tapuz.co.il/ForumsGallery/galleryimages/16_2706200463849.jpg' />";
            str += "</div>";
            str += "<div class = 'pull-right'><h1>Hatuliya</h1>";
            str += "נהגוס " + users[0].driver_name + " מתפנק פה ב " + "12:00";
            str += "<br /><button ng-click = 'chooseJoinForLunch(restId)' class = 'joinToEat btn btn-primary'>מצתרף, אחי</button>";
            str += "</div></div>";

            var compiled = $compile(str)($rootScope);
            MapService.setInfo(location, compiled[0]);
        }

        $scope.joinLunch = function joinLunch() {
            MapService.showCurrentPosition(renderJoinLunch);
        }

    }
);