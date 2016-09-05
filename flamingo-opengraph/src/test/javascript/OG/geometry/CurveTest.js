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
TestCase("CurveTest", {
	setUp: function () {
		this.curve = new OG.geometry.Curve([
			[2, 1],
			[1, 3],
			[-1, -1],
			[-2, 1]
		]);
	},

	testGetBoundary: function () {
		var base = new OG.geometry.Envelope([-2, -1], 4, 4),
			boundary = this.curve.getBoundary();

		assertTrue(base.isEquals(boundary));
	},

	testGetVertices: function () {
		var vertices = this.curve.getVertices();

		assertEquals("[2,1]", vertices[0]);
		assertEquals("[-2,1]", vertices[vertices.length - 1]);
	},

	testMove: function () {
		var clonedGeometry = OG.Util.clone(this.curve), vertices;

		clonedGeometry.move(10, -5);

		vertices = clonedGeometry.getVertices();

		assertEquals("[12,-4]", vertices[0]);
		assertEquals("[8,-4]", vertices[vertices.length - 1]);
	}
});