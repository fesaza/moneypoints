(function () {
    'use strict';

    angular.module("moneyPointsApp").controller('detallesCuentaBeneficiarioController', ['$rootScope', '$scope', '$routeParams', 'beneficiariosPuntosService', detallesCuentaBeneficiarioController]);

    function detallesCuentaBeneficiarioController($rootScope, $scope, $routeParams, beneficiariosPuntosService) {
        kendo.ui.progress($("#form"), true);
        var beneficiariosClienteId = $routeParams.beneficiariosClienteId;
        var nombreCliente = $routeParams.nombre;
        $scope.nombreCliente = nombreCliente;
        //paginacion ptsbeneficiario
        $scope.curPage1 = 0;
        $scope.pageSize1 = 5;
        $scope.curPage2 = 0;
        $scope.pageSize2 = 5;
         $scope.ShowPaging1 = false;
        $scope.ShowPaging2 = false;

        //Consulta puntos
        $scope.beneficiariosPuntosHistoricos = beneficiariosPuntosService.getbeneficiariosPuntosHistoricos(beneficiariosClienteId);
       
        $scope.beneficiariosPuntosHistoricos.then(function (pl) {
            var res = pl.data;
            $scope.ListBeneficiariosHistoricos = res;
            if ($scope.ListBeneficiariosHistoricos.length > $scope.pageSize1)
                $scope.ShowPaging1 = true;
            else
                $scope.ShowPaging1 = false;
        },
         function (errorPl) {
             handleError(errorPl);
             kendo.ui.progress($("#form"), false);
             console.log('Error cargando Historico de puntos', errorPl);
         });
       
        //consulta compras
        $scope.beneficiariosComprasHistoricos = beneficiariosPuntosService.getbeneficiariosComprasHistorico(beneficiariosClienteId);

        $scope.beneficiariosComprasHistoricos.then(function (pl) {
            var res = pl.data;
            $scope.ListBeneficiariosCompras = res;
            if ($scope.ListBeneficiariosCompras.length > $scope.pageSize2)
                 $scope.ShowPaging2 =true;
            else
                 $scope.ShowPaging2 =false;
        },
         function (errorPl) {
             handleError(errorPl);
             kendo.ui.progress($("#form"), false);
             console.log('Error cargando Historico de compras', errorPl);
         });
       
        kendo.ui.progress($("#form"), false);

        //funciones
        $scope.numberOfPages1 = function () {
            if ($scope.ListBeneficiariosHistoricos != null)
                return Math.ceil($scope.ListBeneficiariosHistoricos.length / $scope.pageSize1);
        };
        $scope.numberOfPages2 = function () {
            if ($scope.ListBeneficiariosCompras != null)
                return Math.ceil($scope.ListBeneficiariosCompras.length / $scope.pageSize2);
        };
        
    }
})();