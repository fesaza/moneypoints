(function () {
    'use strict';


    angular.module("moneyPointsApp").controller('beneficiariosController', ['$scope', '$rootScope', 'beneficiariosService', beneficiariosController]);

    function beneficiariosController($scope, $rootScope, beneficiariosService) {

      
        $scope.TotalPages = 0;
        $scope.Prev = true;
        $scope.Next = false;
        $scope.page = 0;
        $scope.rows = 10;
        $scope.filter = null;
        $scope.ShowPagingbeneficiario = false;

        $scope.ConsularBeneficiarios = beneficiariosService.getbeneficiarios();

          $scope.ConsularBeneficiarios.then(function (pl) {
              //debugger;
              var res = pl.data;
              $scope.ListBeneficiarios = res;
              $scope.TotalPages = Math.ceil($scope.ListBeneficiarios.length / $scope.rows);
              if ($scope.ListBeneficiarios.length > $scope.rows)
                  $scope.ShowPagingbeneficiario = true;
              else
                  $scope.ShowPagingbeneficiario = false;
          
          })

        $scope.beneficiariosGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        url: function () {
                            return $rootScope.baseAddress + "/api/Beneficiarios/Paginado/" + $scope.page + "/" + $scope.rows+"/"+$scope.filter
                        },
                        dataType: "json",
                        //url: $rootScope.baseAddress + "/api/beneficiarios", dataType: "json",
                        //data:$scope.Lista,
                        beforeSend: $rootScope.beforeSendRequest
                    },
                    parameterMap: function (options, type) {
                        var paramMap = kendo.data.transports.odata.parameterMap(options);
                        delete paramMap.$inlinecount; // <-- quitar parametro inlinecount
                        return paramMap;
                    }
                },
                requestStart: function (e) {
                    kendo.ui.progress($("#gridBeneficiarios"), true);
                },
                requestEnd: function (e) {
                    kendo.ui.progress($("#gridBeneficiarios"), false);
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
                        "Tercero.Apellidos": { type: "string" },
                        "Tercero.Telefono": { type: "string" },
                    }
                }
            },
            template: kendo.template($("#rowBeneficiariosTemplate2").html()),
        };

        //Beneficiarios paginados Prev
        $scope.BeneficiariosPaginadosPrev = function () {
            //debugger;
            $scope.page = $scope.page - 1;
            $scope.Rows = 10;
            $scope.Next = false;
            if ($scope.page == 0)
                $scope.Prev = true;
            angular.element("#gridBeneficiarios").data("kendoMobileListView").dataSource.read();
            angular.element("#gridBeneficiarios").data("kendoMobileListView").refresh();

        };

        //Beneficiarios paginados Next
        $scope.BeneficiariosPaginadosNext = function () {
            //debugger;
            $scope.page = $scope.page + 1;
            $scope.Rows = 10;
            if ($scope.page > 0)
                $scope.Prev = false;
            if ($scope.page == ($scope.TotalPages - 1))
                $scope.Next = true;
           angular.element("#gridBeneficiarios").data("kendoMobileListView").dataSource.read();
           angular.element("#gridBeneficiarios").data("kendoMobileListView").refresh();

        };

        //Beneficiarios Paginados filtrar
        $scope.BeneficiariosFiltrar = function()
        {
            $scope.page = 0;
            $scope.filter;
            $scope.Prev = true;
            if ($scope.TotalPages > 1)
                $scope.ShowPagingbeneficiario = true;

            if ($scope.filter == "")
                $scope.filter = "null"
            angular.element("#gridBeneficiarios").data("kendoMobileListView").dataSource.read();
            angular.element("#gridBeneficiarios").data("kendoMobileListView").refresh();
            var beneficiarios = beneficiariosService.BeneficiariosPaginados($scope.page, $scope.rows, $scope.filter)
            beneficiarios.then(function (p1) {
                var ben = p1.data;
                if (ben.length < 10)
                    $scope.ShowPagingbeneficiario = false;
            })
            $scope.filter = null;
        }
    };
})();