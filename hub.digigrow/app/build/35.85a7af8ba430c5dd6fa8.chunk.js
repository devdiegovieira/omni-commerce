(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{"99ecc34ce9e3a15e5855":function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return p}));var r=n("0d939196e59ed73c94e6"),a=n("8af190b70a6bc55c6f1b"),l=n.n(a),i=n("1a4ed1ba7965942fe077"),c=(n("e1d597c8abc5a3008a44"),n("efe034529830d873b8bb")),o=(n("13712e4bca250f2d3ab8"),n("5ff6c0339b5dfabc6e55"));function u(e){return function(e){if(Array.isArray(e))return f(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||m(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==n)return;var r,a,l=[],i=!0,c=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(l.push(r.value),!t||l.length!==t);i=!0);}catch(e){c=!0,a=e}finally{try{i||null==n.return||n.return()}finally{if(c)throw a}}return l}(e,t)||m(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e,t){if(e){if("string"===typeof e)return f(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(e,t):void 0}}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function b(){return(b=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function d(e){return l.a.createElement(r.Box,{display:"flex",alignItems:"center"},l.a.createElement(r.Box,{width:"100%",mr:1},l.a.createElement(r.LinearProgress,b({variant:"determinate"},e))),l.a.createElement(r.Box,{minWidth:35},l.a.createElement(r.Typography,{variant:"body2",color:"textSecondary"},"".concat(Math.round(e.value),"%"))))}function p(){var e=s(Object(a.useState)(),2),t=e[0],n=e[1],m=s(Object(a.useState)([]),2),f=m[0],b=m[1],p=s(Object(a.useState)(!1),2),y=p[0],g=p[1],h=s(Object(a.useState)([]),2),E=h[0],v=h[1],j=s(Object(a.useState)(0),2),w=j[0],A=j[1],O=s(Object(a.useState)(0),2),S=O[0],x=O[1];Object(a.useEffect)((function(){if(t){b([]),g(!1),v([]),A(0),x(0);try{var e=new FileReader;e.onload=function(e){var t=Object(o.c)(e.target.result,[0])[0];t.shift(),A(t.length),b(t),g(!1)},e.readAsArrayBuffer(t)}catch(e){console.log(e),g(!1)}}}),[t]);var G=function(){f.shift();var e=100-100/(w/f.length);x(e),b(u(f))};return Object(a.useEffect)((function(){f&&f.length&&Object(i.b)("post","/publish/compatibilities",(function(e){Array.isArray(e.rets)&&e.rets.length&&(E.push(e),v(u(E))),G()}),(function(e){console.log(e),G()}),f[0])}),[f]),l.a.createElement(r.Grid,{container:!0,spacing:2},l.a.createElement(r.Grid,{item:!0,xs:12},l.a.createElement(r.Grid,{container:!0,spacing:2},l.a.createElement(r.Grid,{item:!0,xs:12},l.a.createElement("b",null,"Compatibilidades")),l.a.createElement(r.Grid,{item:!0},l.a.createElement(c.a,{accept:[".xlsx"],singleFile:!0,onNewFile:function(e,t){g(!0),n(t)},files:t,label:"Selecionar Planilha"})),y&&l.a.createElement("b",null,l.a.createElement(r.CircularProgress,{size:13,style:{marginRight:5,marginTop:2}}),"Aguarde..."),l.a.createElement(r.Grid,{item:!0},l.a.createElement("p",null,"Arquivo: ",l.a.createElement("b",null,t&&t.name)),l.a.createElement("p",null,"Registros Pendentes: ",l.a.createElement("b",null,f.length&&f.length-1)),w&&f.length>=0&&l.a.createElement(l.a.Fragment,null,100!=S&&l.a.createElement("p",null,l.a.createElement(r.CircularProgress,{size:13,style:{marginRight:5,marginTop:2}}),"Aguarde processando..."),l.a.createElement(d,{value:S,style:{width:400}}))))),l.a.createElement(r.Grid,{item:!0,xs:12},l.a.createElement(r.List,null,E.map((function(e){return l.a.createElement(r.ListItem,null,l.a.createElement(r.Grid,{container:!0},l.a.createElement(r.Grid,{item:!0,xs:3},l.a.createElement("p",null,"An\xfancio: ",l.a.createElement("b",null,e.publishId))),l.a.createElement(r.Grid,{item:!0,xs:9},"Mensagems:",e.rets.map((function(e){return l.a.createElement("p",null,l.a.createElement("b",null,JSON.stringify(e)))})))))})))))}}}]);