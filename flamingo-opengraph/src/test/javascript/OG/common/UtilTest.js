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
TestCase("UtilTest", {
	testClone: function () {
		var upperLeft = new OG.geometry.Coordinate(10, 10),
			obj = new OG.geometry.Envelope(upperLeft, 10, 10),
			clonedObj = OG.Util.clone(obj);

		assertTrue(upperLeft.isEquals(obj.getUpperLeft()));
		assertTrue(upperLeft.isEquals(clonedObj.getUpperLeft()));
		assertTrue(obj.getCentroid().isEquals(clonedObj.getCentroid()));
		assertTrue(obj.getLowerRight().isEquals(clonedObj.getLowerRight()));
		assertEquals(obj.getWidth(), clonedObj.getWidth());
		assertEquals(obj.getLowerCenter(), clonedObj.getLowerCenter());
		assertNotEquals(obj.getLowerCenter(), clonedObj.getLowerRight());
	}
});