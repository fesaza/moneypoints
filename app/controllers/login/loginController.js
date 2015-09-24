'use strict';

angular.module('moneyPointsApp')

.controller('loginController',
    ['$scope', '$rootScope', '$location', 'authenticationService', 'authorizationService', 'tercerosService',
    function ($scope, $rootScope, $location, authenticationService, authorizationService, tercerosService) {
        $scope.login = function () {
            kendo.ui.progress($("#form"), true);
            $scope.dataLoading = true;
            $scope.error = "";
            authenticationService.login($scope.username, $scope.password, function (response) {
                
                if (response.success) {
                    authenticationService.setCredentials(response);
                    
                    //ConsultarId
                    tercerosService.get(response.TerceroId).then(function (pl) {
                        var res = pl.data;
                        authorizationService.setId(res);
                        

                        //Consultar asegurables
                        authorizationService.getAsegurables(function (response) {
                            for (var i = 0; i < response.length; i++) {
                                response[i].Asegurable.Ruta = response[i].Asegurable.Ruta.replace("{id}", authorizationService.getId());
                            }
                            $rootScope.$emit('refreshMenu', response);
                            $scope.dataLoading = false;
                            kendo.ui.progress($("#form"), false);
                        });
                        new PNotify({ text: "fin de logi22222n", type: "info", delay: 3000 });

                        authenticationService.navigateDefaultPage();
                        //if (response.RolId == 2) {//si el usuario logeado es cliente
                        //    $location.path('/vender');
                        //} else if (response.RolId == 4) {//si el usuario logeado es Beneficiario
                        //    $location.path('/beneficiariosDetails/' + authorizationService.getId());
                        //} else if (response.RolId == 1) {//si el usuario logeado es admin
                        //    $location.path('/clientes');
                        //}
                    });
                } else {
                    new PNotify({ text: "fin de login con error" + response.toString() + response.message, type: "info", delay: 3000 });
                    $scope.error = "Error raro" + response.Message;
                    $scope.dataLoading = false;
                    kendo.ui.progress($("#form"), false);
                }
            });
        };
    }]);