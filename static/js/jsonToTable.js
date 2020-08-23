/**
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2020  Thomas C. Dougiamas
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */
!function(t){t.fn.createTable=function(e,a){var r,o=this,n=t.extend({},t.fn.createTable.defaults,a);if(void 0!==o[0].className){var i=o[0].className.split(" ");r="."+i.join(".")+" "}else void 0!==o[0].id&&(r="#"+o[0].id+" ");var l='<table class="json-to-table">';return l+='<thead><th class="jsl"></th>',l+=t.fn.createTable.parseTableData(e,!0),l+="</thead>",l+="<tbody>",l+=t.fn.createTable.parseTableData(e,!1),l+="</tbody>",l+="</table>",o.html(l),function(){t(r+".json-to-table").css({borderCollapse:"collapse",width:"100%",border:n.borderWidth+" "+n.borderStyle+" "+n.borderColor,fontFamily:n.fontFamily}),t(r+".jsl").css({minWidth:"18px",width:"18px",padding:"0 10px 0 10px"}),t(r+".json-to-table thead th:not(:first-child), .json-to-table tbody td:not(:first-child)").css({width:100/t.fn.createTable.getHighestColumnCount(e).max+"%"}),t(r+".json-to-table thead th, .json-to-table tbody td").css({border:n.borderWidth+" "+n.borderStyle+" "+n.borderColor}),t(r+".json-to-table thead th").css({backgroundColor:n.thBg,color:n.thColor,height:n.thHeight,fontFamily:n.thFontFamily,fontSize:n.thFontSize,textTransform:n.thTextTransform}),t(r+".json-to-table tbody td").css({backgroundColor:n.trBg,color:n.trColor,paddingLeft:n.trPaddingLeft,paddingRight:n.trPaddingRight,height:n.trHeight,fontSize:n.trFontSize,fontFamily:n.trFontFamily})}()},t.fn.createTable.getHighestColumnCount=function(e){for(var a=0,r=0,o={max:0,when:0},n=0;n<e.length;n++)a=t.fn.getObjectLength(e[n]),a>=r&&(r=a,o.max=a,o.when=n);return o},t.fn.createTable.parseTableData=function(e,a){for(var r="",o=0;o<e.length;o++)a===!1&&(r+='<tr><td class="jsl">'+(o+1)+"</td>"),t.each(e[o],function(n,i){a===!0?o===t.fn.createTable.getHighestColumnCount(e).when&&(r+="<th>"+t.fn.humanize(n)+"</th>"):a===!1&&(r+="<td>"+i+"</td>")}),a===!1&&(r+="</tr>");return r},t.fn.getObjectLength=function(t){var e=0;for(var a in t)t.hasOwnProperty(a)&&++e;return e},t.fn.humanize=function(t){var e=t.split("_");for(i=0;i<e.length;i++)e[i]=e[i].charAt(0).toUpperCase()+e[i].slice(1);return e.join(" ")},t.fn.createTable.defaults={borderWidth:"1px",borderStyle:"solid",borderColor:"#DDDDDD",fontFamily:"Verdana, Helvetica, Arial, FreeSans, sans-serif",thBg:"#F3F3F3",thColor:"#0E0E0E",thHeight:"30px",thFontFamily:"Verdana, Helvetica, Arial, FreeSans, sans-serif",thFontSize:"14px",thTextTransform:"capitalize",trBg:"#FFFFFF",trColor:"#0E0E0E",trHeight:"25px",trFontFamily:"Verdana, Helvetica, Arial, FreeSans, sans-serif",trFontSize:"13px",trPaddingLeft:"10px",trPaddingRight:"10px"}}(jQuery);
