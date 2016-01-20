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

        $scope.getDriverImage = function getDriverImage() {
            switch (parseInt($location.search().driver)) {
                case 1:
                    return "./images/alexey.png";
                case 2:
                    return "./images/ohad.png";
                default:
                    return "./images/alexey.png";
            }
        };

        $scope.chooseEatHere = function chooseEatHere() {
            MapService.closeInfo();
        };

        function renderLunchOption(location) {
            var compiled = $compile("<div ng-controller='MainController'><div class = 'pull-left'>"+
            "<img class = 'lunchPlaceImage' src = 'http://forumsgallery.tapuz.co.il/ForumsGallery/galleryimages/16_2706200463849.jpg' />"+
            "</div>"+
            "<div class = 'pull-right'><h1>Hatuliya</h1>"+
            "<select class='form-control'>"+
            "<option>12:00</option>"+
            "<option>12:30</option>"+
            "<option>13:00</option>"+
            "<option>13:30</option>"+
            "</select>"+
            "<br /><button ng-click='chooseEatHere()' class = 'eatHere btn btn-primary'>אוכל פה</button>"+
            "</div></div>")($rootScope);
            MapService.setInfo(location, compiled[0]);
        }

        this.chooseJoinForLunch = function chooseJoinForLunch() {
            MapService.closeInfo();
        };

        function renderJoinLunch(location) {
            MapService.setInfo(location, (function() {
                var str = "<div class = 'pull-left'>" +
                    "<img class = 'lunchPlaceImage' src = 'http://forumsgallery.tapuz.co.il/ForumsGallery/galleryimages/16_2706200463849.jpg' />";

                str += "</div>";
                str += "<div class = 'pull-right'><h1>Hatuliya</h1>";

                str += "נהגוס " + users[0].driver_name + " מתפנק פה ב " + "12:00";



                str += "<br /><button ng-click = 'chooseJoinForLunch()' class = 'joinToEat btn btn-primary'>מצתרף, אחי</button>";

                str += "</div>";
                return str;
            })());
        }

        $scope.displayLunchOption = function displayLunchOption() {
            MapService.showCurrentPosition(renderLunchOption);

        };

        $scope.joinLunch = function joinLunch() {
            MapService.showCurrentPosition(renderJoinLunch);
        }

    }
);