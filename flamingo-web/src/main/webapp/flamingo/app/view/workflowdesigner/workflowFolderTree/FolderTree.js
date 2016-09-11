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
Ext.define('Flamingo.view.workflowdesigner.workflowFolderTree.FolderTree', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.folderTree',

    layout: 'border',

    requires: [
        'Flamingo.view.workflowdesigner.workflowFolderTree.FolderTreeController',
        'Flamingo.view.workflowdesigner.workflowFolderTree.FolderTreeModel'
    ],

    controller: 'folderTreeController',

    viewModel: {
        type: 'folderTreeModel'
    },

    forceFit: true,

    items: [
        {
            itemId: 'folderTreeTreePanel',
            region: 'center',
            xtype: 'treepanel',
            reference: 'folderTreeTreePanel',
            rootVisible: true,
            useArrows: true,
            bind: {
                store: '{folderTree}'
            },
            viewConfig: {
                plugins: {
                    ptype: 'treeviewdragdrop',
                    enableDrop: true,
                    enableDrag: true,
                    allowContainerDrop: true
                }
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    items: [
                        {
                            iconCls: 'common-expand',
                            text: 'Elapse all',
                            tooltip: 'Elapse the tree.',
                            handler: 'onTreeExpand'
                        },
                        {
                            iconCls: 'common-collapse',
                            text: 'Collapse all',
                            tooltip: 'Collapse the tree.',
                            handler: 'onTreeCollapse'
                        },
                        '->',
                        {
                            tooltip: 'Refresh the tree.',
                            text: 'Refresh',
                            iconCls: 'common-refresh',
                            handler: 'onTreeRefresh'
                        }
                    ]
                }
            ],
            listeners: {
                render: 'onTreeRender'
            }
        }
    ]
});