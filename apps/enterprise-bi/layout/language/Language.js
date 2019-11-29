"use strict";

angular.module('app').factory('Language', function ($http, $log, APP_CONFIG) {

	function getLanguage(key, callback) {

        $http.get(APP_CONFIG.apiRootUrl + '/langs/' + key + '.json').then(function (data) {

			callback(data);

        }).catch(function () {

			$log.log('Error');
			callback([]);

		});

	}

	function getLanguages(callback) {

        $http.get(APP_CONFIG.apiRootUrl + '/languages.json').then(function (data) {

			callback(data);

        }).catch(function () {

			$log.log('Error');
			callback([]);

		});

	}

	return {
		getLang: function(type, callback) {
			getLanguage(type, callback);
		},
		getLanguages:function(callback){
			getLanguages(callback);
		}
	}

});