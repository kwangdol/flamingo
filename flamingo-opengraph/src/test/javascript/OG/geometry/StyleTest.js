/*
 * (C) Copyright 2012-2016 the Flamingo Community.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
TestCase("StyleTest", {

	setUp: function () {
		this.style = new OG.Style({key1: 'value1', key2: 'value2', fill: 'green'});
	},

	testPut: function () {
		var clonedStyle = OG.Util.clone(this.style);

		clonedStyle.put("key3", "value3");
		clonedStyle.put("fill", "red");

		assertEquals("value3", clonedStyle.get("key3"));
		assertEquals("red", clonedStyle.get("fill"));
	},

	testGet: function () {
		assertEquals("value1", this.style.get("key1"));
		assertEquals("value2", this.style.get("key2"));
		assertEquals("green", this.style.get("fill"));
	},

	testContainsKey: function () {
		assertTrue(this.style.containsKey("key1"));
		assertTrue(this.style.containsKey("key2"));
		assertFalse(this.style.containsKey("key3"));
	},

	testContainsValue: function () {
		assertTrue(this.style.containsValue("value1"));
		assertTrue(this.style.containsValue("value2"));
	},

	testIsEmpty: function () {
		assertFalse(this.style.isEmpty());
	},

	testClear: function () {
		var clonedStyle = OG.Util.clone(this.style);
		clonedStyle.clear();
		assertTrue(clonedStyle.isEmpty());
	},

	testRemove: function () {
		var clonedStyle = OG.Util.clone(this.style);
		clonedStyle.remove("key2");
		assertFalse(clonedStyle.containsKey("key2"));
	}
});