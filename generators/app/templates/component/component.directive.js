/**
 *
 */

(function () {
    'use strict';

    angular
        .module('mnSearchbarDirective', [])
        .directive('mnSearchbar', mnSearchbar);

    /**
     * @return {[type]} [description]
     * @ngInject
     */
    function mnSearchbar () {
        return {
            restrict: 'E',
            templateUrl: getView('mn-searchbar')
        };
    }

})();
