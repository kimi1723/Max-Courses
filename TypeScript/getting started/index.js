var Person = /** @class */ (function () {
    function Person() {
    }
    Person.prototype.greet = function () {
        console.log('elo');
    };
    return Person;
}());
var newOs = new Person();
newOs.greet();
