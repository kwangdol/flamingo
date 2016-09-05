Ext.define('Flamingo.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'Flamingo.view.main.MainController',
        'Flamingo.view.main.MainModel'
    ],

    controller: 'main',
    viewModel: 'main',

    title: 'Flamingo'

});
