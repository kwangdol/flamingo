Ext.define('Flamingo.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    stores: {
        menu: {
            fields: ['text', 'icon', 'view'],
            data: [{
                text: 'Workflow Designer',
                icon: 'fa fa-pencil-square-o',
                view: 'designer'
            },{
                text: 'Ooozi Monitoring',
                icon: 'fa fa-area-chart',
                view: 'monitoring'
            },{
                text: 'HDFS Browser',
                icon: 'fa fa-file-text-o',
                view: 'hdfsbrowser'
            }]
        }
    }

});
