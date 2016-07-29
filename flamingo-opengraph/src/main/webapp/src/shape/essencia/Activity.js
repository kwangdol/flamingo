/**
 * BPMN : Activity Event Shape
 *
 * @class
 * @extends OG.shape.GeomShape
 * @requires OG.common.*, OG.geometry.*
 *
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 */
OG.shape.essencia.Activity = function (label) {
    OG.shape.essencia.Activity.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.essencia.Activity';
    this.LABEL_EDITABLE = false;
    this.label = label;
};
OG.shape.essencia.Activity.prototype = new OG.shape.GeomShape();
OG.shape.essencia.Activity.superclass = OG.shape.GeomShape;
OG.shape.essencia.Activity.prototype.constructor = OG.shape.essencia.Activity;
OG.Activity = OG.shape.essencia.Activity;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.essencia.Activity.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Polygon([
        [10,50],
        [10,60],
        [70,60],
        [90,55],
        [70,50]
    ]);

    this.geom.style = new OG.geometry.Style({
        'label-position': 'middle',
        'stroke-width': 2.5
    });

    return this.geom;
};
