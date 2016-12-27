var Aspect = require('../mixins/aspect');
var Class = require('../class');

var sinon = window.sinon;

var Base = Class.create({
	Implements: [Aspect]
});

QUnit.module('OO.Mixins.Aspect');

QUnit.test('binding and triggering multiple handler', function(assert) {
	var spyMethod = sinon.spy(function() { return this; });
	var spyBefore = sinon.spy();

	var Clz = Base.extend({
		a: spyMethod,
		b: spyMethod,
		c: spyMethod
	});

	var obj = new Clz();
	obj.counter = 0;
	obj.before('a b c', spyBefore);

	var s = obj.a();
	assert.equal(spyMethod.callCount, 1);
	assert.equal(spyBefore.callCount, 1);

	obj.a().b();
	assert.equal(spyMethod.callCount, 3);
	assert.equal(spyBefore.callCount, 3);

	obj.c();
	assert.equal(spyMethod.callCount, 4);
	assert.equal(spyBefore.callCount, 4);

	obj.before('a c', null);
	obj.a().b().c();
	assert.equal(spyMethod.callCount, 7);
	assert.equal(spyBefore.callCount, 5);
});

QUnit.test('binding and triggering with event maps', function(assert) {
	var spyMethod = sinon.spy(function() { return this; });
	var spyBefore = sinon.spy();

	var Clz = Base.extend({
		a: spyMethod,
		b: spyMethod,
		c: spyMethod
	});

	var obj = new Clz();
	obj.before('a b c', spyBefore);

	obj.a();
	assert.equal(spyMethod.callCount, 1);
	assert.equal(spyBefore.callCount, 1);

	obj.a().b();
	assert.equal(spyMethod.callCount, 3);
	assert.equal(spyBefore.callCount, 3);

	obj.c();
	assert.equal(spyMethod.callCount, 4);
	assert.equal(spyBefore.callCount, 4);

	obj.before({
		a: null,
		c: null
	}, obj);
	obj.a().b().c();
	assert.equal(spyMethod.callCount, 7);
	assert.equal(spyBefore.callCount, 5);
});

QUnit.test('binding and trigger with event maps context', function(assert) {
	assert.expect(2);

	var Clz = Base.extend({
		a: function () {}
	});

	var obj = new Clz();
	var context = {};

	obj.before({
		a: function() {
			assert.strictEqual(this, context, 'defaults `context` to `callback` param');
		}
	}, context).a();

	obj.before({
		a: function() {
			assert.strictEqual(this, context, 'will not override explicit `context` param');
		}
	}, this, context).a();
});

QUnit.test('stop before', function(assert) {
	var counter = 0;

	var A = Base.extend({
		xxx: function(n, m) {
			counter++;
			return n + m;
		}
	});

	var a = new A();
	var spyA = sinon.spy();
	var spyB = sinon.spy(sinon.stub().returns(false));

	a.before('xxx', spyA);
	a.xxx(1, 2);

	a.before('xxx', spyB);
	a.xxx(3, 4);

	assert.equal(spyA.withArgs(1, 2).callCount, 1, 'should pass along the arguments to the handler.');
	assert.ok(spyA.calledOn(a), 'should be called with the object as the context.');

	assert.equal(counter, 1, 'should call the handler just once.');
});
