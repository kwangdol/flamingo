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
TestCase("BezierCurveTest", {
	setUp: function () {
		this.curve = new OG.geometry.BezierCurve([
			[100, 100],
			[200, 100],
			[100, 200],
			[200, 200]
		]);
	},

	testGetBoundary: function () {
		var base = new OG.geometry.Envelope([100, 100], 100, 100),
			boundary = this.curve.getBoundary();

		assertTrue(base.isEquals(boundary));
	},

	testGetControlPoints: function () {
		var vertices = this.curve.getControlPoints();

		assertEquals("[100,100],[200,100],[100,200],[200,200]", vertices);
	},

	testGetVertices: function () {
		var vertices = this.curve.getVertices();

		assertEquals("[100,100]", vertices[0]);
		assertEquals("[200,200]", vertices[vertices.length - 1]);
	},

	testMove: function () {
		var clonedGeometry = OG.Util.clone(this.curve), vertices;

		clonedGeometry.move(100, -100);

		vertices = clonedGeometry.getVertices();

		assertEquals("[200,0]", vertices[0]);
		assertEquals("[300,100]", vertices[vertices.length - 1]);
	}
});