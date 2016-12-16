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
				resolve:{ <% for (var i = 0; i < params.length; i++){ -%> <%= '\n\t\t\t\t\t'+params[i] + ': function($stateParams){ \n\t\t\t\t\t\treturn $stateParams.'+params[i]+'; \n\t\t\t\t\t}'%><%=i < params.length - 1 ? ',' : ''%> <% } %>
				},
                views: {
                    'main@': {
                        templateUrl: getTemplateUrl('<%= camelCase %>'),
                        controller: <%= camelCase %>Ctrl,
                        controllerAs: '<%= controllerAs %>'
                    }
                }
            });
    }

    function <%= camelCase %>Ctrl ($scope,<% for (var i = 0; i < params.length; i++){ -%> <%=params[i]%><%=i < params.length - 1 ? ',' : ''%> <% } -%>) {

        var <%= controllerAs %> = this;

        <%= controllerAs %>.name = '<%= camelCase %>';

    }
})();
