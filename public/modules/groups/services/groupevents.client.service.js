'use strict';
angular.module('groups').factory('GroupEvents', GroupEvents);

function GroupEvents($http, $q) {
    var service = {
        create: create,
        get: get,
        update: update,
        remove: remove
    },
        url = url;
    return service;

    function create(groupId, data) {
        var request = $http({
            method: "post",
            url: url(groupId),
            data: data
        });
        return (request.then(handleSuccess, handleError));
    }

    function get(groupId, eventId) {
        var request = $http({
            method: "get",
            url: url(groupId, eventId)
        });
        return (request.then(handleSuccess, handleError));
    }

    function update(groupId, eventId, data) {
    	var request = $http({
            method: "put",
            url: url(groupId, eventId),
            data:data
        });
        return (request.then(handleSuccess, handleError));
    }

    function remove(groupId, eventId) {
        var request = $http({
            method: "delete",
            url: url(groupId, eventId)
        });
        return (request.then(handleSuccess, handleError));
    }

    function handleError(response) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        
        if (!angular.isObject(response.data) || !response.data.message) {
            return ($q.reject("An unknown error occurred."));
        }
        // Otherwise, use expected error message.
        return ($q.reject(response.data.message));
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess(response) {
        return (response.data);
    }

    function url(groupId, eventId) {
        groupId = groupId ? groupId : '';
        eventId = eventId ? eventId : '';
        var api = 'api/users/groups/' + groupId + '/events/' + eventId,
            reg = /\/{2,}|\/+$/g;
        return api.replace(reg, replacer);

        function replacer(match) {
            return /\/{2,}/g.test(match) ? '/' : '';
        }
    }

}
