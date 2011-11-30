Ext.ns('Ext.tux');Ext.tux.EditableList=Ext.extend(Ext.List,{componentCls:'x-editable-list',deleteAnimationCls:'x-list-item-deleted',editItemCls:'',itemEditTpl:undefined,deleteButtonUI:'delete',deleteButtonText:'Delete',allowSort:false,multiDelete:false,editing:false,deleting:false,deleteSectionCount:0,initComponent:function(){console.info('Ext.tux.EditableList: This component is still in beta version so if you find any bug, please report it writing at the component official Sencha Forum Thread at the url: '+'http://www.sencha.com/forum/showthread.php?144737-Ext.tux.EditableList-Improved-list-component.');if(this.allowSort){if(this.grouped){throw new Error('Ext.tux.EditableList: The groped property is not supported by the component at the moment if the list allow elements sorting.')}if(this.multiDelete){throw new Error('Ext.tux.EditableList: The sorting mode is not supported if the list is set in multiDelete mode. This will be fixed in the next component release.')}}var tplHtml,params;if(!this.multiDelete){tplHtml='<div class="x-list-left-icon x-icon-delete"></div>'+'<div class="x-list-content">{tpl}</div>'+'<div class="x-button x-button-{deleteButtonUI}">'+'<span class="x-button-label">{deleteButtonText}</span>'+'</div>'+'<tpl if="allowSort">'+'<div class="x-icon-sort"></div>'+'</tpl>';params={tpl:(Ext.isString(this.itemTpl)?this.itemTpl:this.itemTpl.html),allowSort:this.allowSort,deleteButtonUI:this.deleteButtonUI,deleteButtonText:this.deleteButtonText}}else{tplHtml='<div class="x-list-left-icon x-icon-deselected"></div>'+'<div class="x-list-content">{tpl}</div>'+'<tpl if="allowSort">'+'<div class="x-icon-sort"></div>'+'</tpl>';params={tpl:(Ext.isString(this.itemTpl)?this.itemTpl:this.itemTpl.html),allowSort:this.allowSort}}this.innerTpl=new Ext.XTemplate(tplHtml);this.itemTpl=this.innerTpl.apply(params);if(Ext.isDefined(this.itemEditTpl)){params.tpl=(Ext.isString(this.itemEditTpl)?this.itemEditTpl:this.itemEditTpl.html),this.innerEditTpl=new Ext.XTemplate(tplHtml);this.itemEditTpl=this.innerEditTpl.apply(params);this.editTpl='<tpl for="."><div class="x-list-item '+this.editItemCls+'"><div class="x-list-item-body">'+this.itemEditTpl+'</div></div></tpl>';this.editTpl=new Ext.XTemplate(this.editTpl)}this.itemtap=Ext.util.Functions.createInterceptor(this.itemtap,this.onItemTap,this);this.deleteIcons=new Ext.CompositeElement();this.sortIcons=new Ext.CompositeElement();this.deleteButtons=new Ext.CompositeElement();this.initEvents();Ext.tux.EditableList.superclass.initComponent.call(this);this.addEvents('beforeeditcompleted','editcompleted','deletesectionchange','sortchange','itemdeleted')},afterRender:function(){Ext.tux.EditableList.superclass.afterRender.call(this);this.mon(this.scroller,{scrollend:this.onScrollEnd,scope:this})},refresh:function(){if(!this.rendered){return}this.fireEvent("beforerefresh",this);var b=this.getTargetEl(),a=this.store.getRange(),c=this.collectData(a,0),d=this.tpl;b.update("");if(a.length<1){if(!this.deferEmptyText||this.hasSkippedEmptyText){b.update(this.emptyText)}this.all.clear();this.deleteIcons.clear();this.sortIcons.clear();this.deleteButtons.clear()}else{if(this.editing){if(Ext.isDefined(this.itemEditTpl)){d=this.editTpl}}d.overwrite(b,c);this.all.fill(Ext.query(this.itemSelector,b.dom));this.updateIndexes(0);this.deleteIcons.fill(Ext.query('.x-list-left-icon',b.dom));if(this.allowSort){this.sortIcons.fill(Ext.query('.x-icon-sort',b.dom));this.createSortable()}if(!this.multiDelete){this.deleteButtons.fill(Ext.query('.x-button',b.dom))}this.updateIconsCls()}this.hasSkippedEmptyText=true;this.fireEvent("refresh",this);this.region=new Ext.util.Region.getRegion(this.el)},updateIconsCls:function(){if(!this.editing){this.deleteIcons.addCls('x-list-left-hidden-icon');if(this.allowSort){this.sortIcons.addCls('x-list-right-hidden-icon')}}if(!this.multiDelete){this.deleteButtons.addCls('x-button-hidden')}if(this.allowSort){this.sortIcons.on('tapstart',this.onStartSorting,this)}},onScrollEnd:function(s,o){var region=Ext.util.Region.getRegion(this.el);this.all.each(function(item){if(region.intersect(Ext.util.Region.getRegion(item))){if(!item.hasCls('x-animated')){item.addCls('x-animated')}}else{if(item.hasCls('x-animated')){item.removeCls('x-animated')}}})},onStartSorting:function(){this.sortable.enable();if(!this.multiDelete&&this.deleting){this.exitDeleteMode()}},edit:function(){if(!this.editing){this.editing=true;this.switchState(this.editing)}},editCompleted:function(){if(this.editing){this.fireEvent('beforeeditcompleted',this);this.editing=false;this.switchState(this.editing);this.fireEvent('editcompleted',this)}},isEditing:function(){return this.editing},isDeleting:function(){return this.deleting},isSorting:function(){return this.sortable.isSorting()},getDeleteAnimationCls:function(){return this.deleteAnimationCls},setDeleteAnimationCls:function(cls){this.deleteAnimationCls=cls},createSortable:function(){this.sortable=new Ext.tux.util.Sortable(this.el,{itemSelector:'.x-list-item',direction:'vertical',scroll:true,constrain:true,disabled:true,listeners:{sortend:function(sortable,el,e,oldIndex,newIndex){var record=this.store.getAt(oldIndex);this.store.removeAt(oldIndex);this.store.insert(newIndex,record);sortable.disable();this.fireEvent('sortchange',this,record,el,oldIndex,newIndex)},scope:this}})},switchState:function(edit){this.refresh();if(edit){this.el.addCls('x-list-editing')}else{this.el.removeCls('x-list-editing')}this.setIconCls(this.deleteIcons,'left',edit);if(this.allowSort){this.setIconCls(this.sortIcons,'right',edit)}},setIconCls:function(icons,pos,edit){var direction=(edit?'in':'out');var animationCls=Ext.util.Format.format('x-{0}-icon-slide-{1}',pos,direction);var iconHiddenCls=Ext.util.Format.format('x-list-{0}-hidden-icon',pos);icons.addCls(animationCls);Ext.each(icons,function(icon){icon.on('webkitAnimationEnd',function(){if(edit){icon.removeCls(iconHiddenCls)}else{icon.addCls(iconHiddenCls)}icon.removeCls(animationCls);if(pos=='left'){if(this.multiDelete){if(icon.hasCls('x-icon-selected')){icon.removeCls('x-icon-selected');icon.addCls('x-icon-deselected')}}}},this)},this);this.clearDeleteSelection()},clearDeleteSelection:function(){if(this.multiDelete){this.deleteSectionCount=0;this.fireEvent('deletesectionchange',this,this.deleteSectionCount)}},onItemTap:function(list,index,item,e){if(this.editing){var el=Ext.get(item.target);var className=el.dom.className;var listItem,deleteBtn,sortIcon,record;if(!this.multiDelete){this.exitDeleteMode();switch(className){case 'x-list-left-icon x-icon-delete':listItem=el.up('.x-list-item');deleteBtn=listItem.down('.x-button');el.addCls('x-icon-rotate-start');deleteBtn.addCls('x-button-slide-in');deleteBtn.on('webkitAnimationEnd',function(event){deleteBtn.removeCls('x-button-hidden');deleteBtn.removeCls('x-button-slide-in')});if(this.allowSort){sortIcon=listItem.down('.x-icon-sort');sortIcon.addCls('x-right-icon-slide-out');sortIcon.on('webkitAnimationEnd',function(event){sortIcon.removeCls('x-right-icon-slide-out');sortIcon.addCls('x-list-right-hidden-icon')})}this.tappedEl=listItem;this.deleting=true;break;case 'x-button x-button-delete':case 'x-button-label':record=this.store.getAt(index);this.deleteItem(record,this.tappedEl);break}}else{listItem=(className=='x-list-item'?el:el.up('.x-list-item'));selectIcon=listItem.down('.x-list-left-icon');var record=this.store.getAt(index);if(selectIcon.hasCls('x-icon-selected')){selectIcon.removeCls('x-icon-selected');selectIcon.addCls('x-icon-deselected');record.data.toDelete=false;this.deleteSectionCount--}else{selectIcon.removeCls('x-icon-deselected');selectIcon.addCls('x-icon-selected');record.data.toDelete=true;this.deleteSectionCount++}this.fireEvent('deletesectionchange',this,this.deleteSectionCount)}return false}},exitDeleteMode:function(){if(this.deleting){var listItem=this.tappedEl;var deleteIcon=listItem.down('.x-icon-delete');var sortIcon=listItem.down('.x-icon-sort');deleteBtn=listItem.down('.x-button');deleteIcon.removeCls('x-icon-rotate-start');deleteIcon.addCls('x-icon-rotate-end');deleteIcon.on('webkitAnimationEnd',function(event){deleteIcon.removeCls('x-icon-rotate-end')});if(this.allowSort){this.setIconCls(sortIcon,'right',true)}deleteBtn.addCls('x-button-slide-out');deleteBtn.on('webkitAnimationEnd',function(event){deleteBtn.removeCls('x-button-slide-out');deleteBtn.addCls('x-button-hidden')});this.deleting=false}},deleteSelected:function(){this.store.each(function(record){if(record.get('toDelete')==true){var index=this.store.indexOf(record);this.deleteItem(record,this.all.item(index))}},this);this.clearDeleteSelection()},deleteItem:function(record,el){el.addCls(this.deleteAnimationCls);el.on('webkitAnimationEnd',function(event){if(event.browserEvent.animationName==this.deleteAnimationCls+'-animation'){this.store.remove(record);this.fireEvent('itemdeleted',this,record,el)}},this)}});Ext.reg('editablelist',Ext.tux.EditableList);