(function () {
    'use strict';

    angular.module("moneyPointsApp").controller('CompraFinalizada', ['$rootScope', '$scope', '$routeParams', 'beneficiariosService', CompraFinalizada]);

    function beneficiariosDetailsController($rootScope, $scope, $routeParams, authorizationService) {
        //debugger;
        var NumeroFactura = $routeParams.numero;

        var promiseGetCompra = beneficiariosService.getCompra(NumeroFactura);
            
            $scope.Compra;
            promiseGetCompra.then(function (pl) {
                var res = pl.data;
                $scope.Compra = res;
            },
             function (errorPl) {
                 handleError(errorPl);
                 console.log('Error cargando Compra', errorPl);
             });
        }
})();
