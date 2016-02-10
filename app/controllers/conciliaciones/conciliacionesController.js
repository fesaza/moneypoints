
(function () {
    'use strict';

    angular.module("moneyPointsApp").controller('conciliacionesController', ['$scope', '$rootScope', '$routeParams', 'conciliacionesService', 'authorizationService', conciliacionesController]);

    function conciliacionesController($scope, $rootScope, $routeParams, conciliacionesService, authorizationService) {
        
        $scope.Prev8 = true;
        $scope.Next8 = false;
        $scope.pagina = 0;
        $scope.rows8 = 10;
        $scope.filter8 = null;

        //ConciliacionAfiliadosClientes
        $scope.conciliacionAliadosGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        url: function () {
                            return $rootScope.baseAddress + "/api/Conciliaciones/ConciliacionespaginadasByCliente/" + authorizationService.getId() + "/" + 0 + "/" + $scope.rows8 + "/" + $scope.filter8
                            //return  conciliacionesService.ConciliacionesPaginadosByCliente(authorizationService.getId(), $scope.pagina, $scope.rows8, $scope.filter8)
                        },
                        //url: $rootScope.baseAddress + "/api/Conciliaciones/ConciliacionesByCliente/" + authorizationService.getId(),
                        dataType: "json",
                        beforeSend: $rootScope.beforeSendRequest
                    }
                },
                requestStart: function (e) {
                    kendo.ui.progress($("#divConciliacionesEnvia"), true);
                },
                requestEnd: function (e) {
                    kendo.ui.progress($("#divConciliacionesEnvia"), false);
                },
                group: "Estado",
                pageSize: 10,
                serverPaging: true,
                serverSorting: true
            },
            sortable: true,
            pageable: true,
            //filterable: {
            //    field: "AfiliadosCliente.Afiliado.Cliente.Tercero.Nombre",
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
                    return data.lenght;
                },
                model: {
                    fields: {
                        "AfiliadosCliente.Cliente.Tercero.Nombre": { type: "string" },
                        "Fecha": { type: "date" },
                        "Valor": { type: "number" }
                    }
                }
            },
            headerTemplate: "${value}",
            template: kendo.template($("#tmpConciliacionxAliado").html()),
        };

        $scope.Prev10 = true;
        $scope.Next10 = false;
        $scope.page10 = 0;
        $scope.rows10 = 10;
        $scope.filter10 = null;

        $scope.conciliacionClientesGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        
                        url: function () {
                            return $rootScope.baseAddress + "/api/Conciliaciones/ConciliacionespaginadasByAliado/" + authorizationService.getId() + "/" + $scope.page10 + "/" + $scope.rows10 + "/" + $scope.filter10
                           
                        },
                        
                        //url: $rootScope.baseAddress + "/api/Conciliaciones/ConciliacionesByAliado/" + authorizationService.getId(),
                        dataType: "json",
                        beforeSend: $rootScope.beforeSendRequest
                    }
                },
