'use strict';

angular.module('validationrule', ['validation'])
    .config(['$validationProvider', function ($validationProvider) {

        var expression = {
            required: function (value) {
                return !!value;
            },
            email: /^.*@.*\..*[a-z]$/i,
            phone:/(\W|^)[(]{0,1}\d{3}[)]{0,1}[\s-]{0,1}\d{3}[\s-]{0,1}\d{4}(\W|$)/,
            zip:/^\d{5}(-\d{4})?$/,
            nospecialchars:/^[a-z0-9_\-\s]*$/i,
            alpha:/^[a-z]*$/i,
            nospace:/^[^\s]+$/,
            oneUpperCaseLetter:function(value){
                return (/^(?=.*[A-Z]).+$/).test(value);
            },
            oneLowerCaseLetter:function(value){
                return (/^(?=.*[a-z]).+$/).test(value);
            },
            oneNumber:function(value){
                return (/^(?=.*[0-9]).+$/).test(value);
            },
            oneAlphabet:function(value){
                return (/^(?=.*[a-z]).+$/i).test(value);
            },
            minlength:function(value, scope, element, attrs){
                var val = value || '';
                return val.length >= parseInt(attrs.ngMinlength, 10);
            },
            maxlength:function(value, scope, element, attrs){
                var val = value || '';

                if (val.length <= parseInt(attrs.ngMaxlength, 10)) {
                    return true;
                } else {
                    return false;
                }
            }
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
            },
            nospecialchars:{
                error:'Valid characters are: A-Z, a-z, 0-9'
            },
            alpha:{
                error:'Valid characters are: A-Z, a-z'
            },
            nospace:{
                error:'Cannot contain any spaces'
            },
            oneUpperCaseLetter:{
                error:'Must contain at least one uppercase letter.'
            },
            oneLowerCaseLetter:{
                error:'Must contain at least one lowercase letter'
            },
            oneNumber:{
                error:'Must contain at least one number'
            },
            oneAlphabet:{
                error:'Must contain at least one alphabet'
            }
        };

        $validationProvider.setErrorHTML(function (msg) {
            return  '<div class=\'has-error\'>' + msg + '</div>';
        });
        $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
        $validationProvider.showSuccessMessage = false;
        $validationProvider.showErrorMessage = true;



    }]);