var Class = require('../class');

QUnit.module('OO.Class');

QUnit.test('Class.create(parent)', function(assert) {
	function Animal(name) {
		this.name = name;
	}

	Animal.prototype.getName = function() {
		return this.name;
	}

	var Dog = Class.create(Animal);
	var dog = new Dog('Jack');

	assert.strictEqual(dog.constructor, Dog);
	assert.equal(dog.name, 'Jack');
	assert.equal(dog.getName(), 'Jack');
});

QUnit.test('Class.create(null)', function(assert) {
	var Dog = Class.create(null);
	var dog = new Dog();

	assert.strictEqual(dog.constructor, Dog);
	assert.strictEqual(Dog.superclass.constructor, Class);

	Dog = Class.create();
	new Dog();
	assert.strictEqual(Dog.superclass.constructor, Class);
});

QUnit.test('Class.create(parent, properties)', function(assert) {
	function Animal(name) {
		this.name = name
	}

	Animal.prototype.getName = function() {
		return this.name
	};

	var Dog = Class.create(Animal, {
		talk: function() {
			return 'I am ' + this.name;
		}
	})
	var dog = new Dog('Jack');

	assert.equal(dog.name, 'Jack');
	assert.equal(dog.talk(), 'I am Jack');
});

QUnit.test('call initialize method properly', function(assert) {
	var counter = 0;

	var Animal = Class.create({
		initialize: function() {
			counter++
		}
	});

	var Dog = Class.create(Animal, {
		initialize: function() {
			counter++
		}
	});

	new Dog();

	// Dog 有 initialize 时，只调用 Dog 的 initialize
	assert.strictEqual(counter, 1);

	counter = 0;
	Dog = Class.create(Animal);

	new Dog();

	// Dog 没有 initialize 时，会自动调用父类中最近的 initialize
	assert.strictEqual(counter, 1);
});


QUnit.test('pass arguments to initialize method properly', function(assert) {

	var Animal = Class.create({
		initialize: function(firstName, lastName) {
			this.fullName = firstName + ' ' + lastName
		}
	})

	var Bird = Animal.extend({
		fly: function() {
		}
	})

	var bird = new Bird('Frank', 'Wang')

	assert.strictEqual(bird.fullName, 'Frank Wang')
});

QUnit.test('superclass', function(assert) {
	var counter = 0

	var Animal = Class.create({
		initialize: function() {
			counter++
		},
		talk: function() {
			return 'I am an animal'
		}
	})

	var Dog = Class.create(Animal, {
		initialize: function() {
			Dog.superclass.initialize()
		},
		talk: function() {
			return Dog.superclass.talk()
		}
	})

	var dog = new Dog()

	assert.strictEqual(counter, 1)
	assert.strictEqual(dog.talk(), 'I am an animal')
})

QUnit.test('Extends', function(assert) {
	function Animal(name) {
		this.name = name
	}

	Animal.prototype.getName = function() {
		return this.name
	}

	var Dog = Class.create({
		Extends: Animal,
		talk: function() {
			return 'I am ' + this.name
		}
	})

	var dog = new Dog('Jack')

	assert.strictEqual(dog.name, 'Jack')
	assert.strictEqual(dog.getName(), 'Jack')
	assert.strictEqual(dog.talk(), 'I am Jack')
})

QUnit.test('Implements', function(assert) {
	var Animal = Class.create(function(name) {
		this.name = name
	}, {
		getName: function() {
			return this.name
		}

	})

	var Flyable = {
		fly: function() {
			return 'I am flying'
		}
	}

	var Talkable = function() {
	}
	Talkable.prototype.talk = function() {
		return 'I am ' + this.name
	}

	var Dog = Class.create({
		Extends: Animal,
		Implements: [Flyable, Talkable]
	})

	var dog = new Dog('Jack')

	assert.strictEqual(dog.name, 'Jack')
	assert.strictEqual(dog.getName(), 'Jack')
	assert.strictEqual(dog.fly(), 'I am flying')
	assert.strictEqual(dog.talk(), 'I am Jack')
})

