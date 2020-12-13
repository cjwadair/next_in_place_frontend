(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["nextInPlace"] = factory();
	else
		root["nextInPlace"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! namespace exports */
/*! export default [provided] [maybe used in main (runtime-defined)] [usage prevents renaming] */
/*! other exports [not provided] [maybe used in main (runtime-defined)] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _next_in_place_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./next_in_place_editor */ "./src/next_in_place_editor.js");

var NextInPlace = {
  addListeners: function addListeners() {
    var nipSelector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var selector = nipSelector ? nipSelector : 'next-in-place';
    document.addEventListener("click", function (event) {
      if (event.target.classList.contains(selector)) {
        var nip = new _next_in_place_editor__WEBPACK_IMPORTED_MODULE_0__.default(event.target.closest('.next-in-place'));

        if (nip.formType === 'checkbox') {
          var current_value = nip.value;
          var new_value = nip.collection['false'];

          if (current_value === new_value) {
            new_value = nip.collection['true'];
          }

          nip.submitForm(new_value);
        } else {
          nip.activateForm();
        }
      }
    });
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NextInPlace);

/***/ }),

/***/ "./src/next_in_place_editor.js":
/*!*************************************!*\
  !*** ./src/next_in_place_editor.js ***!
  \*************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ NextInPlaceEditor
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NextInPlaceEditor = /*#__PURE__*/function () {
  function NextInPlaceEditor(e) {
    _classCallCheck(this, NextInPlaceEditor);

    this.element = e;
    var data = this.element.dataset;
    this.value = data.nipValue;
    this.originalValue = data.nipOriginalValue;
    this.attributeName = data.nipAttribute;
    this.objectName = data.nipObject;
    this.formType = data.nipType;

    if (data.nipUrl) {
      this.url = data.nipUrl;
    }

    if (data.nipHtmlAttrs) {
      this.htmlAttrs = JSON.parse(data.nipHtmlAttrs);
    }

    if (data.nipCollection) {
      this.collection = JSON.parse(data.nipCollection);
    }
  }

  _createClass(NextInPlaceEditor, [{
    key: "activateForm",
    value: function activateForm() {
      // submit checkbox form directly - don't display form
      this.form = this.generateForm();
      var formField = this.element.querySelector('.nip-form-field');
      formField.focus();

      if (formField.nodeName !== "SELECT" && formField['type'] !== "checkbox") {
        this.element.querySelector('.nip-form-field').select();
      }
    }
  }, {
    key: "generateForm",
    value: function generateForm() {
      var _this = this;

      var form = document.createElement("form");
      form.setAttribute('class', "nip-form");
      form.addEventListener("submit", function (ev) {
        console.log('submit triggered');
        ev.preventDefault();
        document.activeElement.blur();
      }); // TODO: Add a config option to to allow users to include/exclude this listener based on how they want the update to work...

      form.addEventListener("focusout", function (ev) {
        console.log('focusout triggered');
        ev.preventDefault();

        if (event.target.nodeName !== 'SELECT') {
          _this.submitForm(form.firstChild.value);
        }
      });
      form.addEventListener("click", function (ev) {
        ev.preventDefault();

        if (event.target.nodeName === 'OPTION') {
          _this.submitForm(form.firstChild.value);
        }
      });
      form.addEventListener("keydown", function (ev) {
        if (event.key === "Enter" && event.target.nodeName === 'TEXTAREA') {
          ev.preventDefault();
          document.activeElement.blur();
        }

        if (event.target.nodeName === 'OPTION') {
          ev.preventDefault();
          document.activeElement.blur();
        }

        if (event.key === "Escape") {
          ev.preventDefault();

          _this.resetForm();
        }
      });
      this.element.innerHTML = "";
      this.element.appendChild(form);
      var formField = this.generateFormElement(this.formType);
      form.appendChild(formField);
      return form;
    }
  }, {
    key: "generateFormElement",
    value: function generateFormElement(formType) {
      var _this2 = this;

      var formElement;

      switch (formType) {
        case 'input':
          formElement = document.createElement("input");
          formElement.setAttribute('class', "nip-form-field");
          formElement.setAttribute('value', this.value);
          formElement.setAttribute('placeholder', this.value);
          break;

        case 'textarea':
          formElement = document.createElement("textarea");
          formElement.setAttribute('name', "".concat(this.objectName, "[").concat(this.attributeName, "]"));
          formElement.setAttribute('class', 'nip-form-field');
          formElement.value = this.value;
          Object.entries(this.htmlAttrs).forEach(function (attr) {
            return formElement.setAttribute(attr[0], attr[1]);
          });
          break;

        case 'select':
          formElement = document.createElement("select");
          formElement.setAttribute('name', "".concat(this.objectName, "[").concat(this.attributeName, "]"));
          formElement.setAttribute('class', 'nip-form-field');
          formElement.value = this.value;
          var options = Object.entries(this.collection);
          formElement.setAttribute('size', options.length);
          Object.entries(this.collection).forEach(function (option) {
            var el = document.createElement("option");
            el.text = option[0];
            el.value = option[1];

            if (el.value === _this2.value) {
              el.setAttribute('selected', 'selected');
            }

            formElement.appendChild(el);
          });
          break;

        default:
          console.error('bip:error unsupported form field type');
      }

      return formElement;
    }
  }, {
    key: "submitForm",
    value: function submitForm(new_value) {
      if (this.value !== new_value) {
        var value = this.stripTags(new_value);
        this.makeAjaxCall(value);
      } else {
        this.element.innerHTML = this.value;
      }
    }
  }, {
    key: "stripTags",
    value: function stripTags(val) {
      // TODO: Add if stmt to only apply for input and textarea tags???
      return val.replace(/<\/?[^>]+(>|$)/g, "");
    }
  }, {
    key: "resetForm",
    value: function resetForm() {
      this.element.innerHTML = this.value;
    }
  }, {
    key: "makeAjaxCall",
    value: function makeAjaxCall(new_value) {
      var self = this;
      var csrf = document.querySelector("meta[name=csrf-token]").content;
      fetch(this.pathName(), {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-Token": csrf
        },
        body: this.formatRequestData(new_value)
      }).then(function (response) {
        if (!response.ok) {
          // // TODO: THROW ERROR WITH BETTER MESSAGING BASED ON STATUS CODES...
          throw new Error("error: responded with code ".concat(response.status));
        }

        return response.json();
      }).then(function (data) {
        self.successHandler(data);
      })["catch"](function (error) {
        self.errorHandler(error);
      });
    }
  }, {
    key: "pathName",
    value: function pathName() {
      // TODO: add a url attribute to allow users to submit custom paths and use that in place of below when provided...
      // console.log('path name is: ', document.location.pathname);
      if (this.url) {
        return this.url;
      } else {
        var pathElements = this.element.id.split('-');
        return "/".concat(pathElements[2], "s/").concat(pathElements[1]); //creates a RESTful request like /things/123
      }
    }
  }, {
    key: "formatRequestData",
    value: function formatRequestData(new_value) {
      // return `${this.objectName}[${this.attributeName}]=${new_value}`
      var attribute = this.attributeName;
      var model = this.objectName;
      var attributes = {};
      attributes[this.attributeName] = new_value;
      var params = {};
      params[this.objectName] = attributes;
      return JSON.stringify(params);
    }
  }, {
    key: "successHandler",
    value: function successHandler(response) {
      console.log("updated ".concat(this.attributeName), response);
      this.value = response[this.attributeName];
      this.element.dataset.nipValue = this.value;
      this.element.innerHTML = this.value;
      this.emitEvent('nip:success');
    }
  }, {
    key: "errorHandler",
    value: function errorHandler(response) {
      var attribute = this.attributeName;
      console.error("unable to update ".concat(attribute), response);
      this.element.innerHTML = this.originalValue;
      this.emitEvent('nip:error');
    }
  }, {
    key: "emitEvent",
    value: function emitEvent(eventName) {
      // TODO: add polyfill to support custom events in ie back to ie9
      // See article saved in pocket for example polyfill
      var event = new CustomEvent(eventName);
      document.dispatchEvent(event);
    }
  }]);

  return NextInPlaceEditor;
}();


;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.js");
/******/ })()
;
});