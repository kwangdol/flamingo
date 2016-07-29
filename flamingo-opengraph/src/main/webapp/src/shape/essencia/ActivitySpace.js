/**
 * BPMN : ActivitySpace Event Shape
 *
 * @class
 * @extends OG.shape.GroupShape
 * @requires OG.common.*, OG.geometry.*
 *
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 */
OG.shape.essencia.ActivitySpace = function (label) {
    OG.shape.essencia.ActivitySpace.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.essencia.ActivitySpace';
    this.LABEL_EDITABLE = false;
    this.label = label;
};
OG.shape.essencia.ActivitySpace.prototype = new OG.shape.GeomShape();
OG.shape.essencia.ActivitySpace.superclass = OG.shape.GeomShape;
OG.shape.essencia.ActivitySpace.prototype.constructor = OG.shape.essencia.ActivitySpace;
OG.ActivitySpace = OG.shape.essencia.ActivitySpace;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.essencia.ActivitySpace.prototype.createShape = function () {
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
        'stroke-dasharray': '-',
        'stroke-width': 2.5
    });

    return this.geom;
};

/**
 * Shape 간의 연결을 위한 Terminal 을 반환한다.
 *
 * @return {OG.Terminal[]} Terminal
 * @override
 */
OG.shape.essencia.ActivitySpace.prototype.createTerminal = function () {
    if (!this.geom) {
        return [];
    }

    var envelope = this.geom.getBoundary();

    return [
        new OG.Terminal(envelope.getCentroid(), OG.Constants.TERMINAL_TYPE.C, OG.Constants.TERMINAL_TYPE.INOUT),
        new OG.Terminal(envelope.getRightCenter(), OG.Constants.TERMINAL_TYPE.E, OG.Constants.TERMINAL_TYPE.INOUT),
        new OG.Terminal(envelope.getLeftCenter(), OG.Constants.TERMINAL_TYPE.W, OG.Constants.TERMINAL_TYPE.INOUT),
        new OG.Terminal(envelope.getLowerCenter(), OG.Constants.TERMINAL_TYPE.S, OG.Constants.TERMINAL_TYPE.INOUT),
        new OG.Terminal(envelope.getUpperCenter(), OG.Constants.TERMINAL_TYPE.N, OG.Constants.TERMINAL_TYPE.INOUT)

    ];
};