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
TestCase("PointTest", {
	setUp: function () {
		this.point = new OG.geometry.Point(new OG.geometry.Coordinate(10, 10));
	},

	testGetBoundary: function () {
		var base = new OG.geometry.Envelope(new OG.geometry.Coordinate(10, 10), 0, 0),
			boundary = this.point.getBoundary();

		assertTrue(base.isEquals(boundary));
	},

	testMove: function () {
		var clonedGeometry = OG.Util.clone(this.point),
			other = new OG.geometry.Point([20, 5]);
		clonedGeometry.move(10, -5);

		assertEquals("{type:'Point',coordinate:[20,5]}", clonedGeometry);
		assertTrue(clonedGeometry.isEquals(other));
	},

	testMoveCentroid: function () {
		var clonedGeometry = OG.Util.clone(this.point),
			other = new OG.geometry.Point([10, -5]);
		clonedGeometry.moveCentroid([10, -5]);

		assertEquals("{type:'Point',coordinate:[10,-5]}", clonedGeometry);
		assertTrue(clonedGeometry.isEquals(other));
	},

	testResize: function () {
		var clonedGeometry = OG.Util.clone(this.point);

		assertEquals("{type:'Point',coordinate:[25,18]}", clonedGeometry.resize(-5, 10, -10, 20));
	},

	testResizeBox: function () {
		var clonedGeometry = OG.Util.clone(this.point);
		assertEquals("{type:'Point',coordinate:[10,10]}", clonedGeometry.resizeBox(10, 10));
	},

	testRotate: function () {
		var clonedGeometry = OG.Util.clone(this.point),
			other = new OG.geometry.Point([30, 30]);
		clonedGeometry.rotate(180, new OG.geometry.Coordinate(20, 20));

		assertEquals("{type:'Point',coordinate:[30,30]}", clonedGeometry);
		assertTrue(clonedGeometry.isEquals(other));
	},

	testFitToBoundary: function () {
		var clonedGeometry = OG.Util.clone(this.point),
			boundary = new OG.geometry.Envelope([50, 50], 50, 50);

		clonedGeometry.fitToBoundary(boundary);

		assertEquals("[75,75]", clonedGeometry.getCentroid());
		assertTrue(boundary.getCentroid().isEquals(clonedGeometry.getCentroid()));
	}
});