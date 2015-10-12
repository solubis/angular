import {Provider} from './Provider';

let provider = Provider.instance;

provider.directive('ng-bind', () => {
    return {
        scope: false,
        link: (element, scope, expr) => {
            element.innerHTML = scope.$eval(expr);
            scope.$watch(expr, (value) => {
                element.innerHTML = value;
            });
        }
    };
});

provider.directive('ng-model', function() {
    return {
        link: function(element, scope, expr) {
            element.onkeyup = function() {
                scope[expr] = element.value;
                scope.$digest();
            };
            scope.$watch(expr, function(val) {
                element.value = val;
            });
        }
    };
});

provider.directive('ng-controller', function() {
    return {
        scope: true,
        link: function(el, scope, exp) {
            let ctrl = provider.get(exp + Provider.CONTROLLER_SUFFIX);
            provider.invoke(ctrl, { $scope: scope });
        }
    };
});

provider.directive('ng-click', function() {
    return {
        scope: false,
        link: function(element, scope, expr) {
            element.onclick = function() {
                scope.$eval(expr);
                scope.$digest();
            };
        }
    };
});
