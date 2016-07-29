OG.shape.bpmn.Event = function (label) {
    OG.shape.bpmn.Event.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.bpmn.Event';
    this.label = label;
};
OG.shape.bpmn.Event.prototype = new OG.shape.GeomShape();
OG.shape.bpmn.Event.superclass = OG.shape.GeomShape;
OG.shape.bpmn.Event.prototype.constructor = OG.shape.bpmn.Event;
OG.Event = OG.shape.bpmn.Event;