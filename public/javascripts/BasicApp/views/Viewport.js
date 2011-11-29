// This is the "main" wrapper viewport
basicapp.views.Viewport = Ext.extend(Ext.Panel, {
    fullscreen:true,
    layout: 'fit',
    initComponent: function(){
        basicapp.views.basicAppList = new basicapp.views.BasicAppList();
        Ext.apply(this, {
            items: [
                basicapp.views.basicAppList
            ]
        });
        basicapp.views.Viewport.superclass.initComponent.apply(this, arguments);
    }
})