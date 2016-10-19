/**
 *  <%= camelCase %> View
 *  <%= description %>
 */

(function () {
    'use strict';

    angular
        .module('<%= camelCase %>View', [])
        .config(<%= camelCase %>Config);

    function <%= camelCase %>Config ($stateProvider) {
        $stateProvider
            .state('<%= state %>', {
                url: '<%= url %>',
				resolve:{
					<% for (var i = 0; i < params.length; i++){ %>
						<%= '\n\t\t\t\t\t'+params[i] + ': function($stateParams){ \n\t\t\t\t\t\treturn $stateParams.'+params[i]+'; \n\t\t\t\t\t}'%>
					<% } %>
				},
                views: {
                    'main@': {
                        templateUrl: getView('<%= camelCase %>'),
                        controller: <%= camelCase %>Ctrl,
                        controllerAs: '<%= controllerAs %>'
                    }
                }
            });
    }

    function <%= camelCase %>Ctrl ($scope) {

        var <%= controllerAs %> = this;

        <%= controllerAs %>.name = '<%= camelCase %>';

    }
})();


note: function ($stateParams) {
	return $stateParams.note;
}
