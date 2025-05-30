/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./components/Cursor.jsx":
/*!*******************************!*\
  !*** ./components/Cursor.jsx ***!
  \*******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Cursor)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _react_spring_web__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @react-spring/web */ \"@react-spring/web\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_react_spring_web__WEBPACK_IMPORTED_MODULE_2__]);\n_react_spring_web__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nfunction Cursor() {\n    const [{ x, y }, api] = (0,_react_spring_web__WEBPACK_IMPORTED_MODULE_2__.useSpring)(()=>({\n            x: -100,\n            y: -100,\n            config: {\n                tension: 300,\n                friction: 30\n            }\n        }));\n    const mousePos = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)({\n        x: -100,\n        y: -100\n    });\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const move = (e)=>{\n            mousePos.current = {\n                x: e.clientX - 8,\n                y: e.clientY - 8\n            };\n            api.start({\n                x: mousePos.current.x,\n                y: mousePos.current.y\n            });\n        };\n        window.addEventListener(\"mousemove\", move);\n        return ()=>window.removeEventListener(\"mousemove\", move);\n    }, [\n        api\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_spring_web__WEBPACK_IMPORTED_MODULE_2__.animated.div, {\n                className: \"cursor-dot\",\n                style: {\n                    transform: (0,_react_spring_web__WEBPACK_IMPORTED_MODULE_2__.to)([\n                        x,\n                        y\n                    ], (xv, yv)=>`translateX(${xv}px) translateY(${yv}px)`)\n                }\n            }, void 0, false, {\n                fileName: \"/home/kayosdev/Websites/Portfolio/components/Cursor.jsx\",\n                lineNumber: 19,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_spring_web__WEBPACK_IMPORTED_MODULE_2__.animated.div, {\n                className: \"cursor-outline\",\n                style: {\n                    transform: (0,_react_spring_web__WEBPACK_IMPORTED_MODULE_2__.to)([\n                        x,\n                        y\n                    ], (xv, yv)=>`translateX(${xv}px) translateY(${yv}px)`)\n                }\n            }, void 0, false, {\n                fileName: \"/home/kayosdev/Websites/Portfolio/components/Cursor.jsx\",\n                lineNumber: 20,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL0N1cnNvci5qc3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUF5QztBQUNrQjtBQUU1QyxTQUFTSztJQUN0QixNQUFNLENBQUMsRUFBRUMsQ0FBQyxFQUFFQyxDQUFDLEVBQUUsRUFBRUMsSUFBSSxHQUFHTiw0REFBU0EsQ0FBQyxJQUFPO1lBQUVJLEdBQUcsQ0FBQztZQUFLQyxHQUFHLENBQUM7WUFBS0UsUUFBUTtnQkFBRUMsU0FBUztnQkFBS0MsVUFBVTtZQUFHO1FBQUU7SUFDcEcsTUFBTUMsV0FBV1gsNkNBQU1BLENBQUM7UUFBRUssR0FBRyxDQUFDO1FBQUtDLEdBQUcsQ0FBQztJQUFJO0lBRTNDUCxnREFBU0EsQ0FBQztRQUNSLE1BQU1hLE9BQU8sQ0FBQ0M7WUFDWkYsU0FBU0csT0FBTyxHQUFHO2dCQUFFVCxHQUFHUSxFQUFFRSxPQUFPLEdBQUc7Z0JBQUdULEdBQUdPLEVBQUVHLE9BQU8sR0FBRztZQUFFO1lBQ3hEVCxJQUFJVSxLQUFLLENBQUM7Z0JBQUVaLEdBQUdNLFNBQVNHLE9BQU8sQ0FBQ1QsQ0FBQztnQkFBRUMsR0FBR0ssU0FBU0csT0FBTyxDQUFDUixDQUFDO1lBQUM7UUFDM0Q7UUFDQVksT0FBT0MsZ0JBQWdCLENBQUMsYUFBYVA7UUFDckMsT0FBTyxJQUFNTSxPQUFPRSxtQkFBbUIsQ0FBQyxhQUFhUjtJQUN2RCxHQUFHO1FBQUNMO0tBQUk7SUFFUixxQkFDRTs7MEJBQ0UsOERBQUNMLHVEQUFRQSxDQUFDbUIsR0FBRztnQkFBQ0MsV0FBVTtnQkFBYUMsT0FBTztvQkFBRUMsV0FBV3JCLHFEQUFFQSxDQUFDO3dCQUFDRTt3QkFBR0M7cUJBQUUsRUFBRSxDQUFDbUIsSUFBSUMsS0FBTyxDQUFDLFdBQVcsRUFBRUQsR0FBRyxlQUFlLEVBQUVDLEdBQUcsR0FBRyxDQUFDO2dCQUFFOzs7Ozs7MEJBQzNILDhEQUFDeEIsdURBQVFBLENBQUNtQixHQUFHO2dCQUFDQyxXQUFVO2dCQUFpQkMsT0FBTztvQkFBRUMsV0FBV3JCLHFEQUFFQSxDQUFDO3dCQUFDRTt3QkFBR0M7cUJBQUUsRUFBRSxDQUFDbUIsSUFBSUMsS0FBTyxDQUFDLFdBQVcsRUFBRUQsR0FBRyxlQUFlLEVBQUVDLEdBQUcsR0FBRyxDQUFDO2dCQUFFOzs7Ozs7OztBQUdySSIsInNvdXJjZXMiOlsid2VicGFjazovL3BvcnRmb2xpby8uL2NvbXBvbmVudHMvQ3Vyc29yLmpzeD83MWI4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VTcHJpbmcsIGFuaW1hdGVkLCB0byB9IGZyb20gJ0ByZWFjdC1zcHJpbmcvd2ViJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDdXJzb3IoKSB7XG4gIGNvbnN0IFt7IHgsIHkgfSwgYXBpXSA9IHVzZVNwcmluZygoKSA9PiAoeyB4OiAtMTAwLCB5OiAtMTAwLCBjb25maWc6IHsgdGVuc2lvbjogMzAwLCBmcmljdGlvbjogMzAgfSB9KSlcbiAgY29uc3QgbW91c2VQb3MgPSB1c2VSZWYoeyB4OiAtMTAwLCB5OiAtMTAwIH0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBtb3ZlID0gKGUpID0+IHtcbiAgICAgIG1vdXNlUG9zLmN1cnJlbnQgPSB7IHg6IGUuY2xpZW50WCAtIDgsIHk6IGUuY2xpZW50WSAtIDggfVxuICAgICAgYXBpLnN0YXJ0KHsgeDogbW91c2VQb3MuY3VycmVudC54LCB5OiBtb3VzZVBvcy5jdXJyZW50LnkgfSlcbiAgICB9XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmUpXG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlKVxuICB9LCBbYXBpXSlcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8YW5pbWF0ZWQuZGl2IGNsYXNzTmFtZT1cImN1cnNvci1kb3RcIiBzdHlsZT17eyB0cmFuc2Zvcm06IHRvKFt4LCB5XSwgKHh2LCB5dikgPT4gYHRyYW5zbGF0ZVgoJHt4dn1weCkgdHJhbnNsYXRlWSgke3l2fXB4KWApIH19IC8+XG4gICAgICA8YW5pbWF0ZWQuZGl2IGNsYXNzTmFtZT1cImN1cnNvci1vdXRsaW5lXCIgc3R5bGU9e3sgdHJhbnNmb3JtOiB0byhbeCwgeV0sICh4diwgeXYpID0+IGB0cmFuc2xhdGVYKCR7eHZ9cHgpIHRyYW5zbGF0ZVkoJHt5dn1weClgKSB9fSAvPlxuICAgIDwvPlxuICApXG59XG4iXSwibmFtZXMiOlsidXNlRWZmZWN0IiwidXNlUmVmIiwidXNlU3ByaW5nIiwiYW5pbWF0ZWQiLCJ0byIsIkN1cnNvciIsIngiLCJ5IiwiYXBpIiwiY29uZmlnIiwidGVuc2lvbiIsImZyaWN0aW9uIiwibW91c2VQb3MiLCJtb3ZlIiwiZSIsImN1cnJlbnQiLCJjbGllbnRYIiwiY2xpZW50WSIsInN0YXJ0Iiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXYiLCJjbGFzc05hbWUiLCJzdHlsZSIsInRyYW5zZm9ybSIsInh2IiwieXYiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/Cursor.jsx\n");

