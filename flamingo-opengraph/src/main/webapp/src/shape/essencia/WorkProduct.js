/**
 * BPMN : WorkProduct Event Shape
 *
 * @class
 * @extends OG.shape.GeomShape
 * @requires OG.common.*, OG.geometry.*
 *
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 */
OG.shape.essencia.WorkProduct = function (label) {
    OG.shape.essencia.WorkProduct.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.essencia.WorkProduct';
    this.LABEL_EDITABLE = false;
    this.label = label;
};
OG.shape.essencia.WorkProduct.prototype = new OG.shape.GeomShape();
OG.shape.essencia.WorkProduct.superclass = OG.shape.GeomShape;
OG.shape.essencia.WorkProduct.prototype.constructor = OG.shape.essencia.WorkProduct;
OG.WorkProduct = OG.shape.essencia.WorkProduct;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.essencia.WorkProduct.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Polygon([
        [10,30],
        [30,10],
        [90,10],
        [90,90],
        [10,90]
    ]);

    this.geom.style = new OG.geometry.Style({
        'label-position': 'middle',
        'stroke-width': 2.5
    });

    return this.geom;
};
