"use strict";

angular.module("moneyPointsApp").controller('afiliadosClienteController',
    ['$rootScope', '$scope', '$routeParams', 'authorizationService', 'afiliadosClientesService', afiliadosClienteController]);


function afiliadosClienteController($rootScope, $scope, $routeParams, authorizationService, afiliadosClientesService) {
    var clienteId = authorizationService.getId();

    //obtener la lista de beneficiarios por cliente
    $scope.Cargar1 = false;
    $scope.Prev5 = true;
    $scope.Next5 = false;
    $scope.page5 = 0;
    $scope.rows5 = 10;
    $scope.filter5 = null;
    $scope.aliadosClienteOpts = {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: function () {
                        return $rootScope.baseAddress + "/api/AfiliadosClientes/AfiliadosClientesByClientePaginado/"+clienteId+"/" + $scope.page5 + "/" + $scope.rows5 + "/" + $scope.filter5
                    },
                    //url: $rootScope.baseAddress + "/api/AfiliadosClientes/AfiliadosClientesByCliente/" + clienteId,
                    dataType: "json",
                    beforeSend: $rootScope.beforeSendRequest
                },
                parameterMap: function (options, type) {
                    var paramMap = kendo.data.transports.odata.parameterMap(options);
                    delete paramMap.$inlinecount; // <-- quitar parametro inlinecount
                    return paramMap;
                }
            }, requestStart: function (e) {
                kendo.ui.progress($("#divAfiliadosCliente"), true);
            },
            requestEnd: function (e) {
                kendo.ui.progress($("#divAfiliadosCliente"), false);
            },
            pageSize: 10,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
        },
        //filterable: {
        //    field: "Afiliado.Cliente.Tercero.Nombre",
        //    operator: "contains"
        //},
        template: kendo.template($("#tmpAfiliadosCliente").html()),
    };

    $scope.aliadosSelectOpts = {
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: $rootScope.baseAddress + "/api/Afiliados/GetAfiliadosCandidatos/" + authorizationService.getId(),
                    beforeSend: $rootScope.beforeSendRequest
                }
            },
            serverFiltering: true,
            filterable: true
        },
        index: -1,
        optionLabel: "Seleccione un afiliado",
        dataTextField: "Cliente.Tercero.Nombre",
        dataValueField: "AfiliadoId"
    };

    $scope.agregarAliado = function () {
        //debugger;
        $scope.Cargar1 = true;
        var aliadoCliente = {
            ClienteId: authorizationService.getId(),
            AfiliadoId: $scope.aliado,
            FechaIngreso: new Date(),
            FechaBaja: null
        };

        if (!aliadoCliente.AfiliadoId) {
            new PNotify({
                text: 'Seleccione un afiliado',
                type: 'danger',
                delay: 3000
            });
            $scope.Cargar1 = false;
            return;
        }

        afiliadosClientesService.post(aliadoCliente).then(
            function (pl) {
                new PNotify({
                    text: 'Se agregó correctamente el aliado',
                    type: 'info',
                    delay: 3000

                });
                $scope.Cargar1 = false;
                $scope.aliado = null;
                $scope.aliados.dataSource.read();
                $scope.cmbAliado.dataSource.read();
                

            },
            function (errorPl) {
                $scope.Cargar1 = false;
                console.log('Error registrando aliado', errorPl);
            });
    };

    //AfiliadosClientes paginados Prev
    $scope.AfiliadosClientesPaginadosPrev = function () {
        //debugger;
        $scope.page5 = $scope.page5 - 1;
        $scope.Rows5 = 10;
        $scope.Next5 = false;
        if ($scope.page5 == 0)
            $scope.Prev5 = true;
        angular.element("#divAfiliadosCliente").data("kendoMobileListView").dataSource.read();
        angular.element("#divAfiliadosCliente").data("kendoMobileListView").refresh();

    };

    //Beneficiarios paginados Next
    $scope.AfiliadosClientesPaginadosNext = function () {
        //debugger;
        $scope.page5 = $scope.page5 + 1;
        $scope.Rows5 = 10;
        if ($scope.page5 > 0)
            $scope.Prev5 = false;
        var AfiliadosClientes = afiliadosClientesService.afiliadosClientesPaginados(clienteId, $scope.page5, $scope.rows5, $scope.filter5)
        angular.element("#divAfiliadosCliente").data("kendoMobileListView").dataSource.read();
        angular.element("#divAfiliadosCliente").data("kendoMobileListView").refresh();

        AfiliadosClientes.then(function (p1) {
            var ben = p1.data;
            if (ben.length < 10)
                $scope.Next5 = true;
        })
    };

 
    //Beneficiarios Paginados filtrar
    $scope.AfiliadosClientesFiltrar = function () {
        $scope.page5 = 0;
        $scope.filter5;
        $scope.Next5 = false;
        if ($scope.filter5 == "")
            $scope.filter5 = "null"
        angular.element("#divAfiliadosCliente").data("kendoMobileListView").dataSource.read();
        angular.element("#divAfiliadosCliente").data("kendoMobileListView").refresh();
        var AfiliadosClientes = afiliadosClientesService.afiliadosClientesPaginados(clienteId, $scope.page5, $scope.rows5, $scope.filter5)
        AfiliadosClientes.then(function (p1) {
            var ben = p1.data;
            if (ben.length < 10)
                $scope.Next5 = true;
        })
        $scope.filter5 = null;
    }
}