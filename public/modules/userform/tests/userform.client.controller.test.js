'use strict';

(function () {
    // Userform Controller Spec
    describe('Userform Controller Tests', function () {
        // Initialize global variables
        var UserformController,
            scope,
            $httpBackend,
            $stateParams,
            $location,
            UserFormService;

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function () {
            jasmine.addMatchers({
                toEqualData: function (util, customEqualityTesters) {
                    return {
                        compare: function (actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Then we can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service.
        beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Userform_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;
            UserFormService = _Userform_;

            // Initialize the Userform controller.
            UserformController = $controller('UserformController', {
                $scope: scope
            });
        }));

        // testing service whether it's saving
        describe('UserFormService tests', function () {

            var info = {
                    phone: '1234567890',
                    email: 'jbuza@cspire.com'
                },
                info2 = {
                    phone: '2232232222',
                    email: 'jj@cc.com'
                }, id = null, user;

            var resp = {
                id: 123
            };


            it('should add user', function () {

                $httpBackend.expectPOST('/test').respond(resp);

                    UserFormService.save(info)
                    .$promise.then(function (data) {
                        console.log(data);
                        user.$get({email: info.email});
                        expect(user.id).not.toBe(null);
                        expect(user.phone).toBe(info.phone);
                        expect(user.email).toBe(info.email);
                        done();
                    }, function (data) {
                        console.log('ERROR');
                    });

            });
            it('should retrieve the added user', function () {

            });

            it('should update user info', function () {
//                user.$update(info2);
//                console.log(user);
//
//                expect(user.id).not.toBe(null);
//                expect(user.phone).toBe(info2.phone);
//                expect(user.email).toBe(info2.email);

            });
            it('should delete added user', function () {
//                user.delete({id:id});

            });

        });

    });
}());