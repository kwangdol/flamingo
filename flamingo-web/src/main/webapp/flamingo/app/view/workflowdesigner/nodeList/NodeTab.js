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
Ext.define('Flamingo.view.workflowdesigner.nodeList.NodeTab', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.nodeTab',

    requires: [
        'Flamingo.view.workflowdesigner.nodeList.NodeList'
    ],

    minTabWidth: 120,

    items: [
        {
            title: 'All',
            xtype: 'nodeList'
        },
        {
            title: 'Hadoop Ecosystem',
            xtype: 'nodeList',
            type: 'HADOOP'
        },
        {
            title: 'Statistics',
            xtype: 'nodeList',
            type: 'STATISTICS'
        },
        {
            title: 'Data Process',
            xtype: 'nodeList',
            type: 'ETL'
        },
        {
            title: 'Ankus',
            xtype: 'nodeList',
            type: 'MINING'
        },
        {
            title: 'Mahout',
            xtype: 'nodeList',
            type: 'MAHOUT'
        },
        {
            title: 'In-Memory',
            xtype: 'nodeList',
            type: 'INMEMORY'
        },
        {
            title: 'Integration',
            xtype: 'nodeList',
            type: 'INT'
        },
        {
            title: 'RULES',
            xtype: 'nodeList',
            type: 'RULES'
        },
        {
            title: 'ETC',
            xtype: 'nodeList',
            type: 'OTHERS'
        },
        {
            title: 'GIS',
            xtype: 'nodeList',
            type: 'GIS'
        }
    ]
});