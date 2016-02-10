(function () {
    'use strict';

    angular.module("moneyPointsApp").controller('clientesDetailsController', ['$rootScope',
    '$scope', '$routeParams', 'clientesService', 'beneficiariosService', 'equivalenciasService', 'afiliadosClientesService', 'authorizationService', 'Base64',
    clientesDetailsController]);

    function clientesDetailsController($rootScope, $scope, $routeParams, clientesService, beneficiariosService,
        equivalenciasService, afiliadosClientesService, authorizationService, Base64) {

        var clienteId = $routeParams.ClienteId;
        $scope.onlyNumber = /^\d+$/;
       
        $scope.canDelete = false;
        $scope.canCancel = false;
        $scope.isDeleting = false;

        var user = authorizationService.getCurrentUser();
        if (user && user.rolId == 1) {
            $scope.canDelete = true;
            $scope.canCancel = true;
        }

        if (clienteId == 0) {
            $scope.IsEditing = false;
            $scope.canDelete = false;
        } else {
            var promiseGetCliente = clientesService.get(clienteId);
            //divDetailCliente

            promiseGetCliente.then(function (pl) {
                var res = pl.data;
                $scope.cliente = res;
                $scope.IsEditing = true;

                //Datasource de equivalencias del cliente

            },
             function (errorPl) {
                 handleError(errorPl);
             });
        }


        //fin

        //Guardar Cliente
        $scope.guardarCliente = function () {
            //debugger;
            $scope.Load = true;
            if ($scope.isDeleting) return;
            kendo.ui.progress($("#divDetailCliente"), true);
            if ($scope.IsEditing) {
                var promiseGuardarCliente = clientesService.put($scope.cliente.ClienteId, $scope.cliente);
                promiseGuardarCliente.then(function (pl) {
                    new PNotify({
                        text: 'Se Actualizó correctamente el cliente',
                        type: 'info',
                        delay: 3000
                    });
                    kendo.ui.progress($("#divDetailCliente"), false);
                        if (user && user.rolId == 1) {
                            $scope.goPath('/clientes');
                        }
                    },
                function (errorPl) {
                    $scope.Load = false;
                    handleError(errorPl);
                    kendo.ui.progress($("#divDetailCliente"), false);
                });
            } else {
                $scope.cliente.Tercero.Usuarios = [];
                $scope.cliente.Tercero.Usuarios[0] = {
                    Login: $scope.security.Login,
                    Password: Base64.encode($scope.security.newClave)
                };

                var promiseGuardarCliente = clientesService.post($scope.cliente);
                promiseGuardarCliente.then(function (pl) {
                    new PNotify({
                        text: 'Se insertó Correctamente el Cliente',
                        type: 'info',
                        delay: 3000
                    });
                    kendo.ui.progress($("#divDetailCliente"), false);
                    $scope.goPath('/clientes');
                },
                function (errorPl) {
                    $scope.Load = false;
                    handleError(errorPl);
                    kendo.ui.progress($("#divDetailCliente"), false);
                });
            }

            //fin
        };

        //Eliminar cliente
        $scope.deleteCliente = function () {
            $scope.isDeleting = true;
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
                            $scope.isDeleting = true;
            kendo.ui.progress($("#divDetailCliente"), true);
            var promiseDeleteCliente = clientesService.delete($scope.cliente.ClienteId);
            promiseDeleteCliente.then(function (pl) {
                new PNotify({
                    text: 'Se Eliminó Correctamente el Cliente',
                    type: 'info',
                    delay: 3000
                });
                //$scope.goPath('/clientes');
                kendo.ui.progress($("#divDetailCliente"), false);
                $scope.goPath('/clientes');
            },
            function (errorPl) {
                handleError(errorPl);
                console.log('Error eliminando cliente', errorPl);
                kendo.ui.progress($("#divDetailCliente"), false);
            });
                        }

                        kendoWindow.data("kendoWindow").close();
                    })
                    .end()
            
        };
    };

})();

