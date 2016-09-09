Ext.define('Flamingo.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',

    requires: [
        'Flamingo.view.main.MainController',
        'Flamingo.view.main.MainModel'
    ],

    controller: 'main',
    viewModel: 'main',

    layout: 'border',

    items: [{
        xtype: 'component',
        region: 'north',
        height: 80,
        cls: 'header',
        html: '<div class="logo"><h1>FLAMINGO</h1></div>'
    },{
        xtype: 'dataview',
        region: 'west',
        bind: {
            store: '{menu}'
        },
        width: 260,
        cls: 'nav',
        itemSelector: 'li',
        tpl: [
            '<ul>',
            '<tpl for=".">',
                '<li class="depth_1">{text}<span class="icon"><i class="{icon}" aria-hidden="true"></i></span>',
            '</tpl>',
            '</ul>'
        ],
        listeners: {
            select: 'onSelect'
        }
    },{
        xtype: 'container',
        region: 'center',
        flex: 1
    }]

});
