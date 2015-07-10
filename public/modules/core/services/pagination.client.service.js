'use strict';

angular.module('groups').factory('PaginationService', PaginationService);

function PaginationService($http) {
    function Pagination(url) {
        this.url = url || '';
    }

    Pagination.prototype = {
        getResultsPage: getResultsPage
    };

    function getResultsPage(pageNumber) {
        return $http.get(this.url + '?page=' + pageNumber)
            .then(function (result) {
                return result.data;
            });
    }

    return Pagination;
}
