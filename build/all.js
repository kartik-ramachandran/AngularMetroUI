angular.module('ui.am.menu').run(['$templateCache', function($templateCache) {
    $templateCache.put('menu\menu.html',
        "<div>\r\n    <ul class=\"nav nav-{{type || 'tabs'}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\r\n    <div class=\"tab-content\">\r\n        <div class=\"tab-pane\"\r\n            ng-repeat=\"tab in tabs\"\r\n            ng-class=\"{active: tab.active}\"\r\n            tab-content-transclude=\"tab\">\r\n        </div>\r\n    </div>\r\n</div>\r\n");
}]);
angular.module('ui.am.menu').run(['$templateCache', function($templateCache) {
    $templateCache.put('menu\menugroupcontent.html',
        "<div class=\"tab-panel-group\">\r\n    <div class=\"tab-group-content\" ng-transclude>\r\n    </div>\r\n    <div class=\"tab-group-caption\">{{groupCaption}}</div>\r\n</div>\r\n");
}]);
angular.module('ui.am.menu').run(['$templateCache', function($templateCache) {
    $templateCache.put('menu\menutab.html',
        "<li ng-class=\"{active: active, disabled: disabled}\">\r\n    <a href ng-click=\"select()\" tab-heading-transclude>{{heading}}</a>\r\n</li>\r\n");
}]);