QUnit.test('Statics', function(assert) {
	var Dog = Class.create({
		initialize: function(name) {
			this.name = name
		},
		Statics: {
			COLOR: 'red'
		}
	})

	var dog = new Dog('Jack')

	assert.strictEqual(dog.name, 'Jack')
	assert.strictEqual(Dog.COLOR, 'red')
})

QUnit.test('statics inherited from parent', function(assert) {
	var Animal = Class.create()
	Animal.LEGS = 4

	var Dog = Class.create({
		Extends: Animal,

		Statics: {
			COLOR: 'red'
		},

		initialize: function(name) {
			this.name = name
		}
	})

	assert.strictEqual(Dog.LEGS, 4)
	assert.strictEqual(Dog.COLOR, 'red')

	var Pig = Class.create(Class)

	assert.strictEqual(typeof Pig.implement, 'function')
	assert.strictEqual(typeof Pig.extend, 'function')
	assert.strictEqual(typeof Pig.Mutators, 'undefined')
	assert.strictEqual(typeof Pig.create, 'undefined')
})

QUnit.test('Class.extend', function(assert) {
	var Dog = Class.extend({
		initialize: function(name) {
			this.name = name
		}
	})

	var dog = new Dog('Jack')

	assert.strictEqual(dog.name, 'Jack')
	assert.strictEqual(Dog.superclass.constructor, Class)
})

QUnit.test('SubClass.extend', function(assert) {
	var Animal = Class.create(function(name) {
		this.name = name
	})

	var Dog = Animal.extend()
	var dog = new Dog('Jack')

	assert.strictEqual(dog.name, 'Jack')
	assert.strictEqual(Dog.superclass.constructor, Animal)
})

QUnit.test('SubClass.implement', function(assert) {
	var Animal = Class.create(function(name) {
		this.name = name
	})

	var Dog = Animal.extend()
	Dog.implement({
		talk: function() {
			return 'I am ' + this.name
		}
	})

	var dog = new Dog('Jack')

	assert.strictEqual(dog.name, 'Jack')
	assert.strictEqual(dog.talk(), 'I am Jack')
	assert.strictEqual(Dog.superclass.constructor, Animal)
})

QUnit.test('convert existed function to Class', function(assert) {
	function Dog(name) {
		this.name = name
	}

	Class(Dog).implement({
		getName: function() {
			return this.name
		}
	})

	var dog = new Dog('Jack')

	assert.strictEqual(dog.name, 'Jack')
	assert.strictEqual(dog.getName(), 'Jack')

	var MyDog = Dog.extend({
		talk: function() {
			return 'I am ' + this.name
		}
	})

	var myDog = new MyDog('Frank')
	assert.strictEqual(myDog.name, 'Frank')
})

QUnit.test('new AnotherClass() in initialize', function(assert) {
	var called = []

	var Animal = Class.create({
		initialize: function() {
			called.push('Animal')
		}
	})

	var Pig = Class.create(Animal, {
		initialize: function() {
			called.push('Pig')
		}
	})

	var Dog = Class.create(Animal, {
		initialize: function() {
			new Pig()
			called.push('Dog')
		}
	})

	new Dog()
	assert.strictEqual(called.join(' '), 'Pig Dog')

})

QUnit.test('StaticsWhiteList', function(assert) {

	var A = Class.create()
	A.a = 1
	A.b = 1
	A.StaticsWhiteList = ['a']
	var B = A.extend(A)

	assert.strictEqual(B.a, 1)
	assert.strictEqual(B.b, undefined)
	assert.strictEqual(B.StaticsWhiteList, undefined)

})

QUnit.test('Meta information', function(assert) {
	var Animal = Class.create({
		isAnimal: true
	});

	var Dog = Animal.extend({
		isDog: true
	});
	var dog = new Dog()

	assert.strictEqual(dog.isAnimal, true)
	assert.strictEqual(dog.isDog, true)
})
