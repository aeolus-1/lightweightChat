!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r((e="undefined"!=typeof globalThis?globalThis:e||self).ThumbmarkJS={})}(this,(function(e){"use strict";function r(e,r,n,t){return new(n||(n=Promise))((function(o,a){function i(e){try{c(t.next(e))}catch(e){a(e)}}function u(e){try{c(t.throw(e))}catch(e){a(e)}}function c(e){var r;e.done?o(e.value):(r=e.value,r instanceof n?r:new n((function(e){e(r)}))).then(i,u)}c((t=t.apply(e,r||[])).next())}))}function n(e,r){var n,t,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function u(u){return function(c){return function(u){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,u[0]&&(i=0)),i;)try{if(n=1,t&&(o=2&u[0]?t.return:u[0]?t.throw||((o=t.return)&&o.call(t),0):t.next)&&!(o=o.call(t,u[1])).done)return o;switch(t=0,o&&(u=[2&u[0],o.value]),u[0]){case 0:case 1:o=u;break;case 4:return i.label++,{value:u[1],done:!1};case 5:i.label++,t=u[1],u=[0];continue;case 7:u=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==u[0]&&2!==u[0])){i=0;continue}if(3===u[0]&&(!o||u[1]>o[0]&&u[1]<o[3])){i.label=u[1];break}if(6===u[0]&&i.label<o[1]){i.label=o[1],o=u;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(u);break}o[2]&&i.ops.pop(),i.trys.pop();continue}u=r.call(e,i)}catch(e){u=[6,e],t=0}finally{n=o=0}if(5&u[0])throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}([u,c])}}}"function"==typeof SuppressedError&&SuppressedError;var t={exclude:[]};var o={},a={timeout:"true"},i=function(e,r){"undefined"!=typeof window&&(o[e]=r)},u=function(){return Object.fromEntries(Object.entries(o).filter((function(e){var r,n=e[0];return!(null===(r=null==t?void 0:t.exclude)||void 0===r?void 0:r.includes(n))})).map((function(e){return[e[0],(0,e[1])()]})))},c=3432918353,s=461845907,l=3864292196,d=2246822507,f=3266489909;function h(e,r){return e<<r|e>>>32-r}function m(e,r){void 0===r&&(r=0);for(var n=r,t=0,o=3&e.length,a=e.length-o,i=0;i<a;)t=255&e.charCodeAt(i)|(255&e.charCodeAt(++i))<<8|(255&e.charCodeAt(++i))<<16|(255&e.charCodeAt(++i))<<24,++i,t=h(t=Math.imul(t,c),15),n=h(n^=t=Math.imul(t,s),13),n=Math.imul(n,5)+l;switch(t=0,o){case 3:t^=(255&e.charCodeAt(i+2))<<16;case 2:t^=(255&e.charCodeAt(i+1))<<8;case 1:t^=255&e.charCodeAt(i),t=h(t=Math.imul(t,c),15),n^=t=Math.imul(t,s)}return((n=function(e){return e^=e>>>16,e=Math.imul(e,d),e^=e>>>13,e=Math.imul(e,f),e^e>>>16}(n^=e.length))>>>0).toString(36)}function v(e,r){return new Promise((function(n){setTimeout((function(){return n(r)}),e)}))}function p(e,r,n){return Promise.all(e.map((function(e){var t=performance.now();return Promise.race([e.then((function(e){return{value:e,elapsed:performance.now()-t}})),v(r,n).then((function(e){return{value:e,elapsed:performance.now()-t}}))])})))}function g(e,r,n){return Promise.all(e.map((function(e){return Promise.race([e,v(r,n)])})))}function w(){return r(this,void 0,void 0,(function(){var e,r,o,i,c;return n(this,(function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),e=u(),r=Object.keys(e),[4,g(Object.values(e),(null==t?void 0:t.timeout)||1e3,a)];case 1:return o=n.sent(),i=o.filter((function(e){return void 0!==e})),c={},i.forEach((function(e,n){c[r[n]]=e})),[2,y(c,t.exclude||[])];case 2:throw n.sent();case 3:return[2]}}))}))}function y(e,r){var n={},t=function(t){if(e.hasOwnProperty(t)){var o=e[t];if("object"!=typeof o||Array.isArray(o))r.includes(t)||(n[t]=o);else{var a=y(o,r.map((function(e){return e.startsWith(t+".")?e.slice(t.length+1):e})));Object.keys(a).length>0&&(n[t]=a)}}};for(var o in e)t(o);return n}function S(e){for(var r=0,n=0;n<e.length;++n)r+=Math.abs(e[n]);return r}function b(e,r,n){for(var t=[],o=0;o<e[0].data.length;o++){for(var a=[],i=0;i<e.length;i++)a.push(e[i].data[o]);t.push(E(a))}var u=new Uint8ClampedArray(t);return new ImageData(u,r,n)}function E(e){if(0===e.length)return 0;for(var r={},n=0,t=e;n<t.length;n++){r[a=t[n]]=(r[a]||0)+1}var o=e[0];for(var a in r)r[a]>r[o]&&(o=parseInt(a,10));return o}function P(){if("undefined"==typeof navigator)return{name:"unknown",version:"unknown"};for(var e=navigator.userAgent,r={Edg:"Edge",OPR:"Opera"},n=0,t=[/(?<name>Edge|Edg)\/(?<version>\d+(?:\.\d+)?)/,/(?<name>(?:Chrome|Chromium|OPR|Opera|Vivaldi|Brave))\/(?<version>\d+(?:\.\d+)?)/,/(?<name>(?:Firefox|Waterfox|Iceweasel|IceCat))\/(?<version>\d+(?:\.\d+)?)/,/(?<name>Safari)\/(?<version>\d+(?:\.\d+)?)/,/(?<name>MSIE|Trident|IEMobile).+?(?<version>\d+(?:\.\d+)?)/,/(?<name>[A-Za-z]+)\/(?<version>\d+(?:\.\d+)?)/,/(?<name>SamsungBrowser)\/(?<version>\d+(?:\.\d+)?)/];n<t.length;n++){var o=t[n],a=e.match(o);if(a&&a.groups)return{name:r[a.groups.name]||a.groups.name,version:a.groups.version}}return{name:"unknown",version:"unknown"}}i("audio",(function(){return r(this,void 0,void 0,(function(){return n(this,(function(e){return[2,new Promise((function(e,r){try{var n=new(window.OfflineAudioContext||window.webkitOfflineAudioContext)(1,5e3,44100),t=n.createBufferSource(),o=n.createOscillator();o.frequency.value=1e3;var a,i=n.createDynamicsCompressor();i.threshold.value=-50,i.knee.value=40,i.ratio.value=12,i.attack.value=0,i.release.value=.2,o.connect(i),i.connect(n.destination),o.start(),n.oncomplete=function(r){a=r.renderedBuffer.getChannelData(0),e({sampleHash:S(a),oscillator:o.type,maxChannels:n.destination.maxChannelCount,channelCountMode:t.channelCountMode})},n.startRendering()}catch(e){console.error("Error creating audio fingerprint:",e),r(e)}}))]}))}))}));var M="SamsungBrowser"!==P().name?1:3,A=280,C=20;"Firefox"!=P().name&&i("canvas",(function(){return document.createElement("canvas").getContext("2d"),new Promise((function(e){var r=Array.from({length:M},(function(){return function(){var e=document.createElement("canvas"),r=e.getContext("2d");if(!r)return new ImageData(1,1);e.width=A,e.height=C;var n=r.createLinearGradient(0,0,e.width,e.height);n.addColorStop(0,"red"),n.addColorStop(1/6,"orange"),n.addColorStop(2/6,"yellow"),n.addColorStop(.5,"green"),n.addColorStop(4/6,"blue"),n.addColorStop(5/6,"indigo"),n.addColorStop(1,"violet"),r.fillStyle=n,r.fillRect(0,0,e.width,e.height);var t="Random Text WMwmil10Oo";r.font="23.123px Arial",r.fillStyle="black",r.fillText(t,-5,15),r.fillStyle="rgba(0, 0, 255, 0.5)",r.fillText(t,-3.3,17.7),r.beginPath(),r.moveTo(0,0),r.lineTo(2*e.width/7,e.height),r.strokeStyle="white",r.lineWidth=2,r.stroke();var o=r.getImageData(0,0,e.width,e.height);return o}()}));e({commonImageDataHash:m(b(r,A,C).data.toString()).toString()})}))}));var x,T=["Arial","Arial Black","Arial Narrow","Arial Rounded MT","Arimo","Archivo","Barlow","Bebas Neue","Bitter","Bookman","Calibri","Cabin","Candara","Century","Century Gothic","Comic Sans MS","Constantia","Courier","Courier New","Crimson Text","DM Mono","DM Sans","DM Serif Display","DM Serif Text","Dosis","Droid Sans","Exo","Fira Code","Fira Sans","Franklin Gothic Medium","Garamond","Geneva","Georgia","Gill Sans","Helvetica","Impact","Inconsolata","Indie Flower","Inter","Josefin Sans","Karla","Lato","Lexend","Lucida Bright","Lucida Console","Lucida Sans Unicode","Manrope","Merriweather","Merriweather Sans","Montserrat","Myriad","Noto Sans","Nunito","Nunito Sans","Open Sans","Optima","Orbitron","Oswald","Pacifico","Palatino","Perpetua","PT Sans","PT Serif","Poppins","Prompt","Public Sans","Quicksand","Rajdhani","Recursive","Roboto","Roboto Condensed","Rockwell","Rubik","Segoe Print","Segoe Script","Segoe UI","Sora","Source Sans Pro","Space Mono","Tahoma","Taviraj","Times","Times New Roman","Titillium Web","Trebuchet MS","Ubuntu","Varela Round","Verdana","Work Sans"],k=["monospace","sans-serif","serif"];function R(e,r){if(!e)throw new Error("Canvas context not supported");return e.font,e.font="72px ".concat(r),e.measureText("WwMmLli0Oo").width}function I(){var e,r=document.createElement("canvas"),n=null!==(e=r.getContext("webgl"))&&void 0!==e?e:r.getContext("experimental-webgl");if(n&&"getParameter"in n){var t=n.getExtension("WEBGL_debug_renderer_info");return{vendor:(n.getParameter(n.VENDOR)||"").toString(),vendorUnmasked:t?(n.getParameter(t.UNMASKED_VENDOR_WEBGL)||"").toString():"",renderer:(n.getParameter(n.RENDERER)||"").toString(),rendererUnmasked:t?(n.getParameter(t.UNMASKED_RENDERER_WEBGL)||"").toString():"",version:(n.getParameter(n.VERSION)||"").toString(),shadingLanguageVersion:(n.getParameter(n.SHADING_LANGUAGE_VERSION)||"").toString()}}return"undefined"}function O(){var e=new Float32Array(1),r=new Uint8Array(e.buffer);return e[0]=1/0,e[0]=e[0]-e[0],r[3]}function D(e,r){var n={};return r.forEach((function(r){var t=function(e){if(0===e.length)return null;var r={};e.forEach((function(e){var n=String(e);r[n]=(r[n]||0)+1}));var n=e[0],t=1;return Object.keys(r).forEach((function(e){r[e]>t&&(n=e,t=r[e])})),n}(e.map((function(e){return r in e?e[r]:void 0})).filter((function(e){return void 0!==e})));t&&(n[r]=t)})),n}function _(){var e=[],r={"prefers-contrast":["high","more","low","less","forced","no-preference"],"any-hover":["hover","none"],"any-pointer":["none","coarse","fine"],pointer:["none","coarse","fine"],hover:["hover","none"],update:["fast","slow"],"inverted-colors":["inverted","none"],"prefers-reduced-motion":["reduce","no-preference"],"prefers-reduced-transparency":["reduce","no-preference"],scripting:["none","initial-only","enabled"],"forced-colors":["active","none"]};return Object.keys(r).forEach((function(n){r[n].forEach((function(r){matchMedia("(".concat(n,": ").concat(r,")")).matches&&e.push("".concat(n,": ").concat(r))}))})),e}function B(){if("https:"===window.location.protocol&&"function"==typeof window.ApplePaySession)try{for(var e=window.ApplePaySession.supportsVersion,r=15;r>0;r--)if(e(r))return r}catch(e){return 0}return 0}"Firefox"!=P().name&&i("fonts",(function(){var e=this;return new Promise((function(t,o){try{!function(e){var t;r(this,void 0,void 0,(function(){var r,o,a;return n(this,(function(n){switch(n.label){case 0:return document.body?[3,2]:[4,(i=50,new Promise((function(e){return setTimeout(e,i,u)})))];case 1:return n.sent(),[3,0];case 2:if((r=document.createElement("iframe")).setAttribute("frameBorder","0"),(o=r.style).setProperty("position","fixed"),o.setProperty("display","block","important"),o.setProperty("visibility","visible"),o.setProperty("border","0"),o.setProperty("opacity","0"),r.src="about:blank",document.body.appendChild(r),!(a=r.contentDocument||(null===(t=r.contentWindow)||void 0===t?void 0:t.document)))throw new Error("Iframe document is not accessible");return e({iframe:a}),setTimeout((function(){document.body.removeChild(r)}),0),[2]}var i,u}))}))}((function(o){var a=o.iframe;return r(e,void 0,void 0,(function(){var e,r,o,i;return n(this,(function(n){return"Hello, world!",e=a.createElement("canvas"),r=e.getContext("2d"),o=k.map((function(e){return R(r,e)})),i={},T.forEach((function(e){var n=R(r,e);o.includes(n)||(i[e]=n)})),t(i),[2]}))}))}))}catch(e){o({error:"unsupported"})}}))})),i("hardware",(function(){return new Promise((function(e,r){var n=void 0!==navigator.deviceMemory?navigator.deviceMemory:0,t=window.performance&&window.performance.memory?window.performance.memory:0;e({videocard:I(),architecture:O(),deviceMemory:n.toString()||"undefined",jsHeapSizeLimit:t.jsHeapSizeLimit||0})}))})),i("locales",(function(){return new Promise((function(e){e({languages:navigator.language,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone})}))})),i("permissions",(function(){return r(this,void 0,void 0,(function(){var e;return n(this,(function(o){return x=(null==t?void 0:t.permissions_to_check)||["accelerometer","accessibility","accessibility-events","ambient-light-sensor","background-fetch","background-sync","bluetooth","camera","clipboard-read","clipboard-write","device-info","display-capture","gyroscope","geolocation","local-fonts","magnetometer","microphone","midi","nfc","notifications","payment-handler","persistent-storage","push","speaker","storage-access","top-level-storage-access","window-management","query"],e=Array.from({length:(null==t?void 0:t.retries)||3},(function(){return function(){return r(this,void 0,void 0,(function(){var e,r,t,o,a;return n(this,(function(n){switch(n.label){case 0:e={},r=0,t=x,n.label=1;case 1:if(!(r<t.length))return[3,6];o=t[r],n.label=2;case 2:return n.trys.push([2,4,,5]),[4,navigator.permissions.query({name:o})];case 3:return a=n.sent(),e[o]=a.state.toString(),[3,5];case 4:return n.sent(),[3,5];case 5:return r++,[3,1];case 6:return[2,e]}}))}))}()})),[2,Promise.all(e).then((function(e){return D(e,x)}))]}))}))})),i("plugins",(function(){var e=[];if(navigator.plugins)for(var r=0;r<navigator.plugins.length;r++){var n=navigator.plugins[r];e.push([n.name,n.filename,n.description].join("|"))}return new Promise((function(r){r({plugins:e})}))})),i("screen",(function(){return new Promise((function(e){e({is_touchscreen:navigator.maxTouchPoints>0,maxTouchPoints:navigator.maxTouchPoints,colorDepth:screen.colorDepth,mediaMatches:_()})}))})),i("system",(function(){return new Promise((function(e){var r=P();e({platform:window.navigator.platform,cookieEnabled:window.navigator.cookieEnabled,productSub:navigator.productSub,product:navigator.product,useragent:navigator.userAgent,browser:{name:r.name,version:r.version},applePayVersion:B()})}))}));var F,L="SamsungBrowser"!==P().name?1:3,N=null;"undefined"!=typeof document&&((F=document.createElement("canvas")).width=200,F.height=100,N=F.getContext("webgl")),i("webgl",(function(){return r(this,void 0,void 0,(function(){var e;return n(this,(function(r){try{if(!N)throw new Error("WebGL not supported");return e=Array.from({length:L},(function(){return function(){try{if(!N)throw new Error("WebGL not supported");var e="\n          attribute vec2 position;\n          void main() {\n              gl_Position = vec4(position, 0.0, 1.0);\n          }\n      ",r="\n          precision mediump float;\n          void main() {\n              gl_FragColor = vec4(0.812, 0.195, 0.553, 0.921); // Set line color\n          }\n      ",n=N.createShader(N.VERTEX_SHADER),t=N.createShader(N.FRAGMENT_SHADER);if(!n||!t)throw new Error("Failed to create shaders");if(N.shaderSource(n,e),N.shaderSource(t,r),N.compileShader(n),!N.getShaderParameter(n,N.COMPILE_STATUS))throw new Error("Vertex shader compilation failed: "+N.getShaderInfoLog(n));if(N.compileShader(t),!N.getShaderParameter(t,N.COMPILE_STATUS))throw new Error("Fragment shader compilation failed: "+N.getShaderInfoLog(t));var o=N.createProgram();if(!o)throw new Error("Failed to create shader program");if(N.attachShader(o,n),N.attachShader(o,t),N.linkProgram(o),!N.getProgramParameter(o,N.LINK_STATUS))throw new Error("Shader program linking failed: "+N.getProgramInfoLog(o));N.useProgram(o);for(var a=137,i=new Float32Array(4*a),u=2*Math.PI/a,c=0;c<a;c++){var s=c*u;i[4*c]=0,i[4*c+1]=0,i[4*c+2]=Math.cos(s)*(F.width/2),i[4*c+3]=Math.sin(s)*(F.height/2)}var l=N.createBuffer();N.bindBuffer(N.ARRAY_BUFFER,l),N.bufferData(N.ARRAY_BUFFER,i,N.STATIC_DRAW);var d=N.getAttribLocation(o,"position");N.enableVertexAttribArray(d),N.vertexAttribPointer(d,2,N.FLOAT,!1,0,0),N.viewport(0,0,F.width,F.height),N.clearColor(0,0,0,1),N.clear(N.COLOR_BUFFER_BIT),N.drawArrays(N.LINES,0,2*a);var f=new Uint8ClampedArray(F.width*F.height*4);return N.readPixels(0,0,F.width,F.height,N.RGBA,N.UNSIGNED_BYTE,f),new ImageData(f,F.width,F.height)}catch(e){return new ImageData(1,1)}finally{N&&(N.bindBuffer(N.ARRAY_BUFFER,null),N.useProgram(null),N.viewport(0,0,N.drawingBufferWidth,N.drawingBufferHeight),N.clearColor(0,0,0,0))}}()})),[2,{commonImageHash:m(b(e,F.width,F.height).data.toString()).toString()}]}catch(e){return[2,{webgl:"unsupported"}]}return[2]}))}))}));var U=function(e,r,n,t){for(var o=(n-r)/t,a=0,i=0;i<t;i++){a+=e(r+(i+.5)*o)}return a*o};i("math",(function(){return r(void 0,void 0,void 0,(function(){return n(this,(function(e){return[2,{acos:Math.acos(.5),asin:U(Math.asin,-1,1,97),atan:U(Math.atan,-1,1,97),cos:U(Math.cos,0,Math.PI,97),cosh:Math.cosh(9/7),e:Math.E,largeCos:Math.cos(1e20),largeSin:Math.sin(1e20),largeTan:Math.tan(1e20),log:Math.log(1e3),pi:Math.PI,sin:U(Math.sin,-Math.PI,Math.PI,97),sinh:U(Math.sinh,-9/7,7/9,97),sqrt:Math.sqrt(2),tan:U(Math.tan,0,2*Math.PI,97),tanh:U(Math.tanh,-9/7,7/9,97)}]}))}))})),e.getFingerprint=function(e){return r(this,void 0,void 0,(function(){var r,t;return n(this,(function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),[4,w()];case 1:return r=n.sent(),t=m(JSON.stringify(r)),e?[2,{hash:t.toString(),data:r}]:[2,t.toString()];case 2:throw n.sent();case 3:return[2]}}))}))},e.getFingerprintData=w,e.getFingerprintPerformance=function(){return r(this,void 0,void 0,(function(){var e,r,o,i;return n(this,(function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),e=u(),r=Object.keys(e),[4,p(Object.values(e),(null==t?void 0:t.timeout)||1e3,a)];case 1:return o=n.sent(),i={elapsed:{}},o.forEach((function(e,n){i[r[n]]=e.value,i.elapsed[r[n]]=e.elapsed})),[2,i];case 2:throw n.sent();case 3:return[2]}}))}))},e.getVersion=function(){return"0.14.8"},e.setOption=function(e,r){if(!["exclude","permissions_to_check","retries","timeout"].includes(e))throw new Error("Unknown option "+e);if(["exclude","permissions_to_check"].includes(e)&&(!Array.isArray(r)||!r.every((function(e){return"string"==typeof e}))))throw new Error("The value of the exclude and permissions_to_check must be an array of strings");if(["retries","timeout"].includes(e)&&"number"!=typeof r)throw new Error("The value of retries must be a number");t[e]=r}}));
//# sourceMappingURL=thumbmark.umd.js.map
