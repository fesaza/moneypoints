"use strict";

angular.module("moneyPointsApp").controller('beneficiariosClienteController',
    ['$rootScope', '$scope', '$routeParams', 'authorizationService', 'beneficiariosClienteService', beneficiariosClienteController]);


function beneficiariosClienteController($rootScope, $scope, $routeParams, authorizationService, beneficiariosClienteService) {
    var clienteId = authorizationService.getId();

    //obtener la lista de beneficiarios por cliente
    $scope.Prev6 = true;
    $scope.Next6 = false;
    $scope.page6 = 0;
    $scope.rows6 = 10;
    $scope.filter6 = null;
    $scope.benefClienteOpts = {
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: function () {
                        return $rootScope.baseAddress + "/api/BeneficiariosClientes/BeneficiariosClientesByClientePaginado/"+clienteId+"/" + $scope.page6 + "/" + $scope.rows6 + "/" + $scope.filter6
                    },
                    //url: $rootScope.baseAddress + "/api/BeneficiariosClientes/BeneficiariosClientesByCliente/" + clienteId,
                    dataType: "json",
                    beforeSend: $rootScope.beforeSendRequest
                },
                parameterMap: function (options, type) {
                    var paramMap = kendo.data.transports.odata.parameterMap(options);
                    delete paramMap.$inlinecount; // <-- quitar parametro inlinecount
                    return paramMap;
                }
            }, requestStart: function (e) {
                kendo.ui.progress($("#divBenefCliente"), true);
            },
            requestEnd: function (e) {
                kendo.ui.progress($("#divBenefCliente"), false);
            },
            pageSize: 10,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
        },
        //filterable: {
        //    field: "Beneficiario.Tercero.Nombre",
        //    operator: "contains"
        //},
        template: kendo.template($("#tmpBenefCliente").html()),
    };

    $scope.beneficiariosSelectOpts = {
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: $rootScope.baseAddress + "/api/Beneficiarios/GetBeneficiariosCandidatos/" + authorizationService.getId(),
                    beforeSend: $rootScope.beforeSendRequest
                }
            },
            serverFiltering: true,
            filterable: true
        },
        index: -1,
        optionLabel:"Seleccione un beneficiario",
        filterable:true,
        dataTextField: "Tercero.Nombre",
        dataValueField: "BeneficiarioId"
    };

    $scope.agregarBeneficiario = function () {
        var benefCliente = {
            ClienteId: authorizationService.getId(),
            BeneficiarioId: $scope.benef,
            FechaIngreso: new Date(),
            FechaBaja: null
        };

        if (!benefCliente.BeneficiarioId) {
            new PNotify({
                text: 'Seleccione un beneficiario',
                type: 'warning',
                delay: 3000
            });

            return;
        }

        beneficiariosClienteService.post(benefCliente).then(
            function (pl) {
                new PNotify({
                    text: 'Se agregó correctamente el beneficiario',
                    type: 'info',
                    delay: 3000
                });
                $scope.benef = null;
                $scope.goPath('/beneficiariosCliente');
                $scope.benefs.dataSource.read();
                $scope.cmbBeneficiario.dataSource.read();
            },
            function (errorPl) {
                handleError(errorPl);
                console.log('Error registrando beneficiario', errorPl);
            });

        //BeneficiariosClientes paginados Prev
        $scope.BeneficiariosClientesPaginadosPrev = function () {
            //debugger;
            $scope.page6 = $scope.page6 - 1;
            $scope.Rows6 = 10;
            $scope.Next6 = false;
            if ($scope.page6 == 0)
                $scope.Prev6 = true;
            angular.element("#divBenefCliente").data("kendoMobileListView").dataSource.read();
            angular.element("#divBenefCliente").data("kendoMobileListView").refresh();

        };

        //BeneficiariosClientes paginados Next
        $scope.BeneficiariosClientesPaginadosNext = function () {
            //debugger;
            $scope.page6 = $scope.page6 + 1;
            $scope.Rows6 = 10;
            if ($scope.page6 > 0)
                $scope.Prev6 = false;
            var BeneficiariosClientes = beneficiariosClienteService.BeneficiariosClientesPaginados(clienteId, $scope.page6, $scope.rows6, $scope.filter6)
            angular.element("#divBenefCliente").data("kendoMobileListView").dataSource.read();
            angular.element("#divBenefCliente").data("kendoMobileListView").refresh();

            BeneficiariosClientes.then(function (p1) {
                var ben = p1.data;
                if (ben.length < 10)
                    $scope.Next6 = true;
            })
        };

        //BeneficiariosClientes Paginados filtrar
        $scope.BeneficiariosClientesFiltrar = function () {
            $scope.page6 = 0;
            $scope.filter6;
            $scope.Next6 = false;
            if ($scope.filter6 == "")
                $scope.filter6 = "null"
            angular.element("#divBenefCliente").data("kendoMobileListView").dataSource.read();
            angular.element("#divBenefCliente").data("kendoMobileListView").refresh();
            var BeneficiariosClientes = beneficiariosClienteService.BeneficiariosClientesPaginados(clienteId, $scope.page6, $scope.rows6, $scope.filter6)
            BeneficiariosClientes.then(function (p1) {
                var ben = p1.data;
                if (ben.length < 10)
                    $scope.Next6 = true;
            })
            $scope.filter6 = null;
        }
    };


}