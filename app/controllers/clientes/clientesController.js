(function () {
    'use strict';


    angular.module("moneyPointsApp").controller('clientesController', ['$http', '$scope', '$rootScope', 'clientesService', clientesController]);

    function clientesController($http, $scope, $rootScope, clientesService) {
        $scope.Prev2 = true;
        $scope.Next = false;
        $scope.page2 = 0;
        $scope.rows2 = 10;
        $scope.filter2 = null;
        $scope.clientesGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        url: function () {
                            return $rootScope.baseAddress + "/api/Clientes/Paginado/" + $scope.page2 + "/" + $scope.rows2 + "/" + $scope.filter2
                        },
                        dataType: "json",
                        beforeSend: $rootScope.beforeSendRequest
                    },
                    parameterMap: function (options, type) {
                        var paramMap = kendo.data.transports.odata.parameterMap(options);
                        delete paramMap.$inlinecount; // <-- quitar parametro inlinecount
                        return paramMap;
                    }
                },
                requestStart: function (e) {
                    kendo.ui.progress($("#gridClientes"), true);
                },
                requestEnd: function (e) {
                    kendo.ui.progress($("#gridClientes"), false);
                },
                pageSize: 10,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
            },
            sortable: true,
            pageable: true,
            //filterable: {
            //    field: "Tercero.Nombre",
            //    operator: "contains"
            //},
            scrollable: {
                virtual: true
            },
            schema: {
                data: function (data) {
                    return data;
                },
                total: function (data) {
                    return 6;
                },
                model: {
                    fields: {
                        "Tercero.Nombre": { type: "string" },
                        "Tercero.Identificacion": { type: "number" },
                        "Tercero.Telefono": { type: "string" },
                    }
                }
            },
            columns: [{
                field: "Tercero.Nombre",
                title: "Razón Social"
            },
            {
                field: "Tercero.Identificacion",
                title: "Nit"
            },
            {
                field: "Tercero.Telefono",
                title: "Teléfono"
            }],
            template: kendo.template($("#tmpClientes").html()),
        };

        //Clientes paginados Prev
        $scope.ClientesPaginadosPrev = function () {
            //debugger;
            $scope.page2 = $scope.page2 - 1;
            $scope.Rows2 = 10;
            $scope.Next2 = false;
            if ($scope.page2 == 0)
                $scope.Prev2 = true;
            angular.element("#gridClientes").data("kendoMobileListView").dataSource.read();
            angular.element("#gridClientes").data("kendoMobileListView").refresh();

        };

        //Clientes paginados Next
        $scope.ClientesPaginadosNext = function () {
            //debugger;
            $scope.page2 = $scope.page2 + 1;
            $scope.Rows2 = 10;
            if ($scope.page2 > 0)
                $scope.Prev2 = false;
            var clientes = clientesService.ClientesPaginados($scope.page2, $scope.rows2, $scope.filter2)
            angular.element("#gridClientes").data("kendoMobileListView").dataSource.read();
            angular.element("#gridClientes").data("kendoMobileListView").refresh();

            clientes.then(function (p1) {
                var cli = p1.data;
                if (cli.length < 10)
                    $scope.Next2 = true;
            })
        };

        //Clientes paginados Filtrar
        $scope.ClientesFiltrar = function () {
            $scope.page2 = 0;
            $scope.filter2;
            $scope.Next2 = false;
            if ($scope.filter2 == "")
                $scope.filter2 = "null"
            angular.element("#gridClientes").data("kendoMobileListView").dataSource.read();
            angular.element("#gridClientes").data("kendoMobileListView").refresh();
            var clientes = clientesService.ClientesPaginados($scope.page2, $scope.rows2, $scope.filter2)
            clientes.then(function (p1) {
                var cli = p1.data;
                if (cli.length < 10)
                    $scope.Next2 = true;
            })
            $scope.filter2 = null;
        }

    };


})();