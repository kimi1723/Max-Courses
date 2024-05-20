var submitBtn = document.getElementById('submit');
var num1 = document.getElementById('num1');
var num2 = document.getElementById('num2');
var add = function (num1, num2) {
    console.log(num1 + num2);
};
submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.addEventListener('click', function () { return add(+num1.value, +num2.value); });
