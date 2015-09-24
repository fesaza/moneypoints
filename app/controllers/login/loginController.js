'use strict';

angular.module('moneyPointsApp')

.controller('loginController',
    ['$scope', '$rootScope', '$location', 'authenticationService',
    function ($scope, $rootScope, $location, authenticationService) {


        $scope.login = function () {
            try {


                kendo.ui.progress($("#form"), true);
                $scope.dataLoading = true;
                $scope.error = "Iniciando";
                authenticationService.login($scope.username, $scope.password, function (response) {
                    $scope.error = "Login respuesta";
                    if (!response.success) {
                        $scope.error = "Error";
                        $scope.error = response.Message;
                    } else {
                        $scope.error = "sin error";
                    }
                    $scope.dataLoading = false;
                    kendo.ui.progress($("#form"), false);
                });
            } catch (e) {
                $scope.error = "error" + e.message;
            }
        };
    }]);