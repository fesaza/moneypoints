

(function () {
    'use strict';

    angular.module("moneyPointsApp").controller('HomeBeneficiarioController', ['$rootScope', '$scope', 'beneficiariosService', 'authorizationService', '$location', HomeBeneficiarioController]);

    function HomeBeneficiarioController($rootScope, $scope, beneficiariosService, authorizationService, $location) {
        kendo.ui.progress($("#form"), true);
        $scope.UserId = $rootScope.globals.currentUser.id;
        $scope.RolId = $rootScope.globals.currentUser.rolId;
         $scope.showInfoBenificiario = false;
        $scope.ShowInfoCliente = false;
        if ($scope.RolId == 4) //Rol de beneficiario
        {
            $scope.showInfoBenificiario = true;
            $scope.ShowInfoCliente = false;
            //Calculo el saldo actual
            $scope.SaldoBeneficiario = beneficiariosService.getSaldoTotal($scope.UserId);

            $scope.SaldoBeneficiario.then(function (pl) {
                $scope.saldo = pl.data;
            },
             function (errorPl) {
                 handleError(errorPl);
                 kendo.ui.progress($("#form"), false);
                 console.log('Error calculaando el saldo', errorPl);
             });
         
        } 
        else if($scope.RolId == 2) //Rol cliente
        {
            $scope.showInfoBenificiario = false;
            $scope.ShowInfoCliente = true;

        }
        kendo.ui.progress($("#form"), false);

        $scope.gotoHistorial = function () {
            $location.path('/beneficiariosDetails/' + $scope.UserId +"-"+"cuenta");//se manda el parametro asi para que el controller de beneficiario agregue la clase para que quede en cuentas
        };
        $scope.gotoPerfil = function () {
            $location.path('/beneficiariosDetails/' + $scope.UserId );
        };
        
         $scope.gotoPerfilCliente = function () {
             $location.path('/clientesDetails/' + $scope.UserId);
        };
    }
})();
