Ext.regApplication({
    name: 'basicapp',
    useLoadMask: true,
    profiles: {
        phone: function() {
            return Ext.is.Phone;
            // This works with the XCode iOS simulator, but not with
            // changing the user agent in Safari.
        },
        tabletPortrait: function() {
            return Ext.is.Tablet && Ext.orientation == 'portrait';
            // This works in both the iOS simulator and Safari.
        },
        tabletLandscape: function() {
            return Ext.is.Tablet && Ext.orientation == 'landscape';
            // This works in both the iOS simulator and Safari.
        }
    },
    launch: function() {
        this.views.viewport = new this.views.Viewport();
    }
});
