/**
 * BPMN : State Event Shape
 *
 * @class
 * @extends OG.shape.GeomShape
 * @requires OG.common.*, OG.geometry.*
 *
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 */
OG.shape.essencia.State = function (label) {
    OG.shape.essencia.State.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.essencia.State';
    this.LABEL_EDITABLE = false;
    this.label = label;
};
OG.shape.essencia.State.prototype = new OG.shape.GeomShape();
OG.shape.essencia.State.superclass = OG.shape.GeomShape;
OG.shape.essencia.State.prototype.constructor = OG.shape.essencia.State;
OG.State = OG.shape.essencia.State;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.essencia.State.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Rectangle([0, 0], 100, 100);

    this.geom.style = new OG.geometry.Style({
        'label-position': 'center',
        'stroke-width' : 2.5,
        'r' : 8
    });

    return this.geom;
};
