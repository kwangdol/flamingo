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
 * Extract Link From GPS
 *
 * @cli hadoop jar flamingo2-mapreduce-hadoop2-2.1.0-job.jar extractLink --input <INPUT> --output <OUTPUT> --inputDelimiter ',' --csvPath <CSV_PATH> --csvDelimiter '|' --linkidColumnIndex 1 --latitudeColumnIndex 1 --longitudeColumnIndex 2 --detectDistance 5.0
 * @extend Flamingo.view.workflowdesigner.property._NODE_ETL
 * @author <a href="mailto:haneul.kim@cloudine.co.kr">Haneul, Kim</a>
 * @see <a href="http://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html" target="_blank">Apache Hadoop MapReduce Tutorial</a>
 * @see <a href="http://nodelink.its.go.kr/data/data01.aspx" target="_blank">전국 표준 노드 링크</a>
 */
Ext.ns('Flamingo.view.workflowdesigner.property.gis');
Ext.define('Flamingo.view.workflowdesigner.property.gis.ExtractLink', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_ETL',
    alias: 'widget.ExtractLink',

    width: 450,
    height: 320,

    items: [
        {
            title: 'Parameter',
            xtype: 'form',
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                labelWidth: 170
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Input Delimiter',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'combo',
                            name: 'inputDelimiter',
                            value: ',',
                            editable: false,
                            displayField: 'name',
                            valueField: 'value',
                            queryMode: 'local',
                            tpl: '<tpl for="."><div class="x-boundlist-item" data-qtip="{description}">{name}</div></tpl>',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'value', 'description'],
                                data: [
                                    {
                                        name: 'Double Colon',
                                        value: '::',
                                        description: '::'
                                    },
                                    {
                                        name: 'Comma',
                                        value: ',',
                                        description: ','
                                    },
                                    {
                                        name: 'Pipe',
                                        value: '|',
                                        description: '|'
                                    },
                                    {
                                        name: 'Tab',
                                        value: '\u0009',
                                        description: '\\t'
                                    },
                                    {
                                        name: 'Blank',
                                        value: '\u0020',
                                        description: ' '
                                    },
                                    {
                                        name: 'User Defined',
                                        value: 'CUSTOM',
                                        description: 'User Defined'
                                    }
                                ]
                            }),
                            listeners: {
                                change: function (combo, newValue, oldValue, eOpts) {
                                    // 콤보 값에 따라 관련 textfield 를 enable | disable 처리한다.
                                    var customValueField = combo.next('textfield');
                                    if (newValue === 'CUSTOM') {
                                        customValueField.enable();
                                        customValueField.isValid();
                                    } else {
                                        customValueField.disable();
                                        if (newValue) {
                                            customValueField.setValue(newValue);
                                        } else {
                                            customValueField.setValue(',');
                                        }
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            name: 'inputDelimiterValue',
                            flex: 1,
                            vtype: 'exceptcommaspace',
                            disabled: true,
                            allowBlank: false,
                            value: ','
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'CSV Delimiter',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'combo',
                            name: 'csvDelimiter',
                            value: ',',
                            editable: false,
                            displayField: 'name',
                            valueField: 'value',
                            queryMode: 'local',
                            tpl: '<tpl for="."><div class="x-boundlist-item" data-qtip="{description}">{name}</div></tpl>',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'value', 'description'],
                                data: [
                                    {
                                        name: 'Double Colon',
                                        value: '::',
                                        description: '::'
                                    },
                                    {
                                        name: 'Comma',
                                        value: ',',
                                        description: ','
                                    },
                                    {
                                        name: 'Pipe',
                                        value: '|',
                                        description: '|'
                                    },
                                    {
                                        name: 'Tab',
                                        value: '\u0009',
                                        description: '\\t'
                                    },
                                    {
                                        name: 'Blank',
                                        value: '\u0020',
                                        description: ' '
                                    },
                                    {
                                        name: 'User Defined',
                                        value: 'CUSTOM',
                                        description: 'User Defined'
                                    }
                                ]
                            }),
                            listeners: {
                                change: function (combo, newValue, oldValue, eOpts) {
                                    // 콤보 값에 따라 관련 textfield 를 enable | disable 처리한다.
                                    var customValueField = combo.next('textfield');
                                    if (newValue === 'CUSTOM') {
                                        customValueField.enable();
                                        customValueField.isValid();
                                    } else {
                                        customValueField.disable();
                                        if (newValue) {
                                            customValueField.setValue(newValue);
                                        } else {
                                            customValueField.setValue(',');
                                        }
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            name: 'csvDelimiterValue',
                            flex: 1,
                            vtype: 'exceptcommaspace',
                            disabled: true,
                            allowBlank: false,
                            value: ','
                        }
                    ]
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Link ID Column Index',
                    name: 'linkidColumnIndex',
                    minValue: 0
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Lat. Column Index',
                    name: 'latitudeColumnIndex',
                    minValue: 0
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Lng. Column Index',
                    name: 'longitudeColumnIndex',
                    minValue: 0
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Detect Distance',
                    name: 'detectDistance',
                    minValue: 0
                },
                {
                    xtype: '_browserField',
                    fieldLabel: 'CSV Path in HDFS',
                    name: 'csvPath',
                    readOnly: false,
                    allowBlank: false,
                    flex: 1
                }
            ]
        },
        {
            title: 'MapReduce',
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
                    xtype: 'textfield',
                    name: 'jar',
                    fieldLabel: 'JAR Path',
                    value: ETL.JAR,
                    disabledCls: 'disabled-plain',
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    name: 'driver',
                    fieldLabel: 'Driver',
                    value: 'extractLink',
                    disabledCls: 'disabled-plain',
                    readOnly: true
                }
            ]
        },
        {
            title: 'I/O Path',
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
                    value: 'Enter a key and a value of Configuration.set () method used in Hadoop Mapreduce.'
                },
                {
                    xtype: '_keyValueGrid',
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
                    value: '<a href="http://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html" target="_blank">Apache Hadoop MapReduce Tutorial</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://nodelink.its.go.kr/data/data01.aspx" target="_blank">전국 표준 노드 링크</a>'
                }
            ]
        }
    ],

    /**
     * UI 컴포넌트의 Key를 필터링한다.
     *
     * ex) 다음과 같이 필터를 설정할 수 있다.
     * propFilters: {
     *     // 추가할 프라퍼티
     *     add   : [
     *         {'test1': '1'},
     *         {'test2': '2'}
     *     ],
     *
     *     // 변경할 프라퍼티
     *     modify: [
     *         {'delimiterType': 'delimiterType2'},
     *         {'config': 'config2'}
     *     ],
     *
     *     // 삭제할 프라퍼티
     *     remove: ['script', 'metadata']
     * }
     */
    propFilters: {
        add: [],
        modify: [],
        remove: ['config']
    },

    /**
     * MapReduce의 커맨드 라인 파라미터를 수동으로 설정한다.
     * 커맨드 라인 파라미터는 Flamingo2 Workflow Engine에서 props.mapreduce를 Key로 꺼내어 구성한다.
     *
     * @param props UI 상에서 구성한 컴포넌트의 Key Value값
     */
    afterPropertySet: function (props) {
        props.mapreduce = {
            driver: props.driver || '',
            jar: props.jar || '',
            confKey: props.hadoopKeys || '',
            confValue: props.hadoopValues || '',
            params: []
        };

        if (props.input) {
            props.mapreduce.params.push("--input", props.input);
        }
        if (props.output) {
            props.mapreduce.params.push("--output", props.output);
        }
        if (props.inputDelimiter) {
            props.mapreduce.params.push('--inputDelimiter', '\'' + (props.inputDelimiter === 'CUSTOM' ? props.inputDelimiterValue : props.inputDelimiter) + '\'');
        }
        if (props.csvDelimiter) {
            props.mapreduce.params.push('--csvDelimiter', '\'' + (props.csvDelimiter === 'CUSTOM' ? props.csvDelimiterValue : props.csvDelimiter) + '\'');
        }
        props.mapreduce.params.push("--linkidColumnIndex", props.linkidColumnIndex);
        props.mapreduce.params.push("--longitudeColumnIndex", props.longitudeColumnIndex);
        props.mapreduce.params.push("--latitudeColumnIndex", props.latitudeColumnIndex);
        props.mapreduce.params.push("--detectDistance", props.detectDistance);
        props.mapreduce.params.push("--csvPath", '\'' + props.csvPath + '\'');

        this.callParent(arguments);
    }
});