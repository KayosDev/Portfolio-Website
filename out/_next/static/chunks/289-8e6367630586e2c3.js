(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[289],{8199:function(e,t){"use strict";var r,i,s,o;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ACTION_FAST_REFRESH:function(){return h},ACTION_NAVIGATE:function(){return n},ACTION_PREFETCH:function(){return c},ACTION_REFRESH:function(){return a},ACTION_RESTORE:function(){return l},ACTION_SERVER_ACTION:function(){return f},ACTION_SERVER_PATCH:function(){return u},PrefetchCacheEntryStatus:function(){return i},PrefetchKind:function(){return r},isThenable:function(){return d}});let a="refresh",n="navigate",l="restore",u="server-patch",c="prefetch",h="fast-refresh",f="server-action";function d(e){return e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof e.then}(s=r||(r={})).AUTO="auto",s.FULL="full",s.TEMPORARY="temporary",(o=i||(i={})).fresh="fresh",o.reusable="reusable",o.expired="expired",o.stale="stale",("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7195:function(e,t,r){"use strict";function i(e,t,r,i){return!1}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getDomainLocale",{enumerable:!0,get:function(){return i}}),r(8337),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8342:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return T}});let i=r(8754),s=r(5893),o=i._(r(7294)),a=r(6075),n=r(3955),l=r(8041),u=r(9903),c=r(5490),h=r(1928),f=r(257),d=r(4229),p=r(7195),m=r(9470),v=r(8199),g=new Set;function b(e,t,r,i,s,o){if(o||(0,n.isLocalURL)(t)){if(!i.bypassPrefetchedCheck){let s=t+"%"+r+"%"+(void 0!==i.locale?i.locale:"locale"in e?e.locale:void 0);if(g.has(s))return;g.add(s)}(async()=>o?e.prefetch(t,s):e.prefetch(t,r,i))().catch(e=>{})}}function x(e){return"string"==typeof e?e:(0,l.formatUrl)(e)}let T=o.default.forwardRef(function(e,t){let r,i;let{href:l,as:g,children:T,prefetch:C=null,passHref:y,replace:M,shallow:S,scroll:w,locale:_,onClick:R,onMouseEnter:P,onTouchStart:E,legacyBehavior:D=!1,...U}=e;r=T,D&&("string"==typeof r||"number"==typeof r)&&(r=(0,s.jsx)("a",{children:r}));let B=o.default.useContext(h.RouterContext),j=o.default.useContext(f.AppRouterContext),A=null!=B?B:j,F=!B,O=!1!==C,z=null===C?v.PrefetchKind.AUTO:v.PrefetchKind.FULL,{href:k,as:L}=o.default.useMemo(()=>{if(!B){let e=x(l);return{href:e,as:g?x(g):e}}let[e,t]=(0,a.resolveHref)(B,l,!0);return{href:e,as:g?(0,a.resolveHref)(B,g):t||e}},[B,l,g]),I=o.default.useRef(k),N=o.default.useRef(L);D&&(i=o.default.Children.only(r));let Q=D?i&&"object"==typeof i&&i.ref:t,[V,H,K]=(0,d.useIntersection)({rootMargin:"200px"}),Y=o.default.useCallback(e=>{(N.current!==L||I.current!==k)&&(K(),N.current=L,I.current=k),V(e),Q&&("function"==typeof Q?Q(e):"object"==typeof Q&&(Q.current=e))},[L,Q,k,K,V]);o.default.useEffect(()=>{A&&H&&O&&b(A,k,L,{locale:_},{kind:z},F)},[L,k,H,_,O,null==B?void 0:B.locale,A,F,z]);let W={ref:Y,onClick(e){D||"function"!=typeof R||R(e),D&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(e),A&&!e.defaultPrevented&&function(e,t,r,i,s,a,l,u,c){let{nodeName:h}=e.currentTarget;if("A"===h.toUpperCase()&&(function(e){let t=e.currentTarget.getAttribute("target");return t&&"_self"!==t||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)||!c&&!(0,n.isLocalURL)(r)))return;e.preventDefault();let f=()=>{let e=null==l||l;"beforePopState"in t?t[s?"replace":"push"](r,i,{shallow:a,locale:u,scroll:e}):t[s?"replace":"push"](i||r,{scroll:e})};c?o.default.startTransition(f):f()}(e,A,k,L,M,S,w,_,F)},onMouseEnter(e){D||"function"!=typeof P||P(e),D&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),A&&(O||!F)&&b(A,k,L,{locale:_,priority:!0,bypassPrefetchedCheck:!0},{kind:z},F)},onTouchStart:function(e){D||"function"!=typeof E||E(e),D&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),A&&(O||!F)&&b(A,k,L,{locale:_,priority:!0,bypassPrefetchedCheck:!0},{kind:z},F)}};if((0,u.isAbsoluteUrl)(L))W.href=L;else if(!D||y||"a"===i.type&&!("href"in i.props)){let e=void 0!==_?_:null==B?void 0:B.locale,t=(null==B?void 0:B.isLocaleDomain)&&(0,p.getDomainLocale)(L,e,null==B?void 0:B.locales,null==B?void 0:B.domainLocales);W.href=t||(0,m.addBasePath)((0,c.addLocale)(L,e,null==B?void 0:B.defaultLocale))}return D?o.default.cloneElement(i,W):(0,s.jsx)("a",{...U,...W,children:r})});("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},4229:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useIntersection",{enumerable:!0,get:function(){return l}});let i=r(7294),s=r(4474),o="function"==typeof IntersectionObserver,a=new Map,n=[];function l(e){let{rootRef:t,rootMargin:r,disabled:l}=e,u=l||!o,[c,h]=(0,i.useState)(!1),f=(0,i.useRef)(null),d=(0,i.useCallback)(e=>{f.current=e},[]);return(0,i.useEffect)(()=>{if(o){if(u||c)return;let e=f.current;if(e&&e.tagName)return function(e,t,r){let{id:i,observer:s,elements:o}=function(e){let t;let r={root:e.root||null,margin:e.rootMargin||""},i=n.find(e=>e.root===r.root&&e.margin===r.margin);if(i&&(t=a.get(i)))return t;let s=new Map;return t={id:r,observer:new IntersectionObserver(e=>{e.forEach(e=>{let t=s.get(e.target),r=e.isIntersecting||e.intersectionRatio>0;t&&r&&t(r)})},e),elements:s},n.push(r),a.set(r,t),t}(r);return o.set(e,t),s.observe(e),function(){if(o.delete(e),s.unobserve(e),0===o.size){s.disconnect(),a.delete(i);let e=n.findIndex(e=>e.root===i.root&&e.margin===i.margin);e>-1&&n.splice(e,1)}}}(e,e=>e&&h(e),{root:null==t?void 0:t.current,rootMargin:r})}else if(!c){let e=(0,s.requestIdleCallback)(()=>h(!0));return()=>(0,s.cancelIdleCallback)(e)}},[u,r,t,c,f.current]),[d,c,(0,i.useCallback)(()=>{h(!1)},[])]}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8070:function(e,t,r){"use strict";var i=r(3967),s=r.n(i),o=r(7294),a=r(7400),n=r(5893);let l=o.forwardRef((e,t)=>{let[{className:r,...i},{as:o="div",bsPrefix:l,spans:u}]=function(e){let{as:t,bsPrefix:r,className:i,...o}=e;r=(0,a.vE)(r,"col");let n=(0,a.pi)(),l=(0,a.zG)(),u=[],c=[];return n.forEach(e=>{let t,i,s;let a=o[e];delete o[e],"object"==typeof a&&null!=a?{span:t,offset:i,order:s}=a:t=a;let n=e!==l?"-".concat(e):"";t&&u.push(!0===t?"".concat(r).concat(n):"".concat(r).concat(n,"-").concat(t)),null!=s&&c.push("order".concat(n,"-").concat(s)),null!=i&&c.push("offset".concat(n,"-").concat(i))}),[{...o,className:s()(i,...u,...c)},{as:t,bsPrefix:r,spans:u}]}(e);return(0,n.jsx)(o,{...i,ref:t,className:s()(r,!u.length&&l)})});l.displayName="Col",t.Z=l},7375:function(e,t,r){"use strict";var i=r(3967),s=r.n(i),o=r(7294),a=r(7400),n=r(5893);let l=o.forwardRef((e,t)=>{let{bsPrefix:r,fluid:i=!1,as:o="div",className:l,...u}=e,c=(0,a.vE)(r,"container");return(0,n.jsx)(o,{ref:t,...u,className:s()(l,i?"".concat(c).concat("string"==typeof i?"-".concat(i):"-fluid"):c)})});l.displayName="Container",t.Z=l},9101:function(e,t,r){"use strict";var i=r(3967),s=r.n(i),o=r(7294),a=r(7400),n=r(5893);let l=o.forwardRef((e,t)=>{let{bsPrefix:r,className:i,as:o="div",...l}=e,u=(0,a.vE)(r,"row"),c=(0,a.pi)(),h=(0,a.zG)(),f="".concat(u,"-cols"),d=[];return c.forEach(e=>{let t;let r=l[e];delete l[e],null!=r&&"object"==typeof r?{cols:t}=r:t=r,null!=t&&d.push("".concat(f).concat(e!==h?"-".concat(e):"","-").concat(t))}),(0,n.jsx)(o,{ref:t,...l,className:s()(i,u,...d)})});l.displayName="Row",t.Z=l},7400:function(e,t,r){"use strict";r.d(t,{pi:function(){return l},vE:function(){return n},zG:function(){return u}});var i=r(7294);r(5893);let s=i.createContext({prefixes:{},breakpoints:["xxl","xl","lg","md","sm","xs"],minBreakpoint:"xs"}),{Consumer:o,Provider:a}=s;function n(e,t){let{prefixes:r}=(0,i.useContext)(s);return e||r[t]||t}function l(){let{breakpoints:e}=(0,i.useContext)(s);return e}function u(){let{minBreakpoint:e}=(0,i.useContext)(s);return e}},7121:function(){},9008:function(e,t,r){e.exports=r(3867)},1664:function(e,t,r){e.exports=r(8342)},3967:function(e,t){var r;!function(){"use strict";var i={}.hasOwnProperty;function s(){for(var e="",t=0;t<arguments.length;t++){var r=arguments[t];r&&(e=o(e,function(e){if("string"==typeof e||"number"==typeof e)return e;if("object"!=typeof e)return"";if(Array.isArray(e))return s.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var t="";for(var r in e)i.call(e,r)&&e[r]&&(t=o(t,r));return t}(r)))}return e}function o(e,t){return t?e?e+" "+t:e+t:e}e.exports?(s.default=s,e.exports=s):void 0!==(r=(function(){return s}).apply(t,[]))&&(e.exports=r)}()},8606:function(e,t,r){"use strict";r.d(t,{x:function(){return u}});var i=r(9477),s=r(1154),o=r(7531),a=r(8304);class n extends a.w{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,r){let i,s;let o=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0),this.inverse?(i=0,s=1):(i=1,s=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(o.REPLACE,o.REPLACE,o.REPLACE),a.buffers.stencil.setFunc(o.ALWAYS,i,4294967295),a.buffers.stencil.setClear(s),a.buffers.stencil.setLocked(!0),e.setRenderTarget(r),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(o.EQUAL,1,4294967295),a.buffers.stencil.setOp(o.KEEP,o.KEEP,o.KEEP),a.buffers.stencil.setLocked(!0)}}class l extends a.w{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class u{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),void 0===t){let r=e.getSize(new i.FM8);this._width=r.width,this._height=r.height,(t=new i.dd2(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:i.cLu})).texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new o.T(s.C),this.copyPass.material.blending=i.jFi,this.clock=new i.SUY}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);-1!==t&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){void 0===e&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),r=!1;for(let t=0,i=this.passes.length;t<i;t++){let i=this.passes[t];if(!1!==i.enabled){if(i.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),i.render(this.renderer,this.writeBuffer,this.readBuffer,e,r),i.needsSwap){if(r){let t=this.renderer.getContext(),r=this.renderer.state.buffers.stencil;r.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),r.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}void 0!==n&&(i instanceof n?r=!0:i instanceof l&&(r=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(void 0===e){let t=this.renderer.getSize(new i.FM8);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,(e=this.renderTarget1.clone()).setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let r=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(r,i),this.renderTarget2.setSize(r,i);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(r,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}},6127:function(e,t,r){"use strict";r.d(t,{t:function(){return a}});var i=r(9477),s=r(8304);let o={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		uniform float intensity;
		uniform bool grayscale;
		uniform float time;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 base = texture2D( tDiffuse, vUv );

			float noise = rand( vUv + time );

			vec3 color = base.rgb + base.rgb * clamp( 0.1 + noise, 0.0, 1.0 );

			color = mix( base.rgb, color, intensity );

			if ( grayscale ) {

				color = vec3( luminance( color ) ); // assuming linear-srgb

			}

			gl_FragColor = vec4( color, base.a );

		}`};class a extends s.w{constructor(e=.5,t=!1){super(),this.uniforms=i.rDY.clone(o.uniforms),this.material=new i.jyz({name:o.name,uniforms:this.uniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.uniforms.intensity.value=e,this.uniforms.grayscale.value=t,this.fsQuad=new s.T(this.material)}render(e,t,r,i){this.uniforms.tDiffuse.value=r.texture,this.uniforms.time.value+=i,this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(t),this.clear&&e.clear()),this.fsQuad.render(e)}dispose(){this.material.dispose(),this.fsQuad.dispose()}}},8304:function(e,t,r){"use strict";r.d(t,{T:function(){return n},w:function(){return s}});var i=r(9477);class s{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}let o=new i.iKG(-1,1,1,-1,0,1),a=new i.u9r;a.setAttribute("position",new i.a$l([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new i.a$l([0,2,0,0,2,0],2));class n{constructor(e){this._mesh=new i.Kj0(a,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,o)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}},4458:function(e,t,r){"use strict";r.d(t,{C:function(){return o}});var i=r(9477),s=r(8304);class o extends s.w{constructor(e,t,r=null,s=null,o=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=r,this.clearColor=s,this.clearAlpha=o,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new i.Ilk}render(e,t,r){let i,s;let o=e.autoClear;e.autoClear=!1,null!==this.overrideMaterial&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),null!==this.clearColor&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor)),null!==this.clearAlpha&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),!0==this.clearDepth&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:r),!0===this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),null!==this.clearColor&&e.setClearColor(this._oldClearColor),null!==this.clearAlpha&&e.setClearAlpha(i),null!==this.overrideMaterial&&(this.scene.overrideMaterial=s),e.autoClear=o}}},7531:function(e,t,r){"use strict";r.d(t,{T:function(){return o}});var i=r(9477),s=r(8304);class o extends s.w{constructor(e,t){super(),this.textureID=void 0!==t?t:"tDiffuse",e instanceof i.jyz?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=i.rDY.clone(e.uniforms),this.material=new i.jyz({name:void 0!==e.name?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new s.T(this.material)}render(e,t,r){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=r.texture),this.fsQuad.material=this.material,this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil)),this.fsQuad.render(e)}dispose(){this.material.dispose(),this.fsQuad.dispose()}}},6591:function(e,t,r){"use strict";r.d(t,{m:function(){return n}});var i=r(9477),s=r(8304),o=r(1154);let a={shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new i.Ilk(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class n extends s.w{constructor(e,t,r,n){super(),this.strength=void 0!==t?t:1,this.radius=r,this.threshold=n,this.resolution=void 0!==e?new i.FM8(e.x,e.y):new i.FM8(256,256),this.clearColor=new i.Ilk(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let l=Math.round(this.resolution.x/2),u=Math.round(this.resolution.y/2);this.renderTargetBright=new i.dd2(l,u,{type:i.cLu}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new i.dd2(l,u,{type:i.cLu});t.texture.name="UnrealBloomPass.h"+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let r=new i.dd2(l,u,{type:i.cLu});r.texture.name="UnrealBloomPass.v"+e,r.texture.generateMipmaps=!1,this.renderTargetsVertical.push(r),l=Math.round(l/2),u=Math.round(u/2)}this.highPassUniforms=i.rDY.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new i.jyz({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let c=[3,5,7,9,11];l=Math.round(this.resolution.x/2),u=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new i.FM8(1/l,1/u),l=Math.round(l/2),u=Math.round(u/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1,this.compositeMaterial.uniforms.bloomFactors.value=[1,.8,.6,.4,.2],this.bloomTintColors=[new i.Pa4(1,1,1),new i.Pa4(1,1,1),new i.Pa4(1,1,1),new i.Pa4(1,1,1),new i.Pa4(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;let h=o.C;this.copyUniforms=i.rDY.clone(h.uniforms),this.blendMaterial=new i.jyz({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:i.WMw,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new i.Ilk,this.oldClearAlpha=1,this.basic=new i.vBJ,this.fsQuad=new s.T(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let r=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(r,s);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(r,s),this.renderTargetsVertical[e].setSize(r,s),this.separableBlurMaterials[e].uniforms.invSize.value=new i.FM8(1/r,1/s),r=Math.round(r/2),s=Math.round(s/2)}render(e,t,r,i,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=r.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let a=this.renderTargetBright;for(let t=0;t<this.nMips;t++)this.fsQuad.material=this.separableBlurMaterials[t],this.separableBlurMaterials[t].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[t].uniforms.direction.value=n.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[t]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[t].uniforms.colorTexture.value=this.renderTargetsHorizontal[t].texture,this.separableBlurMaterials[t].uniforms.direction.value=n.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[t]),e.clear(),this.fsQuad.render(e),a=this.renderTargetsVertical[t];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?e.setRenderTarget(null):e.setRenderTarget(r),this.fsQuad.render(e),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){let t=[];for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(e*e))/e);return new i.jyz({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new i.FM8(.5,.5)},direction:{value:new i.FM8(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new i.jyz({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}n.BlurDirectionX=new i.FM8(1,0),n.BlurDirectionY=new i.FM8(0,1)},1154:function(e,t,r){"use strict";r.d(t,{C:function(){return i}});let i={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`}}}]);