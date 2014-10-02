'use strict';

angular.module('validationrule', ['validation'])
    .config(['$validationProvider', function ($validationProvider) {

        var expression = {
            required: function (value) {
                return !!value;
            },
            email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
            phone:/(\W|^)[(]{0,1}\d{3}[)]{0,1}[\s-]{0,1}\d{3}[\s-]{0,1}\d{4}(\W|$)/,
            zip:/^\d{5}(-\d{4})?$/
        };

        var defaultMsg = {
            required: {
                error: 'Required!!'
            },
            email: {
                error: 'Please enter a valid email'
            },
            phone: {
                error: 'Please enter a valid phone number'
            },
            zip: {
                error: 'Please enter a valid zip code'
            }
        };

        $validationProvider.setErrorHTML(function (msg) {
            return  '<div class=\'has-error\'>' + msg + '</div>';
        });
        $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
        $validationProvider.showSuccessMessage = false;
        $validationProvider.showErrorMessage = true;

    }]);