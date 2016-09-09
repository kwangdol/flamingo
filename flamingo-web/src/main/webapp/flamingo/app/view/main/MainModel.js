Ext.define('Flamingo.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    stores: {
        menu: {
            fields: ['text', 'icon'],
            data: [{
                text: 'Workflow Designer',
                icon: 'fa fa-pencil-square-o'
            },{
                text: 'Ooozi Monitoring',
                icon: 'fa fa-area-chart'
            },{
                text: 'HDFS Browser',
                icon: 'fa fa-file-text-o'
            }]
        }
    }

});