requestStart: function (e) {
    kendo.ui.progress($("#GridConciliaciones2"), true);
},
requestEnd: function (e) {
    kendo.ui.progress($("#GridConciliaciones2"), false);
},
                group: "Estado",
                pageSize: 100,
                serverPaging: true,
                serverSorting: true
            },
            sortable: true,
            pageable: true,
            //filterable: {
            //    field: "AfiliadosCliente.Cliente.Tercero.Nombre",
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
                    return data.lenght;
                },
                model: {
                    fields: {
                        "AfiliadosCliente.Cliente.Tercero.Nombre": { type: "string" },
                        "Fecha": { type: "date" },
                        "Valor": { type: "number" }
                    }
                }
            },
            headerTemplate: "${value}",
            template: kendo.template($("#tmpConciliacionxCliente").html()),
        };


        //ConciliacionespaginadasByCliente Prev
        $scope.ConciliacionespaginadasByClientePrev = function () {
            //debugger;
            $scope.pagina = $scope.pagina - 1;
            $scope.Rows8 = 10;
            $scope.Next8 = false;
            if ($scope.pagina == 0)
                $scope.Prev8 = true;
            angular.element("#divConciliacionesEnvia").data("kendoMobileListView").dataSource.read();
            angular.element("#divConciliacionesEnvia").data("kendoMobileListView").refresh();

        };

        //ConciliacionespaginadasByCliente Next
        $scope.ConciliacionespaginadasByClienteNext = function () {
            //debugger;
            $scope.pagina = $scope.pagina + 1;
            $scope.Rows8 = 10;
            if ($scope.pagina > 0)
                $scope.Prev8 = false;
            var ConciliacionespaginadasByCliente = conciliacionesService.ConciliacionesPaginadosByCliente(authorizationService.getId(), $scope.pagina, $scope.rows8, $scope.filter8)
            angular.element("#divConciliacionesEnvia").data("kendoMobileListView").dataSource.read();
            angular.element("#divConciliacionesEnvia").data("kendoMobileListView").refresh();

            ConciliacionespaginadasByCliente.then(function (p1) {
                var ben = p1.data;
                if (ben.length < 10)
                    $scope.Next8 = true;
            })
        };

        //ConciliacionespaginadasByCliente filtrar
        $scope.ConciliacionespaginadasByClienteFiltrar = function () {
            $scope.pagina = 0;
            $scope.filter8;
            $scope.Next8 = false;
            if ($scope.filter8 == "")
                $scope.filter8 = "null"
            angular.element("#divConciliacionesEnvia").data("kendoMobileListView").dataSource.read();
            angular.element("#divConciliacionesEnvia").data("kendoMobileListView").refresh();
            var ConciliacionespaginadasByCliente = conciliacionesService.ConciliacionesPaginadosByCliente(authorizationService.getId(), $scope.pagina, $scope.rows8, $scope.filter8)
            ConciliacionespaginadasByCliente.then(function (p1) {
                var ben = p1.data;
                if (ben.length < 10)
                    $scope.Next8 = true;
            })
            $scope.filter8 = null;
        }

        //ConciliacionespaginadasByAliado Prev
        $scope.ConciliacionespaginadasByAliadoPrev = function () {
            //debugger;
            $scope.page10 = $scope.page10 - 1;
            $scope.Rows10 = 10;
            $scope.Next10 = false;
            if ($scope.page10 == 0)
                $scope.Prev10 = true;
            angular.element("#GridConciliaciones2").data("kendoMobileListView").dataSource.read();
            angular.element("#GridConciliaciones2").data("kendoMobileListView").refresh();

        };

        //ConciliacionespaginadasByAliado Next
        $scope.ConciliacionespaginadasByAliadoNext = function () {
            //debugger;
            $scope.page10 = $scope.page10 + 1;
            $scope.Rows10 = 10;
            if ($scope.page10 > 0)
                $scope.Prev10 = false;
            var ConciliacionespaginadasByAliado = conciliacionesService.ConciliacionesPaginadosByAliado(authorizationService.getId(), $scope.page10, $scope.rows10, $scope.filter10)
            angular.element("#GridConciliaciones2").data("kendoMobileListView").dataSource.read();
            angular.element("#GridConciliaciones2").data("kendoMobileListView").refresh();

            ConciliacionespaginadasByAliado.then(function (p1) {
                var ben = p1.data;
                if (ben.length < 10)
                    $scope.Next10 = true;
            })
        };

        //ConciliacionespaginadasByAliado filtrar
        $scope.ConciliacionespaginadasByAliadoFiltrar = function () {
            $scope.page10 = 0;
            $scope.filter10;
            $scope.Next10 = false;
            if ($scope.filter10 == "")
                $scope.filter10 = "null"
            angular.element("#GridConciliaciones2").data("kendoMobileListView").dataSource.read();
            angular.element("#GridConciliaciones2").data("kendoMobileListView").refresh();
            var ConciliacionespaginadasByAliado = conciliacionesService.ConciliacionesPaginadosByAliado(authorizationService.getId(), $scope.page10, $scope.rows10, $scope.filter10)
            ConciliacionespaginadasByAliado.then(function (p1) {
                var ben = p1.data;
                if (ben.length < 10)
                    $scope.Next10 = true;
            })
            $scope.filter10 = null;
        }
    };

})();