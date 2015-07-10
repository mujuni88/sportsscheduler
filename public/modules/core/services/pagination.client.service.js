'use strict';

angular.module('groups').factory('PaginationService', PaginationService);

function PaginationService($http) {
    function Pagination(url) {
        this.url = url || '';
    }

    Pagination.prototype = {
        getResultsPage: function (pageNumber, count) {
            return $http.get(this.url + '?page=' + pageNumber + '&count=' + count)
                .then(function (result) {
                    return result.data;
                });
        }
    };

    return Pagination;
}
