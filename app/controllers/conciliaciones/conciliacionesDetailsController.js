
(function () {
    'use strict';

    angular.module("moneyPointsApp").controller('conciliacionesDetailsController', ['$rootScope', '$scope',
        '$routeParams', 'conciliacionesService', 'authorizationService', conciliacionesDetailsController]);

    function conciliacionesDetailsController($rootScope, $scope, $routeParams, conciliacionesService, authorizationService) {

        var conciliacionId = $routeParams.conciliacionId;
        $scope.conciliacion = {};

        if (!conciliacionId || conciliacionId == 0) {
            $scope.isEditing = false;
        } else {
            $scope.isEditing = true;

            //Obtener la conciliacion
            conciliacionesService.get(conciliacionId).then(function (pl) {
                var res = pl.data;
                $scope.conciliacion = res;
            }, function (errorPl) {
                handleError(errorPl);
            });
        }

        //Guardar Conciliación
        $scope.guardarConciliacion = function () {
            if (!$scope.isEditing) {
                if (!$scope.conciliacion.AfiliadosClienteId) {
                    new PNotify({
                        text: 'Seleccione un aliado',
                        type: 'danger',
                        delay: 3000
                    });
                    return;
                }
                var promiseGuardarConciliacion = conciliacionesService.post($scope.conciliacion);
                promiseGuardarConciliacion.then(function (pl) {
                    new PNotify({
                        text: 'Se insertó Correctamente',
                        type: 'info',
                        delay: 3000
                    });
                    $scope.goPath('/conciliaciones');
                },
                function (errorPl) {
                    handleError(errorPl);
                });
            } else {
                conciliacionesService.put(conciliacionId, $scope.conciliacion).then(function (pl) {
                    new PNotify({
                        text: 'Se modificó Correctamente',
                        type: 'info',
                        delay: 3000
                    });
                    $scope.goPath('/conciliaciones');
                },
                function (errorPl) {
                    handleError(errorPl);
                });
            }
        };
        //fin scope

        //Eliminar Conciliación
        $scope.deleteConciliacion = function () {
  
            var kendoWindow = $("<div />").kendoWindow({
                title: "Confirmación",
                resizable: false,
                modal: true
            });

            kendoWindow.data("kendoWindow")
                .content($("#delete-confirmation").html())
                .center().open();

            kendoWindow
                .find(".delete-confirm,.delete-cancel")
                    .click(function () {
                        if ($(this).hasClass("delete-confirm")) {
                            var promiseDeleteConciliacion = conciliacionesService.delete($scope.conciliacion.ConciliacionId);
                            promiseDeleteConciliacion.then(function (pl) {
                                new PNotify({
                                    text: 'Se eliminó Correctamente',
                                    type: 'info',
                                    delay: 3000
                                });
                                $scope.goPath('/conciliaciones');
                            },
                            function (errorPl) {
                                handleError(errorPl);
                            });
                        }

                        kendoWindow.data("kendoWindow").close();
                    })
                    .end()

        };
        //fin scope

       
        //select
        $scope.SeleccionarOptions = {
            dataSource: {
                transport: {
                    read: {
                        dataType: "json",
                        url: $rootScope.baseAddress + "/api/AfiliadosClientes/AfiliadosClientesByCliente/" + authorizationService.getId(),
                        beforeSend: $rootScope.beforeSendRequest
                    }
                },
                serverFiltering: true
            },
            index: -1,
            optionLabel: "Seleccione un aliado",
            dataTextField: "Afiliado.Cliente.Tercero.Nombre",
            dataValueField: "AfiliadosClienteId",
            change: function () {

            }
        };
        //fin
    };
})();