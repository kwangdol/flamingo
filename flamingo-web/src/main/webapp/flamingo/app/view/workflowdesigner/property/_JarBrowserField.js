/*
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 *  Inner FieldContainer : BrowserField
 *
 * @class
 * @extends Ext.form.FieldContainer
 * @author <a href="mailto:hrkenshin@gmail.com">Seungbaek Lee</a>
 */
Ext.define('Flamingo.view.workflowdesigner.property._JarBrowserField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget._jarBrowserField',

    layout: 'hbox',

    fieldLabel: 'Path',

    items: [
        {
            xtype: 'textfield',
            name: 'jar',
            allowBlank: false,
            flex: 1,
            emptyText: 'Set a JAR file path.',
            listeners: {
                errorchange: function (comp, error, eopts) {
                    comp.focus(false, 50);
                }
            }
        },
        {
            xtype: 'button',
            text: 'Find',
            margin: '0 0 0 3',
            handler: function () {
                var popWindow = Ext.create('Ext.Window', {
                    layout: 'fit',
                    title: 'HDFS Browser',
                    width: 800,
                    height: 400,
                    modal: true,
                    constrain: true,
                    items: [
                        {
                            xtype: 'hdfsBrowserPanelForDesigner'
                        }
                    ],
                    buttonAlign: 'center',
                    buttons: [
                        {
                            text: 'Confirm',

                            handler: function () {
                                var selection = Ext.ComponentQuery.query('hdfsFilePanelForDesigner')[0].getSelectionModel().getSelection();
                                if (selection.length > 0) {
                                    var path = selection[0].get('path') + '/' + selection[0].get('filename');
                                    if (App.Util.String.endsWith(path, '.jar')) {
                                        var textfield = Ext.ComponentQuery.query('_jarBrowserField > textfield')[0];
                                        textfield.setValue(path);
                                        popWindow.close();
                                    } else {
                                        error('Warning', 'Select a jar file');
                                    }
                                }
                            }
                        },
                        {
                            text: 'Cancel',

                            handler: function () {
                                popWindow.close();
                            }
                        }
                    ]
                }).center().show();
            }
        }
    ]
});