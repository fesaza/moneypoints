﻿angular.module('moneyPointsApp').service('beneficiariosClienteService', function ($http, $rootScope) {

    //Create new beneficiariosCliente
    this.post = function (beneficiariosCliente) {
        var request = $http({
            method: "post",
            url: $rootScope.baseAddress + "/api/beneficiariosClientes",
            data: beneficiariosCliente
        });
        return request;
    }

    //Get beneficiariosCliente
    this.get = function (beneficiariosClienteId) {
        return $http.get($rootScope.baseAddress + "/api/BeneficiariosClientes/" + beneficiariosClienteId);
    }

    //Get todos los beneficiariosClientes
    this.getbeneficiariosClientes = function () {
        return $http.get($rootScope.baseAddress + "/api/beneficiariosClientes");
    }

    //Update beneficiariosClientes
    this.put = function (beneficiariosClienteId, beneficiariosCliente) {
        var request = $http({
            method: "put",
            url: $rootScope.baseAddress + "/api/beneficiariosClientes/" + beneficiariosClienteId,
            data: beneficiariosCliente
        });
        return request;
    }
    //Delete beneficiariosClientes
    this.delete = function (beneficiariosClienteId) {
        var request = $http({
            method: "delete",
            url: $rootScope.baseAddress + "/api/beneficiariosClientes/" + beneficiariosClienteId
        });
        return request;
    }

    //BeneficiariosClientes con paginacion
    this.BeneficiariosClientesPaginados = function (clienteid,page, rows, filter) {
        return $http.get($rootScope.baseAddress + "/api/BeneficiariosClientes/BeneficiariosClientesByClientePaginado/" + clienteid + "/" + page + "/" + rows + "/" + filter);
    }

//BeneficiariosClientes con paginacion
    this.GetCuentasByAliadoAndBeneficiarioPaginado = function (aliadoId, BeneficiarioId, page, rows, filter) {
        return $http.get($rootScope.baseAddress + "/api/BeneficiariosClientes/GetCuentasByAliadoAndBeneficiarioPaginado/" + aliadoId + "/" + BeneficiarioId + "/" + page + "/" + rows + "/" + filter);
    }

    this.GetBeneficiariosByCliente = function (ClienteId) {
        return $http.get($rootScope.baseAddress + "/api/BeneficiariosClientes/BeneficiariosClientesByCliente/" + ClienteId);
    }
});