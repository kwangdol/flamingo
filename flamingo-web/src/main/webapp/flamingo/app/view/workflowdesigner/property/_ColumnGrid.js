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
Ext.define('Flamingo.view.workflowdesigner.property._ColumnGrid', {
    extend: 'Flamingo.view.workflowdesigner.property._Grid',
    alias: 'widget._columnGrid',

    store: Ext.create('Ext.data.Store', {
        fields: [
            {name: 'columnNames'},
            {name: 'columnKorNames'},
            {name: 'columnTypes'},
            {name: 'columnDescriptions'}
        ],
        data: []
    }),
    selType: 'rowmodel',
    forceFit: true,
    columnLines: true,
    columns: [
        {
            text: 'Column name (English)',
            dataIndex: 'columnNames',
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
            dataIndex: 'columnKorNames',
            width: 100,
            sortable: false,
            editor: {
                vtype: 'exceptcomma',
                allowBlank: true
            }
        },
        {
            text: 'Data type',
            dataIndex: 'columnTypes',
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
                    ['Map', 'Map']
                ],
                listClass: 'x-combo-list-small'
            }
        },
        {
            text: 'Comment',
            dataIndex: 'columnDescriptions',
            width: 150,
            sortable: false,
            editor: {
                vtype: 'exceptcomma',
                allowBlank: true
            }
        }
    ],

    /**
     * 최소 레코드 갯수
     */
    minRecordLength: 1
});