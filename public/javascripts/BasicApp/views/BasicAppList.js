var btnAlert = function(btn){
    alert(btn.getText()+ " was pressed!");
}

// This defines the main layout
basicapp.views.BasicAppList = Ext.extend(Ext.Panel, {
    layout: 'fit',
    dockedItems: [{
        xtype: 'toolbar',
        itemId: 'toolbar',
        title: 'Basic App',
        dock: 'top',
        items: [{
            xtype: 'button',
            text: 'Edit',
            itemId: 'btnEdit',
            ui: 'action',
            scope: this,
            handler: function(btn){
                var list = this.viewport.getComponent('lstTU');
                var btnDelete = this.viewport.getDockedComponent('btmToolbar').getComponent('btnDelete');
                if(btn.getText() == 'Edit'){
                    list.edit();
                    btnDelete.show('pop');
                    btn.setText('Done');
                }else{
                    list.editCompleted();
                    btnDelete.hide('pop');
                    btn.setText('Edit');
                }
            }
        },{
            xtype: 'spacer'
        },{
            xtype: 'button',
            iconCls: 'add',
            iconMask: true,
            ui: 'add',
            scope: this,
            handler: btnAlert
        }]
    },{
        xtype: 'toolbar',
        dock: 'bottom',
        itemId: 'btmToolbar',
        items: [{
            xtype: 'button',
            ui: 'delete',
            itemId: 'btnDelete',
            text: 'Delete',
            iconCls: 'trash',
            iconMask: true,
            scope: this,
            hidden: true,
            disabled: true,
            handler: function(){
                var list = this.viewport.getComponent('lstTU');
                list.deleteSelected();
            }
        }]
    }],
    items:[{
        xtype: 'editablelist',
        itemTpl: basicapp.views.innerListItemTpl(),
        multiDelete: true,
        itemId: 'lstTU',
        store: new Ext.data.Store({
            id: 'store_tu',
            model: 'basicapp.models.TwitterUser',
            autoLoad: true,
            proxy: {
                type: 'scripttag',
                url: 'https://api.twitter.com/1/statuses/public_timeline.json?count=2',
                // the parameter above doesn't seem to make any difference.
                /*extraParams: {
                    count: '2'
                },*/
                // The above doesn't make any difference either.
                // This must be something to do with Twitter's API
                // so, whatever.
                reader: {
                    type: 'json',
                }
            }
        }),
        listeners: {
            deleteSectionChange: function(list, tot){
                var btnDelete = this.viewport.getDockedComponent('btmToolbar').getComponent('btnDelete');
                if(tot!=0){
                    btnDelete.setText(Ext.util.Format.format('Delete ({0})', tot));
                    btnDelete.enable();
                }else{
                    btnDelete.setText('Delete');
                    btnDelete.disable();
                }
            },
            scope: this
        }
    }]
});
