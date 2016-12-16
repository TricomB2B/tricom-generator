(function () {
	'use strict';

	angular
		.module('<%= prefix %>', [
			'ngResource',
			'ui.router',
			'tcomViews',
			'DataFactory',
			'HomeView',
			// enter additional modules/components here


			// Generator Views
			//!!V!!//
			// DO NOT MODIFY | DO NOT REMOVE LINE ABOVE IF USING GENERATOR

			// Generator Directives
			//!!D!!//
			// DO NOT MODIFY | DO NOT REMOVE LINE ABOVE IF USING GENERATOR

			// Generator Factories
			//!!F!!//
			// DO NOT MODIFY | DO NOT REMOVE LINE ABOVE IF USING GENERATOR
		])
		.run(bootstrap)
		.config(rootConfig);


	/**
	 * @name stateDebug
	 * @methodOf <%= prefix %>
	 * @description
	 * Useful output for debugging state changes
	 * @requires $rootScope
	 * @ngInject
	 */
	function stateDebug($rootScope) {
		$rootScope.$on('$stateChangeStart', function (e, toState, toParams) {
			console.log('start');
			console.log(toState);
			console.log(toParams);
		});

		$rootScope.$on('$stateNotFound', function (e, toState) {
			console.log('not found');
			console.log(toState);
		});

		$rootScope.$on('$stateChangeSuccess', function (e, toState, toParams) {
			console.log('success');
			console.log(toState);
			console.log(toParams);
		});

		$rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, error) {
			console.log('error');
			console.log(toState);
			console.log(error);
		});
	}

	/**
	 * [bootstrap description]
	 * @return {[type]} [description]
	 * @ngInject
	 */
	function bootstrap() {

		console.log('bootstrapped');

	}

	/**
	 * [rootConfig description]
	 * @return {[type]} [description]
	 * @ngInject
	 */

	function rootConfig($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('root', {
				url: '',
				abstract: 'true',
				resolve: {
					data: function (DataFactory) {
						return DataFactory.initialize().$promise;
					},
					//!!FI!!//
				}
			});
	}

})();
