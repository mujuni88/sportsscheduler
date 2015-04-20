'use strict';

//Setting up route
angular.module('groups').config(['$stateProvider',
    function ($stateProvider) {
        // Groups state routing
        $stateProvider.
            state('listGroups', {
                url: '/groups',
                templateUrl: 'modules/groups/views/list-groups.client.view.html'
            }).
            state('createGroup', {
                url: '/groups/create',
                templateUrl: 'modules/groups/views/create-group.client.view.html'
            }).
            state('viewGroup', {
                url: '/groups/:groupId',
                templateUrl: 'modules/groups/views/view-group.client.view.html'
            }).
            state('viewGroup.listMembers', {
                url: '/members',
                templateUrl: 'modules/groups/views/view-members-group.client.view.html'
            }).
            state('viewGroup.listMembers.viewMembers', {
                url: '/list',
                templateUrl: 'modules/groups/views/list-members-group.client.view.html'
            }).
            state('viewGroup.listMembers.addMembers', {
                url: '/add',
                templateUrl: 'modules/groups/views/add-members-group.client.view.html'
            }).
            state('viewGroup.listEvents', {
                url: '/events',
                templateUrl: 'modules/groups/views/view-events-group.client.view.html'
            }).
            state('viewGroup.listEvents.viewEvents', {
                url: '/list',
                templateUrl: 'modules/groups/views/list-events-group.client.view.html'
            }).
            state('viewGroup.listEvents.addEvents', {
                url: '/add',
                templateUrl: 'modules/groups/views/add-events-group.client.view.html'
            }).
            state('viewGroup.listEvents.viewEvent', {
                url: '/:eventId',
                templateUrl: 'modules/groups/views/view-event-group.client.view.html'
            }).
            state('viewGroup.listEvents.editEvent', {
                url: '/:eventId/edit',
                templateUrl: 'modules/groups/views/edit-event-group.client.view.html'
            });
    }
]);
