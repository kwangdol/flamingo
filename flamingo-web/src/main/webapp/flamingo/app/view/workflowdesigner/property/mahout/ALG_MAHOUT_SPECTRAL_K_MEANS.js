/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Ext.ns('Flamingo.view.workflowdesigner.property.mahout');
Ext.define('Flamingo.view.workflowdesigner.property.mahout.ALG_MAHOUT_SPECTRAL_K_MEANS', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_ALG',
    alias: 'widget.ALG_MAHOUT_SPECTRAL_K_MEANS',

    requires: [
        'Flamingo.view.workflowdesigner.property._ConfigurationBrowserField',
        'Flamingo.view.workflowdesigner.property._BrowserField',
        'Flamingo.view.workflowdesigner.property._ColumnGrid',
        'Flamingo.view.workflowdesigner.property._DependencyGrid',
        'Flamingo.view.workflowdesigner.property._NameValueGrid',
        'Flamingo.view.workflowdesigner.property._KeyValueGrid',
        'Flamingo.view.workflowdesigner.property._EnvironmentGrid'
    ],

    width: 450,
    height: 320,

    items: [
        {
            title: 'Parameter',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 150
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [

                {
                    xtype: 'textfield',
                    name: 'dimensions',
                    fieldLabel: 'Dimension',
                    tooltip: '',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'clusters',
                    fieldLabel: 'clusters',
                    tooltip: '',
                    vtype: 'numeric',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'distanceMeasure',
                    fieldLabel: 'Distance Measure Class',
                    tooltip: '',
                    allowBlank: false,
                    value: 'SquaredEuclidean'
                },
                {
                    xtype: 'textfield',
                    name: 'convergenceDelta',
                    fieldLabel: 'Convergence Delta',
                    tooltip: '',
                    vtype: 'numeric',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'maxIter',
                    fieldLabel: 'Max. Number of Iteration',
                    vtype: 'numeric',
                    allowBlank: true
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Overwrite output directory',
                    defaultType: 'checkboxfield',
                    items: [
                        {
                            name: 'overwrite'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Uses SSVD',
                    defaultType: 'checkboxfield',
                    items: [
                        {
                            name: 'usessvd'
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    name: 'reduceTasks',
                    fieldLabel: 'Number of reducers for SSVD',
                    vtype: 'numeric',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'outerProdBlockHeight',
                    fieldLabel: 'Block height outer SSVD',
                    vtype: 'numeric',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'oversampling',
                    fieldLabel: 'Oversampling SSVD',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'powerIter',
                    fieldLabel: 'Additional power iteration SSVD',
                    vtype: 'numeric',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'tempDir',
                    fieldLabel: 'Temp Directory',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'startPhase',
                    fieldLabel: 'Start Phase',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'endPhase',
                    fieldLabel: 'End Phase',
                    allowBlank: true
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
                    fieldLabel: 'Mahout JAR',
                    value: MAHOUT.JAR,
                    disabledCls: 'disabled-plain',
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    name: 'driver',
                    fieldLabel: 'Driver',
                    value: 'org.apache.mahout.clustering.spectral.kmeans.SpectralKMeansDriver',
                    disabledCls: 'disabled-plain',
                    readOnly: true
                },
                {
                    xtype: '_dependencyGrid',
                    title: 'Dependency JAR',
                    flex: 1
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
                        hideLabel: true
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
            ],
            listeners: {
                afterrender: function (form, eOpts) {
                    var canvas = Ext.ComponentQuery.query('canvas')[0];
                    var canvasForm = canvas.getForm();
                }
            }
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
                    value: '<a href="http://mahout.apache.org/users/clustering/spectral-clustering.html" target="_blank">Spectral Clustering</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://www.slideshare.net/bigdatasyd/machine-learning-withmahout" target="_blank">Machine Learning with Mahout</a>'
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
            "driver": props.driver ? props.driver : '',
            "jar": props.jar ? props.jar : '',
            "confKey": props.hadoopKeys ? props.hadoopKeys : '',
            "confValue": props.hadoopValues ? props.hadoopValues : '',
            params: []
        };

//        props.mapreduce.params.push("spectralkmeans");

        if (props.input) {
            props.mapreduce.params.push("--input", props.input);
        }

        if (props.output) {
            props.mapreduce.params.push("--output", props.output);
        }

        if (props.dimensions) {
            props.mapreduce.params.push("--dimensions", props.dimensions);
        }

        if (props.clusters) {
            props.mapreduce.params.push("--clusters", props.clusters);
        }

        if (props.distanceMeasure) {
            props.mapreduce.params.push("--distanceMeasure", props.distanceMeasure);
        }

        if (props.convergenceDelta) {
            props.mapreduce.params.push("--convergenceDelta", props.convergenceDelta);
        }

        if (props.maxIter) {
            props.mapreduce.params.push("--maxIter", props.maxIter);
        }

        if (props.overwrite) {
            props.mapreduce.params.push("--overwrite");
        }

        if (props.usessvd) {
            props.mapreduce.params.push("--usessvd");
        }

        if (props.reduceTasks) {
            props.mapreduce.params.push("--reduceTasks", props.reduceTasks);
        }
////
        if (props.outerProdBlockHeight) {
            props.mapreduce.params.push("--outerProdBlockHeight", props.outerProdBlockHeight);
        }

        if (props.oversampling) {
            props.mapreduce.params.push("--oversampling", props.oversampling);
        }

        if (props.powerIter) {
            props.mapreduce.params.push("--powerIter", props.powerIter);
        }

        if (props.tempDir) {
            props.mapreduce.params.push("--tempDir", props.tempDir);
        }

        if (props.startPhase) {
            props.mapreduce.params.push("--startPhase", props.startPhase);
        }

        if (props.endPhase) {
            props.mapreduce.params.push("--endPhase", props.endPhase);
        }

        this.callParent(arguments);
    }
});