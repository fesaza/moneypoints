(function () {
    'use strict';

    angular.module("moneyPointsApp").controller('RecuperarContrasenaController', ['$rootScope', '$scope', '$routeParams', 'beneficiariosService','Base64', RecuperarContrasenaController]);

    function RecuperarContrasenaController($rootScope, $scope, $routeParams, beneficiariosService,  Base64) {


        //Recuperar Contraseña
        $scope.RecuperarContrasena = function () {
            var Recuperar = beneficiariosService.RecuperarContrasena($scope.beneficiario.Tercero);
            Recuperar.then(function (pl) {
                //$scope.mensaje = "Eliminado satisfactoriamente.";
                new PNotify({
                    text: 'Se ha enviado un correo al e-mail que tiene registrado el beneficiario',
                    type: 'info',
                    delay: 3000
                });
                $scope.goPath('/beneficiarios');
            },
            function (errorPl) {
                handleError(errorPl);
            });

        };


    };

})();
