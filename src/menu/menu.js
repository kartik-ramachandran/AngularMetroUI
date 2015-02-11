angular.module('ui.bootstrap.menu', [])

.controller('MenuController', ['$scope', function MenuCtrl($scope) {
    var ctrl = this,
        tabs = ctrl.tabs = $scope.tabs = [];

    ctrl.select = function (selectedTab) {
        angular.forEach(tabs, function (tab) {
            if (tab.active && tab !== selectedTab) {
                tab.active = false;
                tab.onDeselect();
            }
        });
        selectedTab.active = true;
        selectedTab.onSelect();
    };

    ctrl.addTab = function addTab(tab) {
        tabs.push(tab);
        // we can't run the select function on the first tab
        // since that would select it twice
        if (tabs.length === 1) {
            tab.active = true;
        } else if (tab.active) {
            ctrl.select(tab);
        }
    };

    ctrl.removeTab = function removeTab(tab) {
        var index = tabs.indexOf(tab);
        //Select a new tab if the tab to be removed is selected and not destroyed
        if (tab.active && tabs.length > 1 && !destroyed) {
            //If this is the last tab, select the previous tab. else, the next tab.
            var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
            ctrl.select(tabs[newActiveIndex]);
        }
        tabs.splice(index, 1);
    };

    var destroyed;
    $scope.$on('$destroy', function () {
        destroyed = true;
    });
}])

.directive('menu', function () {
    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: {
            type: '@'
        },
        controller: 'MenuController',
        templateUrl: 'template/menu/menu.html',
        link: function (scope, element, attrs) {
            scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
            scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
        }
    };
})

.directive('menutab', ['$parse', function ($parse) {
    return {
        require: '^menu',
        restrict: 'EA',
        replace: true,
        templateUrl: 'template/menu/menutab.html',
        transclude: true,
        scope: {
            active: '=?',
            heading: '@',
            onSelect: '&select', //This callback is called in contentHeadingTransclude
            //once it inserts the tab's content into the dom
            onDeselect: '&deselect'
        },
        controller: function () {
            //Empty controller so other directives can require being 'under' a tab
        },
        compile: function (elm, attrs, transclude) {
            return function postLink(scope, elm, attrs, tabsetCtrl) {
                scope.$watch('active', function (active) {
                    if (active) {
                        tabsetCtrl.select(scope);
                    }
                });

                scope.disabled = false;
                if (attrs.disabled) {
                    scope.$parent.$watch($parse(attrs.disabled), function (value) {
                        scope.disabled = !!value;
                    });
                }

                scope.select = function () {
                    if (!scope.disabled) {
                        scope.active = true;
                    }
                };

                tabsetCtrl.addTab(scope);
                scope.$on('$destroy', function () {
                    tabsetCtrl.removeTab(scope);
                });

                //We need to transclude later, once the content container is ready.
                //when this link happens, we're inside a tab heading.
                scope.$transcludeFn = transclude;
            };
        }
    };
}])

.directive('menutabHeadingTransclude', [function () {
    return {
        restrict: 'A',
        require: '^menutab',
        link: function (scope, elm, attrs, tabCtrl) {
            scope.$watch('headingElement', function updateHeadingElement(heading) {
                if (heading) {
                    elm.html('');
                    elm.append(heading);
                }
            });
        }
    };
}])

.directive('menutabContentTransclude', function () {
    return {
        restrict: 'A',
        require: '^menu',
        link: function (scope, elm, attrs) {
            var tab = scope.$eval(attrs.menutabContentTransclude);

            //Now our tab is ready to be transcluded: both the tab heading area
            //and the tab content area are loaded.  Transclude 'em both.
            tab.$transcludeFn(tab.$parent, function (contents) {
                angular.forEach(contents, function (node) {
                    if (isTabHeading(node)) {
                        //Let tabHeadingTransclude know.
                        tab.headingElement = node;
                    } else {
                        elm.append(node);
                    }
                });
            });
        }
    };
    function isTabHeading(node) {
        return node.tagName && (
          node.hasAttribute('tab-heading') ||
          node.hasAttribute('data-tab-heading') ||
          node.tagName.toLowerCase() === 'tab-heading' ||
          node.tagName.toLowerCase() === 'data-tab-heading'
        );
    }
})

.directive('menugroupcontent', function () {
    return {
        require: '^menutab',
        restrict: 'EA',
        transclude: true,
        replace: false,
        scope: {
            groupCaption: '@'
        },
        templateUrl: 'template/menu/menugroupcontent.html'
    };
});
