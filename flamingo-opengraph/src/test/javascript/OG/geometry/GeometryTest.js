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
TestCase("GeometryTest", {
	setUp: function () {
		this.geometry = new OG.geometry.Geometry();
	},

	testDistanceToLine: function () {
		assertEquals(10, this.geometry.distanceToLine([0, 0], [[0, 10], [20, 20]]));
		assertEquals(10, this.geometry.distanceToLine([10, 0], [[0, 10], [20, 10]]));
		assertEquals(14, this.geometry.distanceToLine([0, 0], [[10, 10], [20, 10]]));
	},

	testDistanceLineToLine: function () {
		assertEquals(10, this.geometry.distanceLineToLine([[0, 0], [20, 0]], [[5, 10], [20, 20]]));
		assertEquals(0, this.geometry.distanceLineToLine([[0, 0], [20, 0]], [[10, -10], [10, 20]]));
		assertEquals(14, this.geometry.distanceLineToLine([[0, 0], [20, 0]], [[30, 10], [40, 10]]));
		assertEquals(14, this.geometry.distanceLineToLine([[0, 0], [20, 0]], [[20, 20], [40, 0]]));
	},

	testIntersectLineToLine: function () {
		assertEquals("[10,0]", this.geometry.intersectLineToLine([[0, 0], [20, 0]], [[10, 10], [10, -10]]));
		assertUndefined(this.geometry.intersectLineToLine([[0, 0], [20, 0]], [[0, 10], [20, 10]]));
		assertUndefined(this.geometry.intersectLineToLine([[0, 0], [20, 0]], [[0, 10], [20, 20]]));
		assertEquals("[5,10]", this.geometry.intersectLineToLine([[5, 10], [5, 10]], [[0, 0], [10, 20]]));
		assertUndefined(this.geometry.intersectLineToLine([[5, 5], [5, 5]], [[0, 10], [20, 5]]));
	},

	testIntersectCircleToLine: function () {
		var center = new OG.Coordinate(100, 100),
			radius = 50,
			from = new OG.Coordinate(100, 100),
			to = new OG.Coordinate(500, 100);

		assertEquals("[150,100]", this.geometry.intersectCircleToLine(center, radius, from, to));
	}
});