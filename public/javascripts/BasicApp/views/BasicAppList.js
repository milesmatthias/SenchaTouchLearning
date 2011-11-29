basicapp.views.BasicAppInnerList = Ext.extend(Ext.List, {
    itemTpl: basicapp.views.innerListItemTpl()
});


// This defines the main layout
basicapp.views.BasicAppList = Ext.extend(Ext.Panel, {
    layout: 'fit',
    dockedItems: [{
        xtype: 'toolbar',
        title: 'Basic App'
    }],
    items:[
        new basicapp.views.BasicAppInnerList({
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
            })
        })
    ]
});