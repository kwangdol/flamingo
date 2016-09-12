/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: 'Flamingo',

    extend: 'Flamingo.Application',

    requires: [
        'Flamingo.view.main.Main',
        'Flamingo.view.hdfsbrowser.Browser',
        'Flamingo.view.ooziemonitoring.Oozie',
        'Flamingo.view.workflowdesigner.Designer'
    ],

    // The name of the initial view to create. With the classic toolkit this class
    // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
    // modern toolkit, the main view will be added to the Viewport.
    //
    mainView: 'Flamingo.view.main.Main'
	
    //-------------------------------------------------------------------------
    // Most customizations should be made to Flamingo.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------
});
