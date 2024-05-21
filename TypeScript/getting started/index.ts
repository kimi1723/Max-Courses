interface Greetable {
	name: string;
	greet(): void;
}

class Person implements Greetable {
	name: string;

	greet() {
		console.log('elo');
	}
}

const newOs = new Person();

newOs.greet();
