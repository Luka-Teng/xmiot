'use strict';



function __$strToBlobUri(str, mime, isBinary) {try {return window.URL.createObjectURL(new Blob([Uint8Array.from(str.split('').map(function(c) {return c.charCodeAt(0)}))], {type: mime}));} catch (e) {return "data:" + mime + (isBinary ? ";base64," : ",") + str;}}

var index = 111;

module.exports = index;
