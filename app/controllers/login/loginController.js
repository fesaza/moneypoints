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
                    $scope.error = response.Message;
                    $scope.dataLoading = false;
                    kendo.ui.progress($("#form"), false);
                }
                $scope.dataLoading = false;
                kendo.ui.progress($("#form"), false);
            });
        };
    }]);