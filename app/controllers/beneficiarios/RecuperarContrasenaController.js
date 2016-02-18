(function () {
    'use strict';

    angular.module("moneyPointsApp").controller('RecuperarContrasenaController', ['$rootScope', '$scope', '$routeParams', 'beneficiariosService','Base64', RecuperarContrasenaController]);

    function RecuperarContrasenaController($rootScope, $scope, $routeParams, beneficiariosService,  Base64) {

        $scope.dataLoading = false;
        //Recuperar Contraseña
        $scope.RecuperarContrasena = function () {
            var Recuperar = beneficiariosService.RecuperarContrasena($scope.beneficiario.Tercero);
            $scope.dataLoading = true;
            kendo.ui.progress($("#formRecuperar"), true);
            Recuperar.then(function (pl) {
                //$scope.mensaje = "Eliminado satisfactoriamente.";
                new PNotify({
                    text: 'Se ha enviado un correo al e-mail que registro el usuario',
                    type: 'info',
                    delay: 3000
                });
                
                $scope.goPath('/beneficiarios');
                kendo.ui.progress($("#formRecuperar"), false);
            },
            function (errorPl) {
                kendo.ui.progress($("#formRecuperar"), false);
                $scope.dataLoading = false;
                handleError(errorPl);
            });

        };


    };

})();
