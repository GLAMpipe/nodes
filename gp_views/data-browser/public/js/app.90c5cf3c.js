(function(t){function e(e){for(var a,c,i=e[0],o=e[1],u=e[2],f=0,d=[];f<i.length;f++)c=i[f],Object.prototype.hasOwnProperty.call(r,c)&&r[c]&&d.push(r[c][0]),r[c]=0;for(a in o)Object.prototype.hasOwnProperty.call(o,a)&&(t[a]=o[a]);l&&l(e);while(d.length)d.shift()();return s.push.apply(s,u||[]),n()}function n(){for(var t,e=0;e<s.length;e++){for(var n=s[e],a=!0,i=1;i<n.length;i++){var o=n[i];0!==r[o]&&(a=!1)}a&&(s.splice(e--,1),t=c(c.s=n[0]))}return t}var a={},r={app:0},s=[];function c(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.m=t,c.c=a,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)c.d(n,a,function(e){return t[e]}.bind(null,a));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],o=i.push.bind(i);i.push=e,i=i.slice();for(var u=0;u<i.length;u++)e(i[u]);var l=o;s.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"12d3":function(t,e,n){"use strict";n("dc42")},"3dfd":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[t.error?n("div",{staticClass:"alert alert-danger"},[t._v(t._s(t.error))]):t._e(),n("b-navbar",{attrs:{toggleable:"lg",type:"dark",variant:"info"}},[n("b-navbar-brand",{attrs:{href:"#"}},[t._v("GLAMpipe "),t.settings?n("span",[t._v(t._s(t.settings.pagetitle))]):t._e()]),n("b-navbar-toggle",{attrs:{target:"nav-collapse"}}),n("b-collapse",{attrs:{id:"nav-collapse","is-nav":""}},[n("b-navbar-nav",[n("b-nav-item",{attrs:{href:"#"},on:{click:function(e){return t.resetView()}}},[t._v("Reset View")])],1),n("b-navbar-nav",{staticClass:"ml-auto"},[n("b-nav-form",[n("b-form-input",{staticClass:"mr-sm-2",attrs:{size:"sm",placeholder:"Search"}}),n("b-button",{staticClass:"my-2 my-sm-0",attrs:{size:"sm",type:"submit"}},[t._v("Search")])],1)],1)],1)],1),n("b-row",[n("b-col",{staticClass:"sideBar",attrs:{cols:"3"}},[n("b-container",{attrs:{fluid:""}},[n("DBFacet",{ref:"facets"})],1)],1),n("b-col",{attrs:{cols:"9"}},[n("DBDataTable")],1)],1)],1)},r=[],s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"hello"},t._l(t.facets,(function(e){return n("b-card",{key:e.key,attrs:{title:e.title}},t._l(t.facet_data[e.key],(function(a){return n("b-list-group",{key:a._id},[n("b-list-group-item",{staticClass:"pointer",on:{click:function(n){return t.updateData(e,a._id)}}},[t._v(t._s(a._id)+" ("+t._s(a.count)+") ")])],1)})),1)})),1)},c=[],i=n("b85c"),o=n("1da1"),u=(n("96cf"),n("7db0"),n("d3b7"),n("ddb0"),n("caad"),n("2532"),n("4de4"),n("d81d"),n("a15b"),n("99af"),n("ac1f"),n("1276"),n("5319"),n("bc3a")),l=n.n(u),f={};f.getFacetValues=function(){var t=Object(o["a"])(regeneratorRuntime.mark((function t(e,n,a){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,l.a.get("/api/v2/collections/".concat(e,"/facet?fields=").concat(n,"&").concat(a));case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}}),t)})));return function(e,n,a){return t.apply(this,arguments)}}(),f.getData=function(){var t=Object(o["a"])(regeneratorRuntime.mark((function t(e,n){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,l.a.get("/api/v2/collections/".concat(e,"/docs?").concat(n));case 2:return a=t.sent,t.abrupt("return",a);case 4:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}(),f.getURLQueryParamsAsString=function(){var t=document.URL.split("?");return 2==t.length?t[1].replace(/\?/g,""):""};var d=f,p={name:"DBFacet",data:function(){return{facets:[],filters:[],facet_data:{},facet_selections:{},data:[]}},watch:{"$parent.settings":function(){console.log("config updated"),this.parseFacets(),this.loadFacetData()}},methods:{setFacetValues:function(t){for(var e in t){var n=this.facets.find((function(t){return t.key===e}));n.values=t}},setFacetSelection:function(t,e){t.key in this.facet_selections?this.facet_selections[t.key].includes(e)?this.facet_selections[t.key]=this.facet_selections[t.key].filter((function(t){return t!==e})):this.facet_selections[t.key].push(e):this.$set(this.facet_selections,t.key,[e])},loadFacetData:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){var n,a,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=t.facets.map((function(t){return t.key})),a=d.getURLQueryParamsAsString(),e.next=4,d.getFacetValues(t.$parent.settings.collection,n.join(","),a);case 4:r=e.sent,t.facet_data=r.data[0];case 6:case"end":return e.stop()}}),e)})))()},parseFacets:function(){if(this.facets=[],this.$parent.settings.filters){var t,e=Object(i["a"])(this.$parent.settings.filters);try{for(e.s();!(t=e.n()).done;){var n=t.value;n.values=[],"facet"==n.mode&&this.facets.push(n),"filter"==n.mode&&this.filters.push(n)}}catch(a){e.e(a)}finally{e.f()}}},reset:function(){for(var t in this.facet_selections)this.facet_selections[t.key]=[];this.$router.push({query:this.facet_selections}),this.loadFacetData()},updateData:function(t,e){var n=this;return Object(o["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:n.setFacetSelection(t,e),n.$router.push({query:n.facet_selections}),n.loadFacetData();case 3:case"end":return a.stop()}}),a)})))()}}},h=p,v=(n("12d3"),n("2877")),b=Object(v["a"])(h,s,c,!1,null,null,null),g=b.exports,m=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"data"},[n("b-table",{attrs:{striped:"",hover:"",items:t.data,fields:t.fields}})],1)},y=[],_={name:"DBDataTable",data:function(){return{data:[],fields:[]}},watch:{"$parent.settings":function(){var t=Object(o["a"])(regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return this.fields=this.$parent.settings.item_table.rows,t.next=3,d.getData(this.$parent.settings.collection,"");case 3:e=t.sent,this.data=e.data.data;case 5:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),$route:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return console.log("table route happened"),e.next=3,d.getData(t.$parent.settings.collection,d.getURLQueryParamsAsString());case 3:n=e.sent,t.data=n.data.data;case 5:case"end":return e.stop()}}),e)})))()}}},w=_,k=Object(v["a"])(w,m,y,!1,null,null,null),j=k.exports,O=(n("f9e3"),n("2dd8"),{name:"App",components:{DBFacet:g,DBDataTable:j},data:function(){return{settings:null,error:null}},methods:{resetView:function(){this.$refs.facets.reset()}},created:function(){var t=this;this.$loadScript("js/config.js").then((function(){console.log("config loaded"),t.settings=window.config,t.error=null})).catch((function(){console.log("config.js not found"),t.error="config.js not found"}))}});console.log();var x=O,D=Object(v["a"])(x,a,r,!1,null,null,null);e["a"]=D.exports},"56d7":function(t,e,n){"use strict";n.r(e),function(t){n("e260"),n("e6cf"),n("cca6"),n("a79d");var e=n("2b0e"),a=n("3dfd"),r=n("8c4f"),s=n("5f5b"),c=n("b1e0"),i=n("67b0");e["default"].use(s["a"]),e["default"].use(c["a"]),e["default"].use(i["a"]),e["default"].use(r["a"]),e["default"].config.productionTip=!1;var o=new r["a"]({base:t,routes:[]});new e["default"]({router:o,render:function(t){return t(a["a"])}}).$mount("#app")}.call(this,"/")},dc42:function(t,e,n){}});
//# sourceMappingURL=app.90c5cf3c.js.map