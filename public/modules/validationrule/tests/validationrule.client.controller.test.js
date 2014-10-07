'use strict';

(function() {
	// Validationservice Controller Spec
	describe('ValidationService Tests', function() {
		// Initialize global variables
		var scope,
			$httpBackend,
			$stateParams,
			$location,
            $validationProvider;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach( module(ApplicationConfiguration.applicationModuleName,function(_$validationProvider_){
            $validationProvider =  _$validationProvider_;
        }));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

		}));

        describe('Validation rule unit test', function(){
            var isValid = null;

            var validEmails = [
                'test@test.com',
                'test@test.co.uk',
                'test734ltylytkliytkryety9ef@jb-fe.com'
            ];

            var invalidEmails = [
                'test@testcom',
                'test@ test.co.uk',
                'ghgf@fe.com.co.',
                'tes@t@test.com',
                ''
            ];

            it('should validate emails correctly', inject(function() {
                var emailRegex = $validationProvider.getExpression('email');
                expect(emailRegex).not.toBe(null);

                // you can loop through arrays of test cases like this
                for (var i in validEmails) {
                    isValid = emailRegex.test(validEmails[i]);
                    expect(isValid).toBeTruthy();
                }
                for (var x in invalidEmails) {
                    isValid = emailRegex.test(invalidEmails[x]);
                    expect(isValid).toBeFalsy();
                }

            }));


            var validPhones = [
                '(662)1237747',
                '662-123-7747',
                '(662)-123-7747',
                '6621237747'
            ];
            var invalidPhones = [
                '',
                '12',
                '%$@',
                'abcaaaerer'
            ];
            it('should validate phones correctly', inject(function() {
                var phoneRegex = $validationProvider.getExpression('phone');
                expect(phoneRegex).not.toBe(null);

                // you can loop through arrays of test cases like this
                for (var i in validPhones) {
                    isValid = phoneRegex.test(validPhones[i]);
                    expect(isValid).toBeTruthy();
                }
                for (var x in invalidPhones) {
                    isValid = phoneRegex.test(invalidPhones[x]);
                    expect(isValid).toBeFalsy();
                }

            }));

            var validZips = [
                '12345',
                '12345-1234'
            ];

            var invalidZips = [
                '',
                '12',
                '123',
                '1223-1',
                '12345-124',
                'abc',
            ];
            it('should validate zips correctly', inject(function() {
                var zipRegex = $validationProvider.getExpression('zip');
                expect(zipRegex).not.toBe(null);

                // you can loop through arrays of test cases like this
                for (var i in validZips) {
                    isValid = zipRegex.test(validZips[i]);
                    expect(isValid).toBeTruthy();
                }
                for (var x in invalidZips) {
                    isValid = zipRegex.test(invalidZips[x]);
                    expect(isValid).toBeFalsy();
                }

            }));

        });


	});
}());