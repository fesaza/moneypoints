(function () {
    'use strict';


    angular.module("moneyPointsApp").controller('clientesController', ['$http', '$scope', '$rootScope', 'clientesService', clientesController]);

    function clientesController($http, $scope, $rootScope, clientesService) {
        var dataSource = {
            type: "odata",
            transport: {
                read: {
                    url: $rootScope.baseAddress + "/api/clientes",
                    dataType: "json",
                    beforeSend: $rootScope.beforeSendRequest
                },
                parameterMap: function (options, type) {
                    var paramMap = kendo.data.transports.odata.parameterMap(options);
                    //delete paramMap.$inlinecount; // <-- quitar parametro inlinecount
                    return paramMap;
                }
            }, requestStart: function (e) {
                kendo.ui.progress($("#example"), true);
            },
            requestEnd: function (e) {
                kendo.ui.progress($("#example"), false);
            },
            pageSize: 100,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            schema: {
                data: function (data) {
                    return data; // <-- The result is just the data, it doesn't need to be unpacked.
                },
                total: function (data) {
                    return data.length; // <-- The total items count is the data length, there is no .Count to unpack.
                }
            }
        };

        $scope.source = dataSource;

        $scope.clientesGridOptions = {
            dataSource: dataSource,
            sortable: true,
            pageable: true,
            filterable: {
                field: "Tercero.Nombre",
                operator: "contains"
            },

            schema: {
                data: function (data) {
                    return data;
                },
                total: function () {
                    return 100;
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


    };


})();