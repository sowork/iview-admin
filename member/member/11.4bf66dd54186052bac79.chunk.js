webpackJsonp([11],{275:function(t,e,n){"use strict";function r(t){u||n(827)}Object.defineProperty(e,"__esModule",{value:!0});var o=n(766),a=n.n(o);for(var i in o)"default"!==i&&function(t){n.d(e,t,function(){return o[t]})}(i);var l=n(829),s=n.n(l),u=!1,c=n(4),h=r,p=c(a.a,s.a,!1,h,null,null);p.options.__file="src\\views\\customer\\admin\\user\\org.user.index.vue",e.default=p.exports},335:function(t,e,n){t.exports=n(336)},336:function(t,e,n){var r=function(){return this}()||Function("return this")(),o=r.regeneratorRuntime&&Object.getOwnPropertyNames(r).indexOf("regeneratorRuntime")>=0,a=o&&r.regeneratorRuntime;if(r.regeneratorRuntime=void 0,t.exports=n(337),o)r.regeneratorRuntime=a;else try{delete r.regeneratorRuntime}catch(t){r.regeneratorRuntime=void 0}},337:function(t,e){!function(e){"use strict";function n(t,e,n,r){var a=e&&e.prototype instanceof o?e:o,i=Object.create(a.prototype),l=new d(r||[]);return i._invoke=u(t,n,l),i}function r(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}function o(){}function a(){}function i(){}function l(t){["next","throw","return"].forEach(function(e){t[e]=function(t){return this._invoke(e,t)}})}function s(t){function e(n,o,a,i){var l=r(t[n],t,o);if("throw"!==l.type){var s=l.arg,u=s.value;return u&&"object"==typeof u&&y.call(u,"__await")?Promise.resolve(u.__await).then(function(t){e("next",t,a,i)},function(t){e("throw",t,a,i)}):Promise.resolve(u).then(function(t){s.value=t,a(s)},i)}i(l.arg)}function n(t,n){function r(){return new Promise(function(r,o){e(t,n,r,o)})}return o=o?o.then(r,r):r()}var o;this._invoke=n}function u(t,e,n){var o=C;return function(a,i){if(o===P)throw new Error("Generator is already running");if(o===L){if("throw"===a)throw i;return m()}for(n.method=a,n.arg=i;;){var l=n.delegate;if(l){var s=c(l,n);if(s){if(s===O)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===C)throw o=L,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=P;var u=r(t,e,n);if("normal"===u.type){if(o=n.done?L:D,u.arg===O)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=L,n.method="throw",n.arg=u.arg)}}}function c(t,e){var n=t.iterator[e.method];if(n===g){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=g,c(t,e),"throw"===e.method))return O;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return O}var o=r(n,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,O;var a=o.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=g),e.delegate=null,O):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,O)}function h(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function p(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function d(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(h,this),this.reset(!0)}function f(t){if(t){var e=t[b];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,r=function e(){for(;++n<t.length;)if(y.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=g,e.done=!0,e};return r.next=r}}return{next:m}}function m(){return{value:g,done:!0}}var g,v=Object.prototype,y=v.hasOwnProperty,_="function"==typeof Symbol?Symbol:{},b=_.iterator||"@@iterator",w=_.asyncIterator||"@@asyncIterator",x=_.toStringTag||"@@toStringTag",I="object"==typeof t,k=e.regeneratorRuntime;if(k)return void(I&&(t.exports=k));k=e.regeneratorRuntime=I?t.exports:{},k.wrap=n;var C="suspendedStart",D="suspendedYield",P="executing",L="completed",O={},S={};S[b]=function(){return this};var E=Object.getPrototypeOf,T=E&&E(E(f([])));T&&T!==v&&y.call(T,b)&&(S=T);var F=i.prototype=o.prototype=Object.create(S);a.prototype=F.constructor=i,i.constructor=a,i[x]=a.displayName="GeneratorFunction",k.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===a||"GeneratorFunction"===(e.displayName||e.name))},k.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,i):(t.__proto__=i,x in t||(t[x]="GeneratorFunction")),t.prototype=Object.create(F),t},k.awrap=function(t){return{__await:t}},l(s.prototype),s.prototype[w]=function(){return this},k.AsyncIterator=s,k.async=function(t,e,r,o){var a=new s(n(t,e,r,o));return k.isGeneratorFunction(e)?a:a.next().then(function(t){return t.done?t.value:a.next()})},l(F),F[x]="Generator",F[b]=function(){return this},F.toString=function(){return"[object Generator]"},k.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},k.values=f,d.prototype={constructor:d,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=g,this.done=!1,this.delegate=null,this.method="next",this.arg=g,this.tryEntries.forEach(p),!t)for(var e in this)"t"===e.charAt(0)&&y.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=g)},stop:function(){this.done=!0;var t=this.tryEntries[0],e=t.completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){function e(e,r){return a.type="throw",a.arg=t,n.next=e,r&&(n.method="next",n.arg=g),!!r}if(this.done)throw t;for(var n=this,r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r],a=o.completion;if("root"===o.tryLoc)return e("end");if(o.tryLoc<=this.prev){var i=y.call(o,"catchLoc"),l=y.call(o,"finallyLoc");if(i&&l){if(this.prev<o.catchLoc)return e(o.catchLoc,!0);if(this.prev<o.finallyLoc)return e(o.finallyLoc)}else if(i){if(this.prev<o.catchLoc)return e(o.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return e(o.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&y.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var o=r;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,O):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),O},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),p(n),O}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;p(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:f(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=g),O}}}(function(){return this}()||Function("return this")())},343:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(30),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default={name:"PopTipTransfer",props:{visible:{type:Boolean,default:!1},width:{type:Number,default:660},showBtn1:{type:Boolean,default:!0},showBtn2:{type:Boolean,default:!0},showCascader:{type:Boolean,default:!0},groupData:Array,targetItems:Array,listStyle:Object,operations:Array,placement:{type:String,default:function(){return"bottom"}},itemDefaultValue:{type:Array,default:function(){return[]}},items:{type:Array,default:function(){return[]}},renderItem:{type:Function,default:function(t){return t.label||t.key}}},data:function(){return{itemValueCopy:JSON.parse((0,o.default)(this.itemDefaultValue)),visibleCopy:{value:this.visible}}},methods:{handleChange:function(t,e,n){this.$emit("handleChange",t,this.itemValueCopy,e,n)},onPopperShow:function(){this.$emit("onPopperShow",this.itemValueCopy),this.$emit("PopperToggle",this.visibleCopy)},onPopperHide:function(){this.$emit("PopperToggle",this.visibleCopy)},showAllData:function(){this.$emit("showAllData",this.itemValueCopy)},selectItemChange:function(t,e){this.$emit("selectItemChange",t,e)},showFilterData:function(){this.$emit("showFilterData",this.itemValueCopy)}}}},371:function(t,e,n){"use strict";function r(t){u||n(372)}Object.defineProperty(e,"__esModule",{value:!0});var o=n(343),a=n.n(o);for(var i in o)"default"!==i&&function(t){n.d(e,t,function(){return o[t]})}(i);var l=n(374),s=n.n(l),u=!1,c=n(4),h=r,p=c(a.a,s.a,!1,h,null,null);p.options.__file="src\\views\\customer\\common\\auth\\component\\PopTipTransfer.vue",e.default=p.exports},372:function(t,e,n){var r=n(373);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);n(21)("0f938d50",r,!1)},373:function(t,e,n){e=t.exports=n(20)(!1),e.push([t.i,"\n.hide {\n    display: none !important;\n}\n",""])},374:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("Poptip",{attrs:{placement:t.placement,width:t.width,transfer:""},on:{"on-popper-show":t.onPopperShow,"on-popper-hide":t.onPopperHide},model:{value:t.visibleCopy.value,callback:function(e){t.$set(t.visibleCopy,"value",e)},expression:"visibleCopy.value"}},[n("div",{attrs:{slot:"content"},slot:"content"},[n("Row",{attrs:{gutter:10}},[n("Col",{attrs:{span:"24"}},[n("Card",[t._t("head",[n("div",{staticStyle:{"padding-bottom":"15px"}},[n("Button",{class:{hide:!t.showBtn1},attrs:{type:"ghost"},on:{click:t.showFilterData}},[t._v("LoadFilter")]),t._v(" "),n("Button",{class:{hide:!t.showBtn2},attrs:{type:"ghost"},on:{click:t.showAllData}},[t._v("LoadAll")]),t._v(" "),n("Cascader",{class:{hide:!t.showCascader},staticStyle:{width:"250px",display:"inline-block"},attrs:{data:t.items},on:{"on-change":t.selectItemChange},model:{value:t.itemValueCopy,callback:function(e){t.itemValueCopy=e},expression:"itemValueCopy"}})],1)]),t._v(" "),n("Transfer",{attrs:{data:t.groupData,"target-keys":t.targetItems,"list-style":t.listStyle,"render-format":t.renderItem,operations:t.operations,filterable:""},on:{"on-change":t.handleChange}})],2)],1)],1)],1),t._v(" "),t._t("default")],2)},o=[];r._withStripped=!0;var a={render:r,staticRenderFns:o};e.default=a},766:function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(42),a=r(o),i=n(335),l=r(i),s=n(113),u=r(s),c=n(68),h=r(c),p=n(30),d=r(p),f=n(371),m=r(f);r(n(5)).default.component("PopTipTransfer",m.default),e.default={name:"paper_index",components:{},data:function(){var t=this,e=function(t,e,n){""===e&&n();var r=/^1[0-9]{10}$/;null===e||r.test(e)?n():n(new Error("请输入正确格式的手机号"))};return{org_name:"",options1:[],loading1:!1,editInlineColumns:[{title:"序号",align:"center",key:"id"},{title:"账号",align:"center",key:"account"},{title:"用户姓名",align:"center",key:"real_name"},{title:"所属机构",align:"center",render:function(t,e){return e.row.org.org_name}},{title:"用户电话",align:"center",key:"tel"},{title:"用户邮箱",align:"center",key:"email"},{title:"操作",key:"action",align:"center",fixed:"right",width:200,render:function(e,n){return e("div",[e("PopTipTransfer",{props:{showBtn1:!1,showBtn2:!1,groupData:t.groupData,targetItems:t.targetItems,listStyle:t.listStyle,operations:t.operations,renderItem:t.renderItem,items:t.itemTypes,itemDefaultValue:t.defaultItemValue,placement:"left"},on:{onPopperShow:function(e){t.loadGroupItems(e[0],e[1],n.row,0)},handleChange:function(e){t.handleChange(e,n.row)},showAllData:function(e){t.loadGroupItems(e[0],e[1],n.row,0)},showFilterData:function(e){t.loadGroupItems(e[0],e[1],n.row)},selectItemChange:function(e,r){t.loadGroupItems(e[0],e[1],n.row,0)}}},[e("Button",{props:{type:"text",size:"small"}},"授权")]),e("Button",{props:{type:"text",size:"small"},on:{click:function(){t.org_name=n.row.org.org_name,t.dblClick(JSON.parse((0,d.default)(t.editInlineData[n.index])),n.index)}}},"编辑"),e("Poptip",{props:{confirm:!0,title:"您确定要删除这条数据吗?",transfer:!0},on:{"on-ok":function(){t.formItem=n.row,t.destroy(n.index)}}},[e("Button",{props:{type:"text",size:"small"}},"删除")])])}}],editInlineData:[],total:0,page:1,number:10,modal1:!1,loading:!1,httpRequest:"",formItem:{account:"",real_name:"",password:"",nickname:"",email:null,tel:null,org_id:""},ruleValidate:{org_id:[{required:!0,type:"number",message:"机构是必填项",trigger:"blur"}],real_name:[{required:!0,message:"姓名是必填项",trigger:"blur"}],account:[{required:!0,type:"string",message:"账户名称不能为空",trigger:"blur"}],password:[{min:6,message:"请至少输入6个字符",trigger:"blur"},{max:32,message:"最多输入32个字符",trigger:"blur"}],tel:[{validator:e}],email:[{type:"email",message:"邮箱格式错误",trigger:"blur"}]},roles:[],checkAllGroup:[],itemTypes:[{value:3,label:"角色",level:3,children:[{value:"admin_roles",label:"智慧云端角色"},{value:"school_roles",label:"学校端角色"},{value:"org_roles",label:"机构端角色"}]},{value:2,label:"菜单",level:2,children:[{value:"admin_menus",label:"智慧云端菜单"},{value:"admin_top_menus",label:"智慧云端顶部菜单"},{value:"school_menus",label:"学校端菜单"}]},{value:1,label:"权限",level:1,children:[{value:"admin_permissions",label:"智慧云端权限"},{value:"school_permissions",label:"学校端权限"},{value:"org_permissions",label:"机构端权限"}]}],dataItems:[],initDataItems:[],groupData:[],targetItems:[],defaultItemValue:[],listStyle:{width:"250px",height:"300px"},operations:["To left","To right"]}},methods:{initData:function(){var t=this;this.defaultItemValue=[this.itemTypes[0].value,this.itemTypes[0].children[0].value],h.default.all([this.axios.get("{{base_host_v1}}/org/users",{params:{page:this.page,number:this.number}})]).then(function(e){var n=(0,u.default)(e,1),r=n[0];t.editInlineData=r.data.data.data,t.total=r.data.data.total})},actionModal:l.default.mark(function t(e,n){var r=this,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return l.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return"store"===n&&this.reset(e),t.next=3,this.modal1=!0;case 3:return t.next=6,this.$refs[e].validate(function(t){t&&r[n](o)});case 6:t.next=3;break;case 8:case"end":return t.stop()}},t,this)}),store:function(){var t=this;this.formItem._method="post",this.axios.post("{{base_host_v1}}/org/users",this.formItem).then(function(e){t.editInlineData.push(e.data.data)}).then(function(e){t.modal1=!1})},update:function(t){var e=this;this.formItem._method="put",h.default.all([this.axios.post("{{base_host_v1}}/org/users/"+this.formItem.id,this.formItem)]).then(function(n){var r=(0,u.default)(n,1),o=r[0];e.modal1=!1,e.editInlineData.splice(t,1,o.data.data)})},destroy:function(t){var e=this;this.formItem._method="delete",this.axios.post("{{base_host_v1}}/org/users/"+this.formItem.id,this.formItem).then(function(n){e.editInlineData.splice(t,1)})},dblClick:function(t,e){this.formItem=t,this.httpRequest=this.actionModal("formItem","update",e),this.httpRequest.next()},reset:function(t){this.options1=[],this.$refs[t].resetFields()},onChange:function(t,e){this.page=t,this.initData()},onPageSizeChange:function(t){this.number=t,this.initData()},parseDate:function(t){this.formItem.user_birthday=t},loadGroupItems:function(t,e,n){var r=this,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;this.groupData=[],this.targetItems=[],h.default.all([this.axios.get("{{auth_host_v1}}/auth/item/group/original",{params:{filter:o,returnScope:e,returnType:t}}),this.axios.get("{{auth_host_v1}}/auth/item/assignment/target",{params:{id:n.id,provider:"org_users"}})]).then(function(t){var e=(0,u.default)(t,2),n=e[0],o=e[1];if(n.data.data.length>0){var i=!0,l=!1,s=void 0;try{for(var c,h=(0,a.default)(n.data.data);!(i=(c=h.next()).done);i=!0){var p=c.value;p.key=p.id,p.label=p.item_name}}catch(t){l=!0,s=t}finally{try{!i&&h.return&&h.return()}finally{if(l)throw s}}}r.groupData=n.data.data,r.targetItems=o.data.data})},renderItem:function(t){return t.item_name+" - "+t.item_desc},handleChange:function(t,e){var n=this;this.axios.post("{{auth_host_v1}}/auth/item/assignment/"+e.id,{ids:t,provider:"org_users"}).then(function(e){"0"===e.data.code&&(n.targetItems=t)})},searchOrg:function(t){var e=this;""!==t&&(this.loading1=!0,this.axios.get("{{base_host_v1}}/org/search",{params:{name:t}}).then(function(t){e.loading1=!1,e.options1=t.data.data}))}},watch:{"formItem.email":function(t,e){""===t&&(this.formItem.email=null)},"formItem.tel":function(t,e){""===t&&(this.formItem.tel=null)}},created:function(){this.initData()}}},827:function(t,e,n){var r=n(828);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);n(21)("5e1b1ba2",r,!1)},828:function(t,e,n){e=t.exports=n(20)(!1),e.push([t.i,"\n.margin-top-8 {\n  margin-top: 8px;\n}\n.margin-top-10 {\n  margin-top: 10px;\n}\n.margin-top-20 {\n  margin-top: 20px;\n}\n.margin-left-10 {\n  margin-left: 10px;\n}\n.margin-bottom-10 {\n  margin-bottom: 10px;\n}\n.margin-bottom-100 {\n  margin-bottom: 100px;\n}\n.margin-right-10 {\n  margin-right: 10px;\n}\n.padding-left-6 {\n  padding-left: 6px;\n}\n.padding-left-8 {\n  padding-left: 5px;\n}\n.padding-left-10 {\n  padding-left: 10px;\n}\n.padding-left-20 {\n  padding-left: 20px;\n}\n.height-100 {\n  height: 100%;\n}\n.height-120px {\n  height: 100px;\n}\n.height-200px {\n  height: 200px;\n}\n.height-492px {\n  height: 492px;\n}\n.height-460px {\n  height: 460px;\n}\n.line-gray {\n  height: 0;\n  border-bottom: 2px solid #dcdcdc;\n}\n.notwrap {\n  word-break: keep-all;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.padding-left-5 {\n  padding-left: 10px;\n}\n[v-cloak] {\n  display: none;\n}\n",""])},829:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Card",[n("p",{attrs:{slot:"title"},slot:"title"},[n("Icon",{attrs:{type:"android-remove"}}),t._v("\n            机构用户\n        ")],1),t._v(" "),n("div",{staticClass:"edittable-table-height-con"},[n("div",{staticClass:"margin-bottom-10"},[n("Button",{attrs:{type:"ghost"},on:{click:function(e){(t.httpRequest=t.actionModal("formItem","store"))&&t.httpRequest.next()}}},[t._v("添    加")])],1),t._v(" "),n("Table",{attrs:{columns:t.editInlineColumns,data:t.editInlineData,border:""},on:{"on-row-dblclick":t.dblClick}})],1),t._v(" "),n("div",{staticClass:"margin-top-20"},[n("Page",{attrs:{total:t.total,"show-total":"",size:"small","show-elevator":"","show-sizer":""},on:{"on-change":t.onChange,"on-page-size-change":t.onPageSizeChange}})],1)]),t._v(" "),n("Modal",{attrs:{loading:t.loading,title:"机构用户"},nativeOn:{keydown:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13,e.key))return null;t.httpRequest.next()}},model:{value:t.modal1,callback:function(e){t.modal1=e},expression:"modal1"}},[n("Form",{ref:"formItem",attrs:{model:t.formItem,rules:t.ruleValidate,"label-width":80}},[n("FormItem",{attrs:{label:"所属机构",prop:"org_id"}},[n("Select",{attrs:{filterable:"",remote:"",label:t.org_name,"remote-method":t.searchOrg,loading:t.loading1},model:{value:t.formItem.org_id,callback:function(e){t.$set(t.formItem,"org_id",e)},expression:"formItem.org_id"}},t._l(t.options1,function(e,r){return n("Option",{key:r,attrs:{value:e.id}},[t._v(t._s(e.org_name))])}))],1),t._v(" "),n("FormItem",{attrs:{label:"账户名称",prop:"account"}},[n("Input",{attrs:{placeholder:""},model:{value:t.formItem.account,callback:function(e){t.$set(t.formItem,"account",e)},expression:"formItem.account"}})],1),t._v(" "),n("FormItem",{attrs:{label:"账户密码",prop:"password"}},[n("Input",{attrs:{type:"password",placeholder:"不填默认为123456"},model:{value:t.formItem.password,callback:function(e){t.$set(t.formItem,"password",e)},expression:"formItem.password"}})],1),t._v(" "),n("FormItem",{attrs:{label:"用户姓名",prop:"real_name"}},[n("Input",{attrs:{placeholder:""},model:{value:t.formItem.real_name,callback:function(e){t.$set(t.formItem,"real_name",e)},expression:"formItem.real_name"}})],1),t._v(" "),n("FormItem",{attrs:{label:"用户电话",prop:"tel"}},[n("Input",{attrs:{placeholder:""},model:{value:t.formItem.tel,callback:function(e){t.$set(t.formItem,"tel",e)},expression:"formItem.tel"}})],1),t._v(" "),n("FormItem",{attrs:{label:"用户邮箱",prop:"email"}},[n("Input",{attrs:{placeholder:""},model:{value:t.formItem.email,callback:function(e){t.$set(t.formItem,"email",e)},expression:"formItem.email"}})],1)],1),t._v(" "),n("div",{attrs:{slot:"footer"},slot:"footer"},[n("Button",{attrs:{type:"ghost"},on:{click:function(e){t.reset("formItem")}}},[t._v("重置")]),t._v(" "),n("Button",{attrs:{type:"primary"},on:{click:function(e){t.httpRequest.next()}}},[t._v("确认")])],1)],1)],1)},o=[];r._withStripped=!0;var a={render:r,staticRenderFns:o};e.default=a}});