/***/ }),

/***/ "./components/ScrollIndicator.jsx":
/*!****************************************!*\
  !*** ./components/ScrollIndicator.jsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ScrollIndicator)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction ScrollIndicator() {\n    const [width, setWidth] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const onScroll = ()=>{\n            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);\n            setWidth(scrollPercent * 100);\n        };\n        window.addEventListener(\"scroll\", onScroll);\n        return ()=>window.removeEventListener(\"scroll\", onScroll);\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"progress-bar\",\n        style: {\n            width: `${width}%`\n        }\n    }, void 0, false, {\n        fileName: \"/home/kayosdev/Websites/Portfolio/components/ScrollIndicator.jsx\",\n        lineNumber: 13,\n        columnNumber: 10\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL1Njcm9sbEluZGljYXRvci5qc3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQTJDO0FBRTVCLFNBQVNFO0lBQ3RCLE1BQU0sQ0FBQ0MsT0FBT0MsU0FBUyxHQUFHSCwrQ0FBUUEsQ0FBQztJQUNuQ0QsZ0RBQVNBLENBQUM7UUFDUixNQUFNSyxXQUFXO1lBQ2YsTUFBTUMsZ0JBQWdCQyxPQUFPQyxPQUFPLEdBQUlDLENBQUFBLFNBQVNDLElBQUksQ0FBQ0MsWUFBWSxHQUFHSixPQUFPSyxXQUFXO1lBQ3ZGUixTQUFTRSxnQkFBZ0I7UUFDM0I7UUFDQUMsT0FBT00sZ0JBQWdCLENBQUMsVUFBVVI7UUFDbEMsT0FBTyxJQUFNRSxPQUFPTyxtQkFBbUIsQ0FBQyxVQUFVVDtJQUNwRCxHQUFHLEVBQUU7SUFDTCxxQkFBTyw4REFBQ1U7UUFBSUMsV0FBVTtRQUFlQyxPQUFPO1lBQUVkLE9BQU8sQ0FBQyxFQUFFQSxNQUFNLENBQUMsQ0FBQztRQUFDOzs7Ozs7QUFDbkUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wb3J0Zm9saW8vLi9jb21wb25lbnRzL1Njcm9sbEluZGljYXRvci5qc3g/NzZiYyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNjcm9sbEluZGljYXRvcigpIHtcbiAgY29uc3QgW3dpZHRoLCBzZXRXaWR0aF0gPSB1c2VTdGF0ZSgwKVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG9uU2Nyb2xsID0gKCkgPT4ge1xuICAgICAgY29uc3Qgc2Nyb2xsUGVyY2VudCA9IHdpbmRvdy5zY3JvbGxZIC8gKGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0IC0gd2luZG93LmlubmVySGVpZ2h0KVxuICAgICAgc2V0V2lkdGgoc2Nyb2xsUGVyY2VudCAqIDEwMClcbiAgICB9XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIG9uU2Nyb2xsKVxuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TY3JvbGwpXG4gIH0sIFtdKVxuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzcy1iYXJcIiBzdHlsZT17eyB3aWR0aDogYCR7d2lkdGh9JWAgfX0gLz5cbn1cbiJdLCJuYW1lcyI6WyJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIlNjcm9sbEluZGljYXRvciIsIndpZHRoIiwic2V0V2lkdGgiLCJvblNjcm9sbCIsInNjcm9sbFBlcmNlbnQiLCJ3aW5kb3ciLCJzY3JvbGxZIiwiZG9jdW1lbnQiLCJib2R5Iiwic2Nyb2xsSGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRpdiIsImNsYXNzTmFtZSIsInN0eWxlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/ScrollIndicator.jsx\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_global_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/global.css */ \"./styles/global.css\");\n/* harmony import */ var _styles_global_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_global_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var bootstrap_dist_css_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bootstrap/dist/css/bootstrap.min.css */ \"./node_modules/bootstrap/dist/css/bootstrap.min.css\");\n/* harmony import */ var bootstrap_dist_css_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bootstrap_dist_css_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_Cursor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/Cursor */ \"./components/Cursor.jsx\");\n/* harmony import */ var _components_ScrollIndicator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/ScrollIndicator */ \"./components/ScrollIndicator.jsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_Cursor__WEBPACK_IMPORTED_MODULE_3__]);\n_components_Cursor__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\nfunction MyApp({ Component, pageProps, router }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Cursor__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {}, void 0, false, {\n                fileName: \"/home/kayosdev/Websites/Portfolio/pages/_app.js\",\n                lineNumber: 9,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ScrollIndicator__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {}, void 0, false, {\n                fileName: \"/home/kayosdev/Websites/Portfolio/pages/_app.js\",\n                lineNumber: 10,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/home/kayosdev/Websites/Portfolio/pages/_app.js\",\n                lineNumber: 11,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBNkI7QUFDZ0I7QUFDSjtBQUNrQjtBQUUzRCxTQUFTRSxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFQyxNQUFNLEVBQUU7SUFDN0MscUJBQ0U7OzBCQUNFLDhEQUFDTCwwREFBTUE7Ozs7OzBCQUNQLDhEQUFDQyxtRUFBZUE7Ozs7OzBCQUNoQiw4REFBQ0U7Z0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7QUFHOUI7QUFFQSxpRUFBZUYsS0FBS0EsRUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL3BvcnRmb2xpby8uL3BhZ2VzL19hcHAuanM/ZTBhZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWwuY3NzJ1xuaW1wb3J0ICdib290c3RyYXAvZGlzdC9jc3MvYm9vdHN0cmFwLm1pbi5jc3MnXG5pbXBvcnQgQ3Vyc29yIGZyb20gJy4uL2NvbXBvbmVudHMvQ3Vyc29yJ1xuaW1wb3J0IFNjcm9sbEluZGljYXRvciBmcm9tICcuLi9jb21wb25lbnRzL1Njcm9sbEluZGljYXRvcidcblxuZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcywgcm91dGVyIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPEN1cnNvciAvPlxuICAgICAgPFNjcm9sbEluZGljYXRvciAvPlxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgIDwvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IE15QXBwXG4iXSwibmFtZXMiOlsiQ3Vyc29yIiwiU2Nyb2xsSW5kaWNhdG9yIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJyb3V0ZXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/global.css":
/*!***************************!*\
  !*** ./styles/global.css ***!
  \***************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@react-spring/web":
/*!************************************!*\
  !*** external "@react-spring/web" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@react-spring/web");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/bootstrap"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();