/**
 * BPMN : LevelOfDetail Event Shape
 *
 * @class
 * @extends OG.shape.GeomShape
 * @requires OG.common.*, OG.geometry.*
 *
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 */
OG.shape.essencia.LevelOfDetail = function (label) {
    OG.shape.essencia.LevelOfDetail.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.essencia.LevelOfDetail';
    this.LABEL_EDITABLE = false;
    this.label = label;
};
OG.shape.essencia.LevelOfDetail.prototype = new OG.shape.GeomShape();
OG.shape.essencia.LevelOfDetail.superclass = OG.shape.GeomShape;
OG.shape.essencia.LevelOfDetail.prototype.constructor = OG.shape.essencia.LevelOfDetail;
OG.LevelOfDetail = OG.shape.essencia.LevelOfDetail;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.essencia.LevelOfDetail.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Polygon([
        [0,0],
        [100,0],
        [85,100],
        [15,100]
    ]);

    this.geom.style = new OG.geometry.Style({
        'label-position': 'center',
        'stroke-width': 2.5
    });

    return this.geom;
};
