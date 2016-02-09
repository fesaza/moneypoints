(function () {
    'use strict';

    angular.module("moneyPointsApp").controller('beneficiariosDetailsController', ['$rootScope', '$scope', '$routeParams', 'beneficiariosService', 'authorizationService', 'Base64', beneficiariosDetailsController]);

    function beneficiariosDetailsController($rootScope, $scope, $routeParams, beneficiariosService, authorizationService, Base64) {      
    
        var beneficiarioId = $routeParams.beneficiarioId;
        if (beneficiarioId.indexOf("-cuenta") > -1) {
            var splitbenificarioId = beneficiarioId.split('-');
            beneficiarioId = splitbenificarioId[0];
            var tabCuenta = angular.element(document.querySelector('#cuenta'));
            tabCuenta.addClass('k-state-active');
            //var tabPerfil = angular.element(document.querySelector('#perfil'));
            //tabPerfil.removeClass('k-state-active');
        }
        else {
            var tabPerfil = angular.element(document.querySelector('#perfil'));
            tabPerfil.addClass('k-state-active');
            // var tabCuenta = angular.element(document.querySelector('#cuenta'));
            //tabCuenta.removeClass('k-state-active');
        }
        $scope.onlyNumber = /^\d+$/;
        $scope.canDelete = false;
        $scope.canCancel = false;
        $scope.isDeleting = false;

        var user = authorizationService.getCurrentUser();
       
        if (user && user.rolId == 1) {
           
            $scope.canDelete = true;
            $scope.canCancel = true;
        }

        if (beneficiarioId == 0) {
            $scope.IsEditing = false;
            $scope.showEstados = false;
            $scope.canCancel = true;
            $scope.canDelete = false;
        } else {
            $scope.showEstados = true;
            var promiseGetbeneficiario = beneficiariosService.get(beneficiarioId);

            promiseGetbeneficiario.then(function (pl) {
                var res = pl.data;
                $scope.beneficiario = res;
                $scope.IsEditing = true;

            },
             function (errorPl) {
                 handleError(errorPl);
                 console.log('Error cargando beneficiario', errorPl);
             });

            //Consultar estados de cuentas
            $scope.cuentasBeneficiarioOptions = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: {
                            url: $rootScope.baseAddress + "/api/BeneficiariosClientes?$filter=BeneficiarioId eq " + beneficiarioId,
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
                        kendo.ui.progress($("#gridCuentasBeneficiario"), true);
                    },
                    requestEnd: function (e) {
                        kendo.ui.progress($("#gridCuentasBeneficiario"), false);
                    },
                    pageSize: 50,
                    serverPaging: true,
                    serverSorting: true
                    
                },
                sortable: true,
                pageable: true,
                serverPaging: true,
                schema: {
                    model: {
                        fields: {
                            Saldo: { type: "number" },
                            Puntos: { type: "number" },
                            "Cliente.Tercero.Nombre": { type: "string" }
                        }
                    }
                },
                template: kendo.template($("#tmpCuentasBeneficiario").html()),
            };
        }


        //Guardar beneficiario
        $scope.guardarbeneficiario = function () {
            
            $scope.Load = true;
            if ($scope.isDeleting) return;
            if ($scope.IsEditing) {
                var promiseGuadarbeneficiario = beneficiariosService.put($scope.beneficiario.BeneficiarioId, $scope.beneficiario);
                    promiseGuadarbeneficiario.then(function (pl) {
                        
                    //$scope.mensaje = "Actualizado satisfactoriamente";
                    new PNotify({
                        text: 'Se actualizó la información correctamente.',
                        type: 'info',
                        delay: 3000
                    });

                    if (user && user.rolId == 1) {
                        $scope.goPath('/beneficiarios');
                    }
                    }, function (errorPl) {
                        $scope.Load = false;
                    handleError(errorPl);
                });
            } else {
               
                $scope.beneficiario.Tercero.Usuarios = [];
                $scope.beneficiario.Pin = Base64.encode($scope.security.newPIN);
                $scope.beneficiario.Tercero.Usuarios[0] = {
                    Login: $scope.security.Login,
                    Password: Base64.encode($scope.security.newClave),
                    IsActivo: 0 //inactivamos el usuario.
                };
       
                var promiseGuadarbeneficiario = beneficiariosService.post($scope.beneficiario);
                promiseGuadarbeneficiario.then(function (pl) {
                   
                    new PNotify({
                        text: 'Se insertó Correctamente',
                        type: 'info',
                        delay: 3000
                    });
                    //if ($scope.beneficiario.Tercero.TerceroId == undefined || $scope.beneficiario.Tercero.TerceroId == null || $scope.beneficiario.Tercero.TerceroId == 0) {
                    if (!$scope.hideMenus) {

                        $scope.goPath('/login');
                    } else {
                        debugger;
                        $scope.goPath('/beneficiarios');
                    }
                },
                function (errorPl) {
                    $scope.Load = false;
                    handleError(errorPl);
                });
            }
        };



        //Eliminar beneficiario
        $scope.deletebeneficiario = function (e) {
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
                            
                            var promiseDeletebeneficiario = beneficiariosService.delete($scope.beneficiario.BeneficiarioId);
                            promiseDeletebeneficiario.then(function (pl) {
                                //$scope.mensaje = "Eliminado satisfactoriamente.";
                                new PNotify({
                                    text: 'Se Eliminó correctamente',
                                    type: 'info',
                                    delay: 3000
                                });
                                $scope.goPath('/beneficiarios');
                            },
                            function (errorPl) {
                                handleError(errorPl);
                            });
                        }

                        kendoWindow.data("kendoWindow").close();
                    })
                    .end()
        };


    };

})();
