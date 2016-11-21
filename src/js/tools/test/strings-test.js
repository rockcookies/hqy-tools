var _ = {
	each: require('../collection/each'),
	every: require('../collection/every'),

	capitalize: require('../strings/capitalize'),
	escape: require('../strings/escape'),
	unescape: require('../strings/unescape'),
	trim: require('../strings/trim'),
	trimLeft: require('../strings/trimLeft'),
	trimRight: require('../strings/trimRight'),
	startsWith: require('../strings/startsWith'),
	endsWith: require('../strings/endsWith')
};

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
	assert.ok(_.every(escapeCharacters, function(escapeChar) {
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

QUnit.test( "startsWith", function( assert ) {
	assert.ok(_.startsWith('foobar', 'foo'), 'foobar starts with foo');
	assert.ok(!_.startsWith('oobar', 'foo'), 'oobar does not start with foo');
	assert.ok(_.startsWith('oobar', 'o'), 'oobar starts with o');
	assert.ok(_.startsWith(12345, 123), '12345 starts with 123');
	assert.ok(!_.startsWith(2345, 123), '2345 does not start with 123');
	assert.ok(_.startsWith('', ''), 'empty string starts with empty string');
	assert.ok(_.startsWith(null, ''), 'null starts with empty string');
	assert.ok(!_.startsWith(null, 'foo'), 'null starts with foo');
	assert.ok(_.startsWith('-foobar', 'foo', 1), 'foobar starts with foo at position 1');
	assert.ok(_.startsWith('foobar', 'foo', 0), 'foobar starts with foo at position 0');
	assert.ok(!_.startsWith('foobar', 'foo', 1), 'foobar starts not with foo at position 1');
	assert.ok(_.startsWith('Äpfel', 'Ä'), 'string starts with a unicode');

	assert.strictEqual(_.startsWith('hello', 'hell'), true);
	assert.strictEqual(_.startsWith('HELLO', 'HELL'), true);
	assert.strictEqual(_.startsWith('HELLO', 'hell'), false);
	assert.strictEqual(_.startsWith('HELLO', 'hell'), false);
	assert.strictEqual(_.startsWith('hello', 'hell', 0), true);
	assert.strictEqual(_.startsWith('HELLO', 'HELL', 0), true);
	assert.strictEqual(_.startsWith('HELLO', 'hell', 0), false);
	assert.strictEqual(_.startsWith('HELLO', 'hell', 0), false);
	assert.strictEqual(_.startsWith('HELLO'), false);
	assert.strictEqual(_.startsWith('undefined'), true);
	assert.strictEqual(_.startsWith('null', null), true);
	assert.strictEqual(_.startsWith('hello', 'hell', -20), true);
	assert.strictEqual(_.startsWith('hello', 'hell', 1), false);
	assert.strictEqual(_.startsWith('hello', 'hell', 2), false);
	assert.strictEqual(_.startsWith('hello', 'hell', 3), false);
	assert.strictEqual(_.startsWith('hello', 'hell', 4), false);
	assert.strictEqual(_.startsWith('hello', 'hell', 5), false);
	assert.strictEqual(_.startsWith('hello', 'hell', 20), false);
});

QUnit.test( "endsWith", function( assert ) {
	assert.ok(_.endsWith('foobar', 'bar'), 'foobar ends with bar');
	assert.ok(_.endsWith('foobarfoobar', 'bar'), 'foobar ends with bar');
	assert.ok(_.endsWith('foo', 'o'), 'foobar ends with o');
	assert.ok(_.endsWith('foobar', 'bar'), 'foobar ends with bar');
	assert.ok(_.endsWith('00018-0000062.Plone.sdh264.1a7264e6912a91aa4a81b64dc5517df7b8875994.mp4', 'mp4'), 'endsWith .mp4');
	assert.ok(!_.endsWith('fooba', 'bar'), 'fooba does not end with bar');
	assert.ok(_.endsWith(12345, 45), '12345 ends with 45');
	assert.ok(!_.endsWith(12345, 6), '12345 does not end with 6');
	assert.ok(_.endsWith('', ''), 'empty string ends with empty string');
	assert.ok(_.endsWith(null, ''), 'null ends with empty string');
	assert.ok(!_.endsWith(null, 'foo'), 'null ends with foo');
	assert.ok(_.endsWith('foobar?', 'bar', 6), 'foobar ends with bar at position 6');
	assert.ok(_.endsWith(12345, 34, 4), 'number ends with 34 at position 4');
	assert.ok(!_.endsWith(12345, 45, 4), 'number ends not with 45 at position 4');
	assert.ok(_.endsWith('foobä', 'ä'), 'string ends with a unicode');

	assert.strictEqual(_.endsWith('vader', 'der'), true);
	assert.strictEqual(_.endsWith('VADER', 'DER'), true);
	assert.strictEqual(_.endsWith('VADER', 'der'), false);
	assert.strictEqual(_.endsWith('VADER', 'DeR'), false);
	assert.strictEqual(_.endsWith('VADER'), false);
	assert.strictEqual(_.endsWith('undefined'), true);
	assert.strictEqual(_.endsWith('null', null), true);
	assert.strictEqual(_.endsWith('vader', 'der', 5), true);
	assert.strictEqual(_.endsWith('VADER', 'DER', 5), true);
	assert.strictEqual(_.endsWith('VADER', 'der', 5), false);
	assert.strictEqual(_.endsWith('VADER', 'DER', 5), true);
	assert.strictEqual(_.endsWith('VADER', 'der', 5), false);
	assert.strictEqual(_.endsWith('vader', 'der', -20), false);
	assert.strictEqual(_.endsWith('vader', 'der', 0), false);
	assert.strictEqual(_.endsWith('vader', 'der', 1), false);
	assert.strictEqual(_.endsWith('vader', 'der', 2), false);
	assert.strictEqual(_.endsWith('vader', 'der', 3), false);
	assert.strictEqual(_.endsWith('vader', 'der', 4), false);
});


