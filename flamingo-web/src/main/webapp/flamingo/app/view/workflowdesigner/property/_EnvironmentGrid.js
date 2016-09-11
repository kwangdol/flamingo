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
Ext.define('Flamingo.view.workflowdesigner.property._EnvironmentGrid', {
    extend: 'Flamingo.view.workflowdesigner.property._Grid',
    alias: 'widget._environmentGrid',

    store: Ext.create('Ext.data.Store', {
        fields: [
            {name: 'environmentKeys'},
            {name: 'environmentValues'}
        ],
        data: []
    }),
    selType: 'rowmodel',
    forceFit: true,
    columnLines: true,
    columns: [
        {
            text: 'Key',
            dataIndex: 'environmentKeys',
            width: 100,
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
            text: 'Value',
            dataIndex: 'environmentValues',
            width: 100,
            editor: {
                vtype: 'exceptcomma',
                allowBlank: false,
                listeners: {
                    errorchange: function (comp, error, eopts) {
                        comp.focus(false, 30);
                    }
                }
            }
        }
    ]
});