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
Ext.define('Flamingo.view.workflowdesigner.property._ColumnGrid_Prev', {
    extend: 'Flamingo.view.workflowdesigner.property._Grid',
    alias: 'widget._prevColumnGrid',

    store: Ext.create('Ext.data.Store', {
        fields: [
            {name: 'prevQualifier'},
            {name: 'prevColumnNames'},
            {name: 'prevColumnKorNames'},
            {name: 'prevColumnTypes'},
            {name: 'prevColumnDescriptions'}
        ],
        data: []
    }),
    selType: 'rowmodel',
    forceFit: true,
    columnLines: true,
    columns: [
        {
            text: 'Previous qualifier',
            dataIndex: 'prevQualifier',
            width: 50,
            hidden: true,
            sortable: false,
            menuDisabled: true
        },
        {
            text: 'Column name (English)',
            dataIndex: 'prevColumnNames',
            width: 100,
            sortable: false,
            editor: {
                vtype: 'alphanum',
                allowBlank: false,
                listeners: {
                    errorchange: function (comp, error, eopts) {
                        comp.focus(false, 50);
                    }
                }
            }
        },
        {
            text: 'Column name (Korea)',
            dataIndex: 'prevColumnKorNames',
            width: 100,
            sortable: false,
            editor: {
                vtype: 'exceptcomma',
                allowBlank: true
            }
        },
        {
            text: 'Data type',
            dataIndex: 'prevColumnTypes',
            width: 80,
            sortable: false,
            editor: {
                xtype: 'combo',
                allowBlank: false,
                editable: false,
                triggerAction: 'all',
                queryMode: 'local',
                mode: 'local',
                store: [
                    ['String', 'String'],
                    ['Integer', 'Integer'],
                    ['Long', 'Long'],
                    ['Float', 'Float'],
                    ['Double', 'Double'],
                    ['Bytes', 'Bytes'],
                    ['Boolean', 'Boolean'],
                    ['Tuple', 'Tuple'],
                    ['Bag', 'Bag'],
                    ['Map', 'Map']
                ],
                listClass: 'x-combo-list-small'
            }
        },
        {
            text: 'Comment',
            dataIndex: 'prevColumnDescriptions',
            width: 150,
            sortable: false,
            editor: {
                vtype: 'exceptcomma',
                allowBlank: true
            }
        }
    ]
});