'use strict';

angular.module('moneyPointsApp')

.controller('loginController',
    ['$scope', '$rootScope', '$location', 'authenticationService', 'authorizationService', 'Base64', '$http', 'tercerosService',
    function ($scope, $rootScope, $location, authenticationService, authorizationService, Base64, $http, tercerosService) {

     
        $scope.login = function () {

            kendo.ui.progress($("#form"), true);
            $scope.dataLoading = true;
            $scope.error = "";
            authenticationService.login($scope.username, $scope.password, function (response) {
                if (!response.success) {
                    new PNotify({
                        text: 'Error: ' + response.Message,
                        type: 'danger',
                        delay: 3000
                    });
                    $scope.dataLoading = false;
                    kendo.ui.progress($("#form"), false);
                }
                $scope.dataLoading = false;
                kendo.ui.progress($("#form"), false);
            });
        };
    }]);