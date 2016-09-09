Ext.define('Flamingo.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    routes: {
        ':node': 'onRouteChange'
    },

    onSelect: function(view, record) {
        this.redirectTo(record.get('view'));
    },

    onRouteChange: function(token) {
        this.changeView(token);
    },

    changeView: function(hashtag) {
        var me = this,
            refs = me.getReferences(),
            view;

        refs.mainContainer.removeAll();

        try {
            view = Ext.create({
                xtype: hashtag,
                routeId: hashtag
            });
        } catch(err) {
            me.redirectTo('designer');
            return;
        }

        refs.mainContainer.add(view);
    }

});
