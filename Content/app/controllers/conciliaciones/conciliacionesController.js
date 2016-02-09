
(function () {
    'use strict';

    angular.module("moneyPointsApp").controller('conciliacionesController', ['$scope', '$rootScope', '$routeParams', 'conciliacionesService', 'authorizationService', conciliacionesController]);

    function conciliacionesController($scope, $rootScope, $routeParams, conciliacionesService, authorizationService) {
        //$scope.Prev3 = true;
        //$scope.Next3 = false;
        //$scope.page3 = 0;
        //$scope.rows3 = 10;
        //$scope.filter3 = null;

        //ConciliacionAfiliadosClientes
        $scope.conciliacionAliadosGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        //url: function () {
                        //    return $rootScope.baseAddress + "/api/Conciliaciones/ConciliacionespaginadasByCliente/"+authorizationService.getId()+"/" + $scope.page3 + "/" + $scope.rows3 + "/" + $scope.filter3
                        //},
                        url: $rootScope.baseAddress + "/api/Conciliaciones/ConciliacionesByCliente/" + authorizationService.getId(),
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
            filterable: {
                field: "AfiliadosCliente.Afiliado.Cliente.Tercero.Nombre",
                operator: "contains"
            },
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

        //$scope.Prev4 = true;
        //$scope.Next4 = false;
        //$scope.page4 = 0;
        //$scope.rows4 = 10;
        //$scope.filter4 = null;
        $scope.conciliacionClientesGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        //url: function () {
                        //    return $rootScope.baseAddress + "/api/Conciliaciones/ConciliacionespaginadasByAliado/" + authorizationService.getId() +"/"+ $scope.page4 + "/" + $scope.rows4 + "/" + $scope.filter4
                        //},
                        url: $rootScope.baseAddress + "/api/Conciliaciones/ConciliacionesByAliado/" + authorizationService.getId(),
                        dataType: "json",
                        beforeSend: $rootScope.beforeSendRequest
                    }
                },
                //requestStart: function (e) {
                //    kendo.ui.progress($("#divConciliacionesEnvia2"), true);
                //},
                //requestEnd: function (e) {
                //    kendo.ui.progress($("#divConciliacionesEnvia2"), false);
                },
                group: "Estado",
                pageSize: 100,
                serverPaging: true,
                serverSorting: true
            },
            sortable: true,
            pageable: true,
            filterable: {
                field: "AfiliadosCliente.Cliente.Tercero.Nombre",
                operator: "contains"
            },
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


        ////ConciliacionesByCliente paginados Prev
        //$scope.ConciliacionesByClientePaginadosPrev = function () {
        //    //debugger;
        //    $scope.page3 = $scope.page3 - 1;
        //    $scope.Rows3 = 10;
        //    $scope.Next3 = false;
        //    if ($scope.page3 == 0)
        //        $scope.Prev3 = true;
        //    angular.element("#divConciliacionesEnvia").data("kendoMobileListView").dataSource.read();
        //    angular.element("#divConciliacionesEnvia").data("kendoMobileListView").refresh();

        //};

        ////ConciliacionesByCliente paginados Next
        //$scope.ConciliacionesByClientePaginadosNext = function () {
        //    //debugger;
        //    $scope.page3 = $scope.page3 + 1;
        //    $scope.Rows3 = 10;
        //    if ($scope.page3 > 0)
        //        $scope.Prev3 = false;
        //    var ConciliacionesByCliente = conciliacionesService.ConciliacionesPaginadosByCliente(authorizationService.getId(), $scope.page3, $scope.rows3, $scope.filter3)
        //    angular.element("#divConciliacionesEnvia").data("kendoMobileListView").dataSource.read();
        //    angular.element("#divConciliacionesEnvia").data("kendoMobileListView").refresh();

        //    ConciliacionesByCliente.then(function (p1) {
        //        var Con = p1.data;
        //        if (Con.length < 10)
        //            $scope.Next3 = true;
        //    })
        //};

        ////ConciliacionesByCliente Paginados filtrar
        //$scope.ConciliacionesByClienteFiltrar = function () {
        //    $scope.page3 = 0;
        //    $scope.filter3;
        //    $scope.Next3 = false;
        //    if ($scope.filter3 == "")
        //        $scope.filter3 = "null"
        //    angular.element("#divConciliacionesEnvia").data("kendoMobileListView").dataSource.read();
        //    angular.element("#divConciliacionesEnvia").data("kendoMobileListView").refresh();
        //    var ConciliacionesByCliente = conciliacionesService.ConciliacionesPaginadosByCliente(authorizationService.getId(), $scope.page3, $scope.rows3, $scope.filter3)
        //    ConciliacionesByCliente.then(function (p1) {
        //        var con = p1.data;
        //        if (con.length < 10)
        //            $scope.Next3 = true;
        //    })
        //    $scope.filter3 = null;
        //}

        ////ConciliacionesByAliado paginados Prev
        //$scope.ConciliacionesByAliadoPaginadosPrev = function () {
        //    //debugger;
        //    $scope.page4 = $scope.page4 - 1;
        //    $scope.Rows4 = 10;
        //    $scope.Next4 = false;
        //    if ($scope.page4 == 0)
        //        $scope.Prev4 = true;
        //    angular.element("#divConciliacionesEnvia2").data("kendoMobileListView").dataSource.read();
        //    angular.element("#divConciliacionesEnvia2").data("kendoMobileListView").refresh();

        //};

        ////ConciliacionesByAliado paginados Next
        //$scope.ConciliacionesByAliadoPaginadosNext = function () {
        //    //debugger;
        //    $scope.page4 = $scope.page4 + 1;
        //    $scope.Rows4 = 10;
        //    if ($scope.page4 > 0)
        //        $scope.Prev4 = false;
        //    var ConciliacionesByAliado = conciliacionesService.ConciliacionesPaginadosByAliado(authorizationService.getId(), $scope.page4, $scope.rows4, $scope.filter4)
        //    angular.element("#divConciliacionesEnvia2").data("kendoMobileListView").dataSource.read();
        //    angular.element("#divConciliacionesEnvia2").data("kendoMobileListView").refresh();

        //    ConciliacionesByAliado.then(function (p1) {
        //        var Con = p1.data;
        //        if (Con.length < 10)
        //            $scope.Next4 = true;
        //    })
        //};

        ////ConciliacionesByAliado Paginados filtrar
        //$scope.ConciliacionesByAliadoFiltrar = function () {
        //    $scope.page4 = 0;
        //    $scope.filter4;
        //    $scope.Next4 = false;
        //    if ($scope.filter4 == "")
        //        $scope.filte4 = "null"
        //    angular.element("#divConciliacionesEnvia2").data("kendoMobileListView").dataSource.read();
        //    angular.element("#divConciliacionesEnvia2").data("kendoMobileListView").refresh();
        //    var ConciliacionesByAliado = conciliacionesService.ConciliacionesPaginadosByAliado(authorizationService.getId(), $scope.page4, $scope.rows4, $scope.filter4)
        //    ConciliacionesByAliado.then(function (p1) {
        //        var con = p1.data;
        //        if (con.length < 10)
        //            $scope.Next4 = true;
        //    })
        //    $scope.filter4 = null;
        //}

    };

})();