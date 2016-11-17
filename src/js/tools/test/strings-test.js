var _ = {
	each: require('../collection/each'),

	capitalize: require('../strings/capitalize'),
	escape: require('../strings/escape'),
	unescape: require('../strings/unescape'),
	trim: require('../strings/trim'),
	trimLeft: require('../strings/trimLeft'),
	trimRight: require('../strings/trimRight')
};

function arrayEvery(arr, func) {
	for (var i=0; i<arr.length; i++) {
		if (!func(arr[i])) {
			return false;
		}
	}

	return true;
}


QUnit.module('Tools.Strings');

test('_.capitalize', function(assert) {
  assert.strictEqual(_.capitalize('fabio'), 'Fabio', 'First letter is upper case');
  assert.strictEqual(_.capitalize('fabio'), 'Fabio', 'First letter is upper case');
  assert.strictEqual(_.capitalize('FOO'), 'FOO', 'Other letters unchanged');
  assert.strictEqual(_.capitalize('FOO', false), 'FOO', 'Other letters unchanged');
  assert.strictEqual(_.capitalize('foO', false), 'FoO', 'Other letters unchanged');
  assert.strictEqual(_.capitalize('FOO', true), 'Foo', 'Other letters are lowercased');
  assert.strictEqual(_.capitalize('foO', true), 'Foo', 'Other letters are lowercased');
  assert.strictEqual(_.capitalize('f', false), 'F', 'Should uppercase 1 letter');
  assert.strictEqual(_.capitalize('f', true), 'F', 'Should uppercase 1 letter');
  assert.strictEqual(_.capitalize('f'), 'F', 'Should uppercase 1 letter');
  assert.strictEqual(_.capitalize(123), '123', 'Non string');
  assert.strictEqual(_.capitalize(123, true), '123', 'Non string');
  assert.strictEqual(_.capitalize(123, false), '123', 'Non string');
  assert.strictEqual(_.capitalize(''), '', 'Capitalizing empty string returns empty string');
  assert.strictEqual(_.capitalize(null), '', 'Capitalizing null returns empty string');
  assert.strictEqual(_.capitalize(undefined), '', 'Capitalizing undefined returns empty string');
  assert.strictEqual(_.capitalize('', true), '', 'Capitalizing empty string returns empty string');
  assert.strictEqual(_.capitalize(null, true), '', 'Capitalizing null returns empty string');
  assert.strictEqual(_.capitalize(undefined, true), '', 'Capitalizing undefined returns empty string');
  assert.strictEqual(_.capitalize('', false), '', 'Capitalizing empty string returns empty string');
  assert.strictEqual(_.capitalize(null, false), '', 'Capitalizing null returns empty string');
  assert.strictEqual(_.capitalize(undefined, false), '', 'Capitalizing undefined returns empty string');
});

QUnit.test('_.escape', function(assert) {
	assert.strictEqual(_.escape(null), '');
});

QUnit.test('_.unescape', function(assert) {
	var string = 'Curly & Moe';
	assert.strictEqual(_.unescape(null), '');
	assert.strictEqual(_.unescape(_.escape(string)), string);
	assert.strictEqual(_.unescape(string), string, 'don\'t unescape unnecessarily');
});

// Don't care what they escape them to just that they're escaped and can be unescaped
QUnit.test('_.escape & unescape', function(assert) {
	// test & (&amp;) separately obviously
	var escapeCharacters = ['<', '>', '"', '\'', '`'];

	_.each(escapeCharacters, function(escapeChar) {
		var s = 'a ' + escapeChar + ' string escaped';
		var e = _.escape(s);
		assert.notEqual(s, e, escapeChar + ' is escaped');
		assert.strictEqual(s, _.unescape(e), escapeChar + ' can be unescaped');

		s = 'a ' + escapeChar + escapeChar + escapeChar + 'some more string' + escapeChar;
		e = _.escape(s);

		assert.strictEqual(e.indexOf(escapeChar), -1, 'can escape multiple occurrences of ' + escapeChar);
		assert.strictEqual(_.unescape(e), s, 'multiple occurrences of ' + escapeChar + ' can be unescaped');
	});

	// handles multiple escape characters at once
	var joiner = ' other stuff ';
	var allEscaped = escapeCharacters.join(joiner);
	allEscaped += allEscaped;
	assert.ok(arrayEvery(escapeCharacters, function(escapeChar) {
		return allEscaped.indexOf(escapeChar) !== -1;
	}), 'handles multiple characters');
	assert.ok(allEscaped.indexOf(joiner) >= 0, 'can escape multiple escape characters at the same time');

	// test & -> &amp;
	var str = 'some string & another string & yet another';
	var escaped = _.escape(str);

	assert.notStrictEqual(escaped.indexOf('&'), -1, 'handles & aka &amp;');
	assert.strictEqual(_.unescape(str), str, 'can unescape &amp;');
});

QUnit.test( "trim", function( assert ) {
	assert.expect( 13 );

	var nbsp = String.fromCharCode( 160 );

	assert.equal( _.trim( "hello  " ), "hello", "trailing space" );
	assert.equal( _.trim( "  hello" ), "hello", "leading space" );
	assert.equal( _.trim( "  hello   " ), "hello", "space on both sides" );
	assert.equal( _.trim( "  " + nbsp + "hello  " + nbsp + " " ), "hello", "&nbsp;" );

	assert.equal( _.trim(), "", "Nothing in." );
	assert.equal( _.trim( undefined ), "", "Undefined" );
	assert.equal( _.trim( null ), "", "Null" );
	assert.equal( _.trim( 5 ), "5", "Number" );
	assert.equal( _.trim( false ), "false", "Boolean" );

	assert.equal( _.trim( " " ), "", "space should be trimmed" );
	assert.equal( _.trim( "ipad\xA0" ), "ipad", "nbsp should be trimmed" );
	assert.equal( _.trim( "\uFEFF" ), "", "zwsp should be trimmed" );
	assert.equal( _.trim( "\uFEFF \xA0! | \uFEFF" ), "! |", "leading/trailing should be trimmed" );
} );

QUnit.test( "trimLeft", function( assert ) {
	assert.equal(_.trimLeft(' foo'), 'foo');
	assert.equal(_.trimLeft('    foo'), 'foo');
	assert.equal(_.trimLeft('foo '), 'foo ');
	assert.equal(_.trimLeft(' foo '), 'foo ');
	assert.equal(_.trimLeft(''), '', 'trimLeft empty string should return empty string');
	assert.equal(_.trimLeft(null), '', 'trimLeft null should return empty string');
	assert.equal(_.trimLeft(undefined), '', 'trimLeft undefined should return empty string');
});

QUnit.test( "trimRight", function( assert ) {
	assert.equal(_.trimRight(' foo'), ' foo');
	assert.equal(_.trimRight('foo '), 'foo');
	assert.equal(_.trimRight('foo     '), 'foo');
	assert.equal(_.trimRight('foo  bar     '), 'foo  bar');
	assert.equal(_.trimRight(' foo '), ' foo');

	assert.equal(_.trimRight(''), '', 'trimRight empty string should return empty string');
	assert.equal(_.trimRight(null), '', 'trimRight null should return empty string');
});

