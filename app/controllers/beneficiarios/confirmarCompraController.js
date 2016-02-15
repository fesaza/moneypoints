
(function () {
    'use strict';

    angular.module("moneyPointsApp").controller('confirmarCompraController',
        ['$scope', '$rootScope', '$', 'ventaService','beneficiariosClienteService', 'dataVenta','$location', confirmarCompraController]);

    function confirmarCompraController($scope, $rootScope, $, ventaService,beneficiariosClienteService, dataVenta,$location) {

        $scope.canSolicitarPin = false;
        $scope.Load = false;
        var venta = null;
        $scope.finCompra = true;
        $rootScope.$on("finalizarCompraCompleted", function (e, message) {

            finalizarCompraCallBack(message)

        });

        var finalizarCompraCallBack = function (message) {
            //debugger;
            var factura = message;

            if (factura != "Compra realizada exitosamente.") {
                $scope.Load = false;
                CompraFinalizada()
            }
            //$location.path('/CompraFinalizada/' + numero)
            ////$scope.goPath('/HomeBeneficiario');
            ////$location.path('/CompraFinalizada')
            if ($scope.finCompra == true) {
                new PNotify({ text: message, type: 'info', delay: 3000 });
                $scope.finCompra = false;
            }
        };

        var CompraFinalizada = function(){
            //debugger;
            $scope.Load = false;
        //$scope.goPath('/HomeBeneficiario')
        //$location.path('#/CompraFinalizada/' + numero)
        }


        var consultarProgramas = function (apply) {
            if (apply) {
                $scope.$apply();
            }
            venta = dataVenta.getDataVenta();
            $scope.PrevCompra = true;
            $scope.NextCompra = false;
            $scope.pageCompra = 0;
            $scope.rowsCompra = 10;
            $scope.filterCompra = null;



            $scope.cuentasBeneficiarioOptionsCompra = {
                
                dataSource: {
                    type: "json",
                    transport: {
                        read: {
                            //url: function () {
                            //    return $rootScope.baseAddress + "/api/BeneficiariosClientes/GetCuentasByAliadoAndBeneficiarioPaginado/" + venta.AliadoId + "/" + venta.BeneficiarioId + "/" + $scope.pageCompra + "/" + $scope.rowsCompra + "/" + $scope.filterCompra
                            //},
                            
                            url: $rootScope.baseAddress + "/api/BeneficiariosClientes/GetCuentasByAliadoAndBeneficiario/" + venta.AliadoId + "/" + venta.BeneficiarioId,
                            dataType: "json",
                            beforeSend:$rootScope.beforeSendRequest
                        },
                        parameterMap: function (options, type) {
                            var paramMap = kendo.data.transports.odata.parameterMap(options);
                            delete paramMap.$inlinecount; // <-- quitar parametro inlinecount
                            return paramMap;
                        }
                    },
                    requestStart: function (e) {
                        kendo.ui.progress($("#gridCuentasBeneficiario"), true);
                    },
                    requestEnd: function (e) {
                        kendo.ui.progress($("#gridCuentasBeneficiario"), false);
                    },
                    pageSize: 100,
                    serverPaging: true,
                    serverSorting: true
                },
                sortable: true,
                pageable: true,
                schema: {
                    model: {
                        fields: {
                            Saldo: { type: "number" },
                            Puntos: { type: "number" },
                            "Cliente.Tercero.Nombre": { type: "string" }
                        }
                    }
                },
                columns: [{
                    field: "Cliente.Tercero.Nombre",
                    title: "Origen Pts"
                },
                {
                    field: "Saldo",
                    title: "Saldo",
                    format: "{0:c}"
                },
                {
                    field: "Puntos",
                    title: "Puntos",
                    format: "{0:n}"
                }],
                template: kendo.template($("#tmpCuentasBeneficiario").html())
            };
        };

        $scope.solicitarPin = function (dataItem) {
            $scope.canSolicitarPin = true;
            $scope.programa = dataItem;
        };

        $scope.regresarPrograma = function () {
            $scope.canSolicitarPin = false;
            $scope.programa = null;
        };

        $scope.finalizarCompra = function () {
            //debugger;
            $scope.Load = true;
            //permite finalizar la compra por parte del cliente
            venta.Pin = $('#formRegPin').val();  //Debe ser quitado, no se debe trabajar de esta manera
            venta.BeneficiariosClienteId = $scope.programa.BeneficiariosClienteId;
            var Venta = ventaService.finalizarCompra(venta);
            //CompraFinalizada()
            //$scope.goPath('/CompraFinalizada');
        };

        

       

        consultarProgramas(false);
    };

})();