/**
 * BPMN : ActivityArrow Shape for Activity Card
 * @class
 * @extends OG.shape.GeomShape
 * @requires OG.common.*, OG.geometry.*
 *
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 */
OG.shape.essencia.ActivityArrow = function (label) {
    OG.shape.essencia.ActivityArrow.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.essencia.ActivityArrow';
    this.LABEL_EDITABLE = false;
    this.label = label;
};
OG.shape.essencia.ActivityArrow.prototype = new OG.shape.GeomShape();
OG.shape.essencia.ActivityArrow.superclass = OG.shape.GeomShape;
OG.shape.essencia.ActivityArrow.prototype.constructor = OG.shape.essencia.ActivityArrow;
OG.ActivityArrow = OG.shape.essencia.ActivityArrow;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.essencia.ActivityArrow.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Polygon([
        [20,10],
        [20,70],
        [10,70],
        [50,90],
        [90,70],
        [80,70],
        [80,10]

    ]);

    this.geom.style = new OG.geometry.Style({
    });

    return this.geom;
};