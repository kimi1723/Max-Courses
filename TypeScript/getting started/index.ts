const submitBtn = document.getElementById('submit') as HTMLButtonElement;
const num1 = document.getElementById('num1') as HTMLInputElement;
const num2 = document.getElementById('num2') as HTMLInputElement;

const add = (num1: number, num2: number) => {
	console.log(num1 + num2);
};

submitBtn?.addEventListener('click', () => add(+num1.value, +num2.value));
