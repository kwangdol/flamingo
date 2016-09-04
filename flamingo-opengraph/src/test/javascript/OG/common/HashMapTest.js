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
TestCase("HashMapTest", {
	setUp: function () {
		this.map = new OG.HashMap({key1: 'value1', key2: 'value2'});
	},

	testPut: function () {
		var clonedMap = OG.Util.clone(this.map);

		clonedMap.put("key3", "value3");

		assertEquals("value3", clonedMap.get("key3"));
	},

	testGet: function () {
		assertEquals("value1", this.map.get("key1"));
		assertEquals("value2", this.map.get("key2"));
	},

	testContainsKey: function () {
		assertTrue(this.map.containsKey("key1"));
		assertTrue(this.map.containsKey("key2"));
		assertFalse(this.map.containsKey("key3"));
	},

	testContainsValue: function () {
		assertTrue(this.map.containsValue("value1"));
		assertTrue(this.map.containsValue("value2"));
		assertFalse(this.map.containsValue("value3"));
	},

	testIsEmpty: function () {
		assertFalse(this.map.isEmpty());
	},

	testClear: function () {
		var clonedMap = OG.Util.clone(this.map);
		clonedMap.clear();
		assertTrue(clonedMap.isEmpty());
	},

	testRemove: function () {
		var clonedMap = OG.Util.clone(this.map);
		clonedMap.remove("key2");
		assertFalse(clonedMap.containsKey("key2"));
	},

	testKeys: function () {
		assertEquals("key1,key2", this.map.keys());
	},

	testValues: function () {
		assertEquals("value1,value2", this.map.values());
	},

	testSize: function () {
		assertEquals(2, this.map.size());
	}

});