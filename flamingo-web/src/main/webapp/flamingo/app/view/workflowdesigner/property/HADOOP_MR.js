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
Ext.define('Flamingo.view.workflowdesigner.property.HADOOP_MR', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_HADOOP',
    alias: 'widget.HADOOP_MR',

    requires: [
        'Flamingo.view.workflowdesigner.property.browser.hdfs.BrowserPanel',
        'Flamingo.view.workflowdesigner.property._JarBrowserField',
        'Flamingo.view.workflowdesigner.property._JarGrid',
        'Flamingo.view.workflowdesigner.property._InputGrid',
        'Flamingo.view.workflowdesigner.property._BrowserField',
        'Flamingo.view.workflowdesigner.property._KeyValueGrid',
        'Flamingo.view.workflowdesigner.property._CommandlineGrid'
    ],

    width: 600,
    height: 300,

    items: [
        {
            xtype: 'form',
            title: 'MapReduce',
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'displayfield',
                    value: 'The operation is based on a MapReduce Driver.'
                },
                {
                    xtype: '_jarBrowserField'
                },
                {
                    xtype: 'textfield',
                    name: 'driver',
                    fieldLabel: 'Driver',
                    emptyText: 'Please specify the driver class.',
                    allowBlank: false
                },
                {
                    xtype: '_jarGrid',
                    title: 'Dependency JAR',
                    flex: 1
                }
            ]
        },
        {
            title: 'I/O Path',
            xtype: 'form',
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: '_inputGrid',
                    title: 'Input Path',
                    flex: 1
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Output path',
                    defaults: {
                        hideLabel: true,
                        margin: "5 0 0 0"  // Same as CSS ordering (top, right, bottom, left)
                    },
                    layout: 'hbox',
                    items: [
                        {
                            xtype: '_browserField',
                            name: 'output',
                            allowBlank: false,
                            readOnly: false,
                            flex: 1
                        }
                    ]
                }
            ]
        },
        {
            title: 'Hadoop Configuration',
            xtype: 'form',
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: 'Enter a key and a value of Configuration.set () method used in Hadoop Mapreduce.'
                },
                {
                    xtype: '_keyValueGrid',
                    flex: 1
                }
            ]
        },
        {
            title: 'Command Parameter',
            xtype: 'form',
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'displayfield',
                    height: 50,
                    value: 'Please enter command line parameters in separate lines.<br>For example, if you want to enter "hadoop jar <JAR> <DRIVER> -input /INPUT -output /OUTPUT," enter -input, /INPUT, -output, and /OUTPUT in different lines.'
                },
                {
                    xtype: '_commandlineGrid',
                    flex: 1
                }
            ]
        },
        {
            title: 'References',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="https://developer.yahoo.com/hadoop/tutorial/" target="_blank">Yahoo! Hadoop Tutorial</a>'
                }
            ]
        }
    ]
});