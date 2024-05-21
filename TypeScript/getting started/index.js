var submitBtn = document.getElementById('submit');
var num1 = document.getElementById('num1');
var num2 = document.getElementById('num2');
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
})(Direction || (Direction = {}));
var dir = { up: 1, down: 2 };
var add = function (num1, num2) {
    console.log(num1 + num2);
};
submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.addEventListener('click', function () { return add(+num1.value, +num2.value); });
