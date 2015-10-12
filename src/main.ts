import { Provider } from './Provider';
import { Compiler } from './Compiler';
import './Directives';

Provider.instance.controller('MainController', function($scope) {
    $scope.bar = 0;
    $scope.foo = function() {
        $scope.bar++;
    };
});


Compiler.instance.bootstrap();
