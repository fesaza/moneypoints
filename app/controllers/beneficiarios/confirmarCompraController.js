(function () {
    'use strict';

    angular.module("moneyPointsApp").controller('confirmarCompraController',
        ['$scope', '$rootScope', '$', 'ventaService','beneficiariosClienteService', 'dataVenta', confirmarCompraController]);

    function confirmarCompraController($scope, $rootScope, $, ventaService,beneficiariosClienteService, dataVenta) {

        $scope.canSolicitarPin = false;
        $scope.Load = false;
        var venta = null;

        $rootScope.$on("finalizarCompraCompleted", function (e, message) {

            finalizarCompraCallBack(message)

        });

        var finalizarCompraCallBack = function (message) {
            new PNotify({ text: message, type: 'info', delay: 3000});
            
        };

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
            $scope.goPath('/HomeBeneficiario');
        };

        ////CuentasByAliadoByBeneficiario paginados Prev
        //$scope.CuentasByAliadoByBeneficiarioPaginadosPrev = function () {
        //    //debugger;
        //    $scope.pageCompra = $scope.pageCompra - 1;
        //    $scope.rowsCompra = 10;
        //    $scope.NextCompra = false;
        //    if ($scope.pageCompra == 0)
        //        $scope.PrevCompra
        //            = true;
        //    angular.element("#gridCuentasBeneficiario").data("kendoMobileListView").dataSource.read();
        //    angular.element("#gridCuentasBeneficiario").data("kendoMobileListView").refresh();

        //};

        ////CuentasByAliadoByBeneficiario paginados Next
        //$scope.CuentasByAliadoByBeneficiarioPaginadosNext = function () {
        //    //debugger;
        //    $scope.pageCompra = $scope.pageCompra + 1;
        //    $scope.rowsCompra = 10;
        //    if ($scope.pageCompra > 0)
        //        $scope.PrevCompra = false;
        //    var CuentasByAliadoByBeneficiario = beneficiariosClienteService.GetCuentasByAliadoAndBeneficiarioPaginado(clienteId, $scope.pageCompra, $scope.rowsCompra, $scope.filterCompra)
        //    angular.element("#gridCuentasBeneficiario").data("kendoMobileListView").dataSource.read();
        //    angular.element("#gridCuentasBeneficiario").data("kendoMobileListView").refresh();

        //    CuentasByAliadoByBeneficiario.then(function (p1) {
        //        var ben = p1.data;
        //        if (ben.length < 10)
        //            $scope.NextCompra = true;
        //    })
        //};

       

        consultarProgramas(false);
    };

})();