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
Ext.namespace('Flamingo.view.workflowdesigner.property.designer');
Ext.define('Flamingo.view.workflowdesigner.property.bpmn.BPMN_JOIN', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE',
    alias: 'widget.BPMN_JOIN',

    requires: [],

    width: 600,
    height: 350,

    items: [
        {
            title: 'Parallel termination option',
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
            items: []
        }
    ]
});