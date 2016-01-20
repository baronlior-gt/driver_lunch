app.controller("MainController", function($scope, $interval, $timeout, $location, MapService) {


        var users = [
            {
                "driver_name": "אוהד",
                "pic_url": ""
            },
            {
                "driver_name": "אלכסיי",
                "pic_url": ""
            }
        ];

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

        function renderLaunchOption(location) {
            MapService.setInfo(location, (function() {
                var str = "<div class = 'pull-left'>" +
                    "<img class = 'lunchPlaceImage' src = 'http://forumsgallery.tapuz.co.il/ForumsGallery/galleryimages/16_2706200463849.jpg' />";

                str += "</div>";
                str += "<div class = 'pull-right'><h1>Hatuliya</h1>";
                str += "<select class='form-control'>" +
                "<option>12:00</option>" +
                "<option>12:30</option>" +
                "<option>13:00</option>" +
                "<option>13:30</option>" +
                "</select>";

                str += "<br /><button class = 'eatHere btn btn-primary'>אוכל פה</button>";

                str += "</div>";
                return str;
            })());
        }

        $scope.displayLunchOption = function displayLunchOption() {
            MapService.showCurrentPosition(renderLaunchOption);

        };

        $scope.joinLunch = function joinLunch() {

        }

    }
);