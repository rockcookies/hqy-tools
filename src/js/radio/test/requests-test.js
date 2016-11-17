var Requests = require('../requests');
var RequestsObj = Requests.mixTo({});

var _ = {
	extend: require('../../tools/objects/extend'),
	debounce: require('../../tools/functions/debounce')
};

var sinon = window.sinon;
QUnit.module('Radio.Requests');

QUnit.test('replying and request', function(assert) {
	var obj = {};
	Requests.mixTo(obj);

	assert.strictEqual(obj.request('unhandledEvent'), void 0, 'should not return anything.');

	var spy = sinon.spy();
	obj.reply('default', spy);
	obj.request('unhandledEvent', 'argOne', 'argTwo');

	assert.ok(spy.withArgs('unhandledEvent', 'argOne', 'argTwo').calledOnce, 'should pass along the arguments to the "default" handler.');
});

QUnit.test('replying and request multiple events', function(assert) {
	var obj = {};
	Requests.mixTo(obj);

	var spy = sinon.spy(sinon.stub().returns('myResponse'));
	obj.reply('a b c', spy);

	var resultA = obj.request('a');
	var resultB = obj.request('b');
	var resultC = obj.request('c');

	assert.equal(resultA, 'myResponse', 'should return the correct value.');
	assert.equal(resultB, 'myResponse', 'should return the correct value.');
	assert.equal(resultC, 'myResponse', 'should return the correct value.');
	assert.equal(spy.callCount, 3);
});

QUnit.test('replying and request with no context', function(assert) {
	var obj = {};
	Requests.mixTo(obj);

	var spy = sinon.spy(sinon.stub().returns('myResponse'));

	var returned = obj.reply('myRequest', spy);
	var result = obj.request('myRequest', 'argOne', 'argTwo');

	assert.ok(spy.withArgs('argOne', 'argTwo').calledOnce, 'should pass along the arguments to the handler.');
	assert.equal(result, 'myResponse', 'should return the value of the handler from `request`.');
	assert.strictEqual(returned, obj, 'should return Requests from `reply`.');
	assert.ok(spy.calledOn(obj), 'should be called with the Requests object as the context');
});

QUnit.test('replying and request with context', function(assert) {
	var obj = {};
	var context = {};
	Requests.mixTo(obj);

	var spy = sinon.spy(sinon.stub().returns('myResponse'));

	var returned = obj.reply('myRequest', spy, context);
	var result = obj.request('myRequest', 'argOne', 'argTwo');

	assert.ok(spy.withArgs('argOne', 'argTwo').calledOnce, 'should pass along the arguments to the handler.');
	assert.equal(result, 'myResponse', 'should return the value of the handler from `request`.');
	assert.strictEqual(returned, obj, 'should return Requests from `reply`.');
	assert.ok(spy.calledOn(context), 'should be called with the correct context');
});

QUnit.test('replying and request with many arguments', function(assert) {
	var obj = {};
	var context = {};
	Requests.mixTo(obj);

	var spy = sinon.spy();

	var returned = obj.reply('myRequest', spy, context);
	var result = obj.request('myRequest', 'argOne', 'argTwo', 'argThree', 'argFour', 'argFive');

	assert.ok(spy.withArgs('argOne', 'argTwo', 'argThree', 'argFour', 'argFive').calledOnce, 'should pass all of the arguments.');
});

QUnit.test('replying and request with `once` handler', function(assert) {
	var obj = {};
	Requests.mixTo(obj);

	var defaultSpy = sinon.spy();
	obj.reply('default', defaultSpy);
	var spy = sinon.spy(sinon.stub().returns('myResponse'));
	var returned = obj.replyOnce('myRequest', spy);


	var resultA = obj.request('myRequest', 'argA');
	var resultB = obj.request('myRequest', 'argB');

	assert.strictEqual(spy.callCount, 1, 'should call the handler just once.');
	assert.strictEqual(resultA, 'myResponse', 'should return the value of the handler once for `request`.');
	assert.strictEqual(resultB, void 0, 'should return the value of the handler once for `request`.');
	assert.strictEqual(returned, obj, 'should return Requests from `replyOnce`');

	assert.strictEqual(defaultSpy.callCount, 1, 'should call the default handler once');
	assert.ok(defaultSpy.calledAfter(spy), 'should call the "default" handler for subsequent calls');
});
