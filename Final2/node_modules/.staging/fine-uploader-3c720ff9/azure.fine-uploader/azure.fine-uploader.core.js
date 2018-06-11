// Fine Uploader 5.14.2 - (c) 2013-present Widen Enterprises, Inc. MIT licensed. http://fineuploader.com
(function(global) {
    var qq = function(element) {
        "use strict";
        return {
            hide: function() {
                element.style.display = "none";
                return this;
            },
            attach: function(type, fn) {
                if (element.addEventListener) {
                    element.addEventListener(type, fn, false);
                } else if (element.attachEvent) {
                    element.attachEvent("on" + type, fn);
                }
                return function() {
                    qq(element).detach(type, fn);
                };
            },
            detach: function(type, fn) {
                if (element.removeEventListener) {
                    element.removeEventListener(type, fn, false);
                } else if (element.attachEvent) {
                    element.detachEvent("on" + type, fn);
                }
                return this;
            },
            contains: function(descendant) {
                if (!descendant) {
                    return false;
                }
                if (element === descendant) {
                    return true;
                }
                if (element.contains) {
                    return element.contains(descendant);
                } else {
                    return !!(descendant.compareDocumentPosition(element) & 8);
                }
            },
            insertBefore: function(elementB) {
                elementB.parentNode.insertBefore(element, elementB);
                return this;
            },
            remove: function() {
                element.parentNode.removeChild(element);
                return this;
            },
            css: function(styles) {
                if (element.style == null) {
                    throw new qq.Error("Can't apply style to node as it is not on the HTMLElement prototype chain!");
                }
                if (styles.opacity != null) {
                    if (typeof element.style.opacity !== "string" && typeof element.filters !== "undefined") {
                        styles.filter = "alpha(opacity=" + Math.round(100 * styles.opacity) + ")";
                    }
                }
                qq.extend(element.style, styles);
                return this;
            },
            hasClass: function(name, considerParent) {
                var re = new RegExp("(^| )" + name + "( |$)");
                return re.test(element.className) || !!(considerParent && re.test(element.parentNode.className));
            },
            addClass: function(name) {
                if (!qq(element).hasClass(name)) {
                    element.className += " " + name;
                }
                return this;
            },
            removeClass: function(name) {
                var re = new RegExp("(^| )" + name + "( |$)");
                element.className = element.className.replace(re, " ").replace(/^\s+|\s+$/g, "");
                return this;
            },
            getByClass: function(className, first) {
                var candidates, result = [];
                if (first && element.querySelector) {
                    return element.querySelector("." + className);
                } else if (element.querySelectorAll) {
                    return element.querySelectorAll("." + className);
                }
                candidates = element.getElementsByTagName("*");
                qq.each(candidates, function(idx, val) {
                    if (qq(val).hasClass(className)) {
                        result.push(val);
                    }
                });
                return first ? result[0] : result;
            },
            getFirstByClass: function(className) {
                return qq(element).getByClass(className, true);
            },
            children: function() {
                var children = [], child = element.firstChild;
                while (child) {
                    if (child.nodeType === 1) {
                        children.push(child);
                    }
                    child = child.nextSibling;
                }
                return children;
            },
            setText: function(text) {
                element.innerText = text;
                element.textContent = text;
                return this;
            },
            clearText: function() {
                return qq(element).setText("");
            },
            hasAttribute: function(attrName) {
                var attrVal;
                if (element.hasAttribute) {
                    if (!element.hasAttribute(attrName)) {
                        return false;
                    }
                    return /^false$/i.exec(element.getAttribute(attrName)) == null;
                } else {
                    attrVal = element[attrName];
                    if (attrVal === undefined) {
                        return false;
                    }
                    return /^false$/i.exec(attrVal) == null;
                }
            }
        };
    };
    (function() {
        "use strict";
        qq.canvasToBlob = function(canvas, mime, quality) {
            return qq.dataUriToBlob(canvas.toDataURL(mime, quality));
        };
        qq.dataUriToBlob = function(dataUri) {
            var arrayBuffer, byteString, createBlob = function(data, mime) {
                var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder, blobBuilder = BlobBuilder && new BlobBuilder();
                if (blobBuilder) {
                    blobBuilder.append(data);
                    return blobBuilder.getBlob(mime);
                } else {
                    return new Blob([ data ], {
                        type: mime
                    });
                }
            }, intArray, mimeString;
            if (dataUri.split(",")[0].indexOf("base64") >= 0) {
                byteString = atob(dataUri.split(",")[1]);
            } else {
                byteString = decodeURI(dataUri.split(",")[1]);
            }
            mimeString = dataUri.split(",")[0].split(":")[1].split(";")[0];
            arrayBuffer = new ArrayBuffer(byteString.length);
            intArray = new Uint8Array(arrayBuffer);
            qq.each(byteString, function(idx, character) {
                intArray[idx] = character.charCodeAt(0);
            });
            return createBlob(arrayBuffer, mimeString);
        };
        qq.log = function(message, level) {
            if (window.console) {
                if (!level || level === "info") {
                    window.console.log(message);
                } else {
                    if (window.console[level]) {
                        window.console[level](message);
                    } else {
                        window.console.log("<" + level + "> " + message);
                    }
                }
            }
        };
        qq.isObject = function(variable) {
            return variable && !variable.nodeType && Object.prototype.toString.call(variable) === "[object Object]";
        };
        qq.isFunction = function(variable) {
            return typeof variable === "function";
        };
        qq.isArray = function(value) {
            return Object.prototype.toString.call(value) === "[object Array]" || value && window.ArrayBuffer && value.buffer && value.buffer.constructor === ArrayBuffer;
        };
        qq.isItemList = function(maybeItemList) {
            return Object.prototype.toString.call(maybeItemList) === "[object DataTransferItemList]";
        };
        qq.isNodeList = function(maybeNodeList) {
            return Object.prototype.toString.call(maybeNodeList) === "[object NodeList]" || maybeNodeList.item && maybeNodeList.namedItem;
        };
        qq.isString = function(maybeString) {
            return Object.prototype.toString.call(maybeString) === "[object String]";
        };
        qq.trimStr = function(string) {
            if (String.prototype.trim) {
                return string.trim();
            }
            return string.replace(/^\s+|\s+$/g, "");
        };
        qq.format = function(str) {
            var args = Array.prototype.slice.call(arguments, 1), newStr = str, nextIdxToReplace = newStr.indexOf("{}");
            qq.each(args, function(idx, val) {
                var strBefore = newStr.substring(0, nextIdxToReplace), strAfter = newStr.substring(nextIdxToReplace + 2);
                newStr = strBefore + val + strAfter;
                nextIdxToReplace = newStr.indexOf("{}", nextIdxToReplace + val.length);
                if (nextIdxToReplace < 0) {
                    return false;
                }
            });
            return newStr;
        };
        qq.isFile = function(maybeFile) {
            return window.File && Object.prototype.toString.call(maybeFile) === "[object File]";
        };
        qq.isFileList = function(maybeFileList) {
            return window.FileList && Object.prototype.toString.call(maybeFileList) === "[object FileList]";
        };
        qq.isFileOrInput = function(maybeFileOrInput) {
            return qq.isFile(maybeFileOrInput) || qq.isInput(maybeFileOrInput);
        };
        qq.isInput = function(maybeInput, notFile) {
            var evaluateType = function(type) {
                var normalizedType = type.toLowerCase();
                if (notFile) {
                    return normalizedType !== "file";
                }
                return normalizedType === "file";
            };
            if (window.HTMLInputElement) {
                if (Object.prototype.toString.call(maybeInput) === "[object HTMLInputElement]") {
                    if (maybeInput.type && evaluateType(maybeInput.type)) {
                        return true;
                    }
                }
            }
            if (maybeInput.tagName) {
                if (maybeInput.tagName.toLowerCase() === "input") {
                    if (maybeInput.type && evaluateType(maybeInput.type)) {
                        return true;
                    }
                }
            }
            return false;
        };
        qq.isBlob = function(maybeBlob) {
            if (window.Blob && Object.prototype.toString.call(maybeBlob) === "[object Blob]") {
                return true;
            }
        };
        qq.isXhrUploadSupported = function() {
            var input = document.createElement("input");
            input.type = "file";
            return input.multiple !== undefined && typeof File !== "undefined" && typeof FormData !== "undefined" && typeof qq.createXhrInstance().upload !== "undefined";
        };
        qq.createXhrInstance = function() {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }
            try {
                return new ActiveXObject("MSXML2.XMLHTTP.3.0");
            } catch (error) {
                qq.log("Neither XHR or ActiveX are supported!", "error");
                return null;
            }
        };
        qq.isFolderDropSupported = function(dataTransfer) {
            return dataTransfer.items && dataTransfer.items.length > 0 && dataTransfer.items[0].webkitGetAsEntry;
        };
        qq.isFileChunkingSupported = function() {
            return !qq.androidStock() && qq.isXhrUploadSupported() && (File.prototype.slice !== undefined || File.prototype.webkitSlice !== undefined || File.prototype.mozSlice !== undefined);
        };
        qq.sliceBlob = function(fileOrBlob, start, end) {
            var slicer = fileOrBlob.slice || fileOrBlob.mozSlice || fileOrBlob.webkitSlice;
            return slicer.call(fileOrBlob, start, end);
        };
        qq.arrayBufferToHex = function(buffer) {
            var bytesAsHex = "", bytes = new Uint8Array(buffer);
            qq.each(bytes, function(idx, byt) {
                var byteAsHexStr = byt.toString(16);
                if (byteAsHexStr.length < 2) {
                    byteAsHexStr = "0" + byteAsHexStr;
                }
                bytesAsHex += byteAsHexStr;
            });
            return bytesAsHex;
        };
        qq.readBlobToHex = function(blob, startOffset, length) {
            var initialBlob = qq.sliceBlob(blob, startOffset, startOffset + length), fileReader = new FileReader(), promise = new qq.Promise();
            fileReader.onload = function() {
                promise.success(qq.arrayBufferToHex(fileReader.result));
            };
            fileReader.onerror = promise.failure;
            fileReader.readAsArrayBuffer(initialBlob);
            return promise;
        };
        qq.extend = function(first, second, extendNested) {
            qq.each(second, function(prop, val) {
                if (extendNested && qq.isObject(val)) {
                    if (first[prop] === undefined) {
                        first[prop] = {};
                    }
                    qq.extend(first[prop], val, true);
                } else {
                    first[prop] = val;
                }
            });
            return first;
        };
        qq.override = function(target, sourceFn) {
            var super_ = {}, source = sourceFn(super_);
            qq.each(source, function(srcPropName, srcPropVal) {
                if (target[srcPropName] !== undefined) {
                    super_[srcPropName] = target[srcPropName];
                }
                target[srcPropName] = srcPropVal;
            });
            return target;
        };
        qq.indexOf = function(arr, elt, from) {
            if (arr.indexOf) {
                return arr.indexOf(elt, from);
            }
            from = from || 0;
            var len = arr.length;
            if (from < 0) {
                from += len;
            }
            for (;from < len; from += 1) {
                if (arr.hasOwnProperty(from) && arr[from] === elt) {
                    return from;
                }
            }
            return -1;
        };
        qq.getUniqueId = function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
                return v.toString(16);
            });
        };
        qq.ie = function() {
            return navigator.userAgent.indexOf("MSIE") !== -1 || navigator.userAgent.indexOf("Trident") !== -1;
        };
        qq.ie7 = function() {
            return navigator.userAgent.indexOf("MSIE 7") !== -1;
        };
        qq.ie8 = function() {
            return navigator.userAgent.indexOf("MSIE 8") !== -1;
        };
        qq.ie10 = function() {
            return navigator.userAgent.indexOf("MSIE 10") !== -1;
        };
        qq.ie11 = function() {
            return qq.ie() && navigator.userAgent.indexOf("rv:11") !== -1;
        };
        qq.edge = function() {
            return navigator.userAgent.indexOf("Edge") >= 0;
        };
        qq.safari = function() {
            return navigator.vendor !== undefined && navigator.vendor.indexOf("Apple") !== -1;
        };
        qq.chrome = function() {
            return navigator.vendor !== undefined && navigator.vendor.indexOf("Google") !== -1;
        };
        qq.opera = function() {
            return navigator.vendor !== undefined && navigator.vendor.indexOf("Opera") !== -1;
        };
        qq.firefox = function() {
            return !qq.edge() && !qq.ie11() && navigator.userAgent.indexOf("Mozilla") !== -1 && navigator.vendor !== undefined && navigator.vendor === "";
        };
        qq.windows = function() {
            return navigator.platform === "Win32";
        };
        qq.android = function() {
            return navigator.userAgent.toLowerCase().indexOf("android") !== -1;
        };
        qq.androidStock = function() {
            return qq.android() && navigator.userAgent.toLowerCase().indexOf("chrome") < 0;
        };
        qq.ios6 = function() {
            return qq.ios() && navigator.userAgent.indexOf(" OS 6_") !== -1;
        };
        qq.ios7 = function() {
            return qq.ios() && navigator.userAgent.indexOf(" OS 7_") !== -1;
        };
        qq.ios8 = function() {
            return qq.ios() && navigator.userAgent.indexOf(" OS 8_") !== -1;
        };
        qq.ios800 = function() {
            return qq.ios() && navigator.userAgent.indexOf(" OS 8_0 ") !== -1;
        };
        qq.ios = function() {
            return navigator.userAgent.indexOf("iPad") !== -1 || navigator.userAgent.indexOf("iPod") !== -1 || navigator.userAgent.indexOf("iPhone") !== -1;
        };
        qq.iosChrome = function() {
            return qq.ios() && navigator.userAgent.indexOf("CriOS") !== -1;
        };
        qq.iosSafari = function() {
            return qq.ios() && !qq.iosChrome() && navigator.userAgent.indexOf("Safari") !== -1;
        };
        qq.iosSafariWebView = function() {
            return qq.ios() && !qq.iosChrome() && !qq.iosSafari();
        };
        qq.preventDefault = function(e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        };
        qq.toElement = function() {
            var div = document.createElement("div");
            return function(html) {
                div.innerHTML = html;
                var element = div.firstChild;
                div.removeChild(element);
                return element;
            };
        }();
        qq.each = function(iterableItem, callback) {
            var keyOrIndex, retVal;
            if (iterableItem) {
                if (window.Storage && iterableItem.constructor === window.Storage) {
                    for (keyOrIndex = 0; keyOrIndex < iterableItem.length; keyOrIndex++) {
                        retVal = callback(iterableItem.key(keyOrIndex), iterableItem.getItem(iterableItem.key(keyOrIndex)));
                        if (retVal === false) {
                            break;
                        }
                    }
                } else if (qq.isArray(iterableItem) || qq.isItemList(iterableItem) || qq.isNodeList(iterableItem)) {
                    for (keyOrIndex = 0; keyOrIndex < iterableItem.length; keyOrIndex++) {
                        retVal = callback(keyOrIndex, iterableItem[keyOrIndex]);
                        if (retVal === false) {
                            break;
                        }
                    }
                } else if (qq.isString(iterableItem)) {
                    for (keyOrIndex = 0; keyOrIndex < iterableItem.length; keyOrIndex++) {
                        retVal = callback(keyOrIndex, iterableItem.charAt(keyOrIndex));
                        if (retVal === false) {
                            break;
                        }
                    }
                } else {
                    for (keyOrIndex in iterableItem) {
                        if (Object.prototype.hasOwnProperty.call(iterableItem, keyOrIndex)) {
                            retVal = callback(keyOrIndex, iterableItem[keyOrIndex]);
                            if (retVal === false) {
                                break;
                            }
                        }
                    }
                }
            }
        };
        qq.bind = function(oldFunc, context) {
            if (qq.isFunction(oldFunc)) {
                var args = Array.prototype.slice.call(arguments, 2);
                return function() {
                    var newArgs = qq.extend([], args);
                    if (arguments.length) {
                        newArgs = newArgs.concat(Array.prototype.slice.call(arguments));
                    }
                    return oldFunc.apply(context, newArgs);
                };
            }
            throw new Error("first parameter must be a function!");
        };
        qq.obj2url = function(obj, temp, prefixDone) {
            var uristrings = [], prefix = "&", add = function(nextObj, i) {
                var nextTemp = temp ? /\[\]$/.test(temp) ? temp : temp + "[" + i + "]" : i;
                if (nextTemp !== "undefined" && i !== "undefined") {
                    uristrings.push(typeof nextObj === "object" ? qq.obj2url(nextObj, nextTemp, true) : Object.prototype.toString.call(nextObj) === "[object Function]" ? encodeURIComponent(nextTemp) + "=" + encodeURIComponent(nextObj()) : encodeURIComponent(nextTemp) + "=" + encodeURIComponent(nextObj));
                }
            };
            if (!prefixDone && temp) {
                prefix = /\?/.test(temp) ? /\?$/.test(temp) ? "" : "&" : "?";
                uristrings.push(temp);
                uristrings.push(qq.obj2url(obj));
            } else if (Object.prototype.toString.call(obj) === "[object Array]" && typeof obj !== "undefined") {
                qq.each(obj, function(idx, val) {
                    add(val, idx);
                });
            } else if (typeof obj !== "undefined" && obj !== null && typeof obj === "object") {
                qq.each(obj, function(prop, val) {
                    add(val, prop);
                });
            } else {
                uristrings.push(encodeURIComponent(temp) + "=" + encodeURIComponent(obj));
            }
            if (temp) {
                return uristrings.join(prefix);
            } else {
                return uristrings.join(prefix).replace(/^&/, "").replace(/%20/g, "+");
            }
        };
        qq.obj2FormData = function(obj, formData, arrayKeyName) {
            if (!formData) {
                formData = new FormData();
            }
            qq.each(obj, function(key, val) {
                key = arrayKeyName ? arrayKeyName + "[" + key + "]" : key;
                if (qq.isObject(val)) {
                    qq.obj2FormData(val, formData, key);
                } else if (qq.isFunction(val)) {
                    formData.append(key, val());
                } else {
                    formData.append(key, val);
                }
            });
            return formData;
        };
        qq.obj2Inputs = function(obj, form) {
            var input;
            if (!form) {
                form = document.createElement("form");
            }
            qq.obj2FormData(obj, {
                append: function(key, val) {
                    input = document.createElement("input");
                    input.setAttribute("name", key);
                    input.setAttribute("value", val);
                    form.appendChild(input);
                }
            });
            return form;
        };
        qq.parseJson = function(json) {
            if (window.JSON && qq.isFunction(JSON.parse)) {
                return JSON.parse(json);
            } else {
                return eval("(" + json + ")");
            }
        };
        qq.getExtension = function(filename) {
            var extIdx = filename.lastIndexOf(".") + 1;
            if (extIdx > 0) {
                return filename.substr(extIdx, filename.length - extIdx);
            }
        };
        qq.getFilename = function(blobOrFileInput) {
            if (qq.isInput(blobOrFileInput)) {
                return blobOrFileInput.value.replace(/.*(\/|\\)/, "");
            } else if (qq.isFile(blobOrFileInput)) {
                if (blobOrFileInput.fileName !== null && blobOrFileInput.fileName !== undefined) {
                    return blobOrFileInput.fileName;
                }
            }
            return blobOrFileInput.name;
        };
        qq.DisposeSupport = function() {
            var disposers = [];
            return {
                dispose: function() {
                    var disposer;
                    do {
                        disposer = disposers.shift();
                        if (disposer) {
                            disposer();
                        }
                    } while (disposer);
                },
                attach: function() {
                    var args = arguments;
                    this.addDisposer(qq(args[0]).attach.apply(this, Array.prototype.slice.call(arguments, 1)));
                },
                addDisposer: function(disposeFunction) {
                    disposers.push(disposeFunction);
                }
            };
        };
    })();
    (function() {
        "use strict";
        if (typeof define === "function" && define.amd) {
            define(function() {
                return qq;
            });
        } else if (typeof module !== "undefined" && module.exports) {
            module.exports = qq;
        } else {
            global.qq = qq;
        }
    })();
    (function() {
        "use strict";
        qq.Error = function(message) {
            this.message = "[Fine Uploader " + qq.version + "] " + message;
        };
        qq.Error.prototype = new Error();
    })();
    qq.version = "5.14.2";
    qq.supportedFeatures = function() {
        "use strict";
        var supportsUploading, supportsUploadingBlobs, supportsFileDrop, supportsAjaxFileUploading, supportsFolderDrop, supportsChunking, supportsResume, supportsUploadViaPaste, supportsUploadCors, supportsDeleteFileXdr, supportsDeleteFileCorsXhr, supportsDeleteFileCors, supportsFolderSelection, supportsImagePreviews, supportsUploadProgress;
        function testSupportsFileInputElement() {
            var supported = true, tempInput;
            try {
                tempInput = document.createElement("input");
                tempInput.type = "file";
                qq(tempInput).hide();
                if (tempInput.disabled) {
                    supported = false;
                }
            } catch (ex) {
                supported = false;
            }
            return supported;
        }
        function isChrome21OrHigher() {
            return (qq.chrome() || qq.opera()) && navigator.userAgent.match(/Chrome\/[2][1-9]|Chrome\/[3-9][0-9]/) !== undefined;
        }
        function isChrome14OrHigher() {
            return (qq.chrome() || qq.opera()) && navigator.userAgent.match(/Chrome\/[1][4-9]|Chrome\/[2-9][0-9]/) !== undefined;
        }
        function isCrossOriginXhrSupported() {
            if (window.XMLHttpRequest) {
                var xhr = qq.createXhrInstance();
                return xhr.withCredentials !== undefined;
            }
            return false;
        }
        function isXdrSupported() {
            return window.XDomainRequest !== undefined;
        }
        function isCrossOriginAjaxSupported() {
            if (isCrossOriginXhrSupported()) {
                return true;
            }
            return isXdrSupported();
        }
        function isFolderSelectionSupported() {
            return document.createElement("input").webkitdirectory !== undefined;
        }
        function isLocalStorageSupported() {
            try {
                return !!window.localStorage && qq.isFunction(window.localStorage.setItem);
            } catch (error) {
                return false;
            }
        }
        function isDragAndDropSupported() {
            var span = document.createElement("span");
            return ("draggable" in span || "ondragstart" in span && "ondrop" in span) && !qq.android() && !qq.ios();
        }
        supportsUploading = testSupportsFileInputElement();
        supportsAjaxFileUploading = supportsUploading && qq.isXhrUploadSupported();
        supportsUploadingBlobs = supportsAjaxFileUploading && !qq.androidStock();
        supportsFileDrop = supportsAjaxFileUploading && isDragAndDropSupported();
        supportsFolderDrop = supportsFileDrop && isChrome21OrHigher();
        supportsChunking = supportsAjaxFileUploading && qq.isFileChunkingSupported();
        supportsResume = supportsAjaxFileUploading && supportsChunking && isLocalStorageSupported();
        supportsUploadViaPaste = supportsAjaxFileUploading && isChrome14OrHigher();
        supportsUploadCors = supportsUploading && (window.postMessage !== undefined || supportsAjaxFileUploading);
        supportsDeleteFileCorsXhr = isCrossOriginXhrSupported();
        supportsDeleteFileXdr = isXdrSupported();
        supportsDeleteFileCors = isCrossOriginAjaxSupported();
        supportsFolderSelection = isFolderSelectionSupported();
        supportsImagePreviews = supportsAjaxFileUploading && window.FileReader !== undefined;
        supportsUploadProgress = function() {
            if (supportsAjaxFileUploading) {
                return !qq.androidStock() && !qq.iosChrome();
            }
            return false;
        }();
        return {
            ajaxUploading: supportsAjaxFileUploading,
            blobUploading: supportsUploadingBlobs,
            canDetermineSize: supportsAjaxFileUploading,
            chunking: supportsChunking,
            deleteFileCors: supportsDeleteFileCors,
            deleteFileCorsXdr: supportsDeleteFileXdr,
            deleteFileCorsXhr: supportsDeleteFileCorsXhr,
            dialogElement: !!window.HTMLDialogElement,
            fileDrop: supportsFileDrop,
            folderDrop: supportsFolderDrop,
            folderSelection: supportsFolderSelection,
            imagePreviews: supportsImagePreviews,
            imageValidation: supportsImagePreviews,
            itemSizeValidation: supportsAjaxFileUploading,
            pause: supportsChunking,
            progressBar: supportsUploadProgress,
            resume: supportsResume,
            scaling: supportsImagePreviews && supportsUploadingBlobs,
            tiffPreviews: qq.safari(),
            unlimitedScaledImageSize: !qq.ios(),
            uploading: supportsUploading,
            uploadCors: supportsUploadCors,
            uploadCustomHeaders: supportsAjaxFileUploading,
            uploadNonMultipart: supportsAjaxFileUploading,
            uploadViaPaste: supportsUploadViaPaste
        };
    }();
    qq.isGenericPromise = function(maybePromise) {
        "use strict";
        return !!(maybePromise && maybePromise.then && qq.isFunction(maybePromise.then));
    };
    qq.Promise = function() {
        "use strict";
        var successArgs, failureArgs, successCallbacks = [], failureCallbacks = [], doneCallbacks = [], state = 0;
        qq.extend(this, {
            then: function(onSuccess, onFailure) {
                if (state === 0) {
                    if (onSuccess) {
                        successCallbacks.push(onSuccess);
                    }
                    if (onFailure) {
                        failureCallbacks.push(onFailure);
                    }
                } else if (state === -1) {
                    onFailure && onFailure.apply(null, failureArgs);
                } else if (onSuccess) {
                    onSuccess.apply(null, successArgs);
                }
                return this;
            },
            done: function(callback) {
                if (state === 0) {
                    doneCallbacks.push(callback);
                } else {
                    callback.apply(null, failureArgs === undefined ? successArgs : failureArgs);
                }
                return this;
            },
            success: function() {
                state = 1;
                successArgs = arguments;
                if (successCallbacks.length) {
                    qq.each(successCallbacks, function(idx, callback) {
                        callback.apply(null, successArgs);
                    });
                }
                if (doneCallbacks.length) {
                    qq.each(doneCallbacks, function(idx, callback) {
                        callback.apply(null, successArgs);
                    });
                }
                return this;
            },
            failure: function() {
                state = -1;
                failureArgs = arguments;
                if (failureCallbacks.length) {
                    qq.each(failureCallbacks, function(idx, callback) {
                        callback.apply(null, failureArgs);
                    });
                }
                if (doneCallbacks.length) {
                    qq.each(doneCallbacks, function(idx, callback) {
                        callback.apply(null, failureArgs);
                    });
                }
                return this;
            }
        });
    };
    qq.BlobProxy = function(referenceBlob, onCreate) {
        "use strict";
        qq.extend(this, {
            referenceBlob: referenceBlob,
            create: function() {
                return onCreate(referenceBlob);
            }
        });
    };
    qq.UploadButton = function(o) {
        "use strict";
        var self = this, disposeSupport = new qq.DisposeSupport(), options = {
            acceptFiles: null,
            element: null,
            focusClass: "qq-upload-button-focus",
            folders: false,
            hoverClass: "qq-upload-button-hover",
            ios8BrowserCrashWorkaround: false,
            multiple: false,
            name: "qqfile",
            onChange: function(input) {},
            title: null
        }, input, buttonId;
        qq.extend(options, o);
        buttonId = qq.getUniqueId();
        function createInput() {
            var input = document.createElement("input");
            input.setAttribute(qq.UploadButton.BUTTON_ID_ATTR_NAME, buttonId);
            input.setAttribute("title", options.title);
            self.setMultiple(options.multiple, input);
            if (options.folders && qq.supportedFeatures.folderSelection) {
                input.setAttribute("webkitdirectory", "");
            }
            if (options.acceptFiles) {
                input.setAttribute("accept", options.acceptFiles);
            }
            input.setAttribute("type", "file");
            input.setAttribute("name", options.name);
            qq(input).css({
                position: "absolute",
                right: 0,
                top: 0,
                fontFamily: "Arial",
                fontSize: qq.ie() && !qq.ie8() ? "3500px" : "118px",
                margin: 0,
                padding: 0,
                cursor: "pointer",
                opacity: 0
            });
            !qq.ie7() && qq(input).css({
                height: "100%"
            });
            options.element.appendChild(input);
            disposeSupport.attach(input, "change", function() {
                options.onChange(input);
            });
            disposeSupport.attach(input, "mouseover", function() {
                qq(options.element).addClass(options.hoverClass);
            });
            disposeSupport.attach(input, "mouseout", function() {
                qq(options.element).removeClass(options.hoverClass);
            });
            disposeSupport.attach(input, "focus", function() {
                qq(options.element).addClass(options.focusClass);
            });
            disposeSupport.attach(input, "blur", function() {
                qq(options.element).removeClass(options.focusClass);
            });
            return input;
        }
        qq(options.element).css({
            position: "relative",
            overflow: "hidden",
            direction: "ltr"
        });
        qq.extend(this, {
            getInput: function() {
                return input;
            },
            getButtonId: function() {
                return buttonId;
            },
            setMultiple: function(isMultiple, optInput) {
                var input = optInput || this.getInput();
                if (options.ios8BrowserCrashWorkaround && qq.ios8() && (qq.iosChrome() || qq.iosSafariWebView())) {
                    input.setAttribute("multiple", "");
                } else {
                    if (isMultiple) {
                        input.setAttribute("multiple", "");
                    } else {
                        input.removeAttribute("multiple");
                    }
                }
            },
            setAcceptFiles: function(acceptFiles) {
                if (acceptFiles !== options.acceptFiles) {
                    input.setAttribute("accept", acceptFiles);
                }
            },
            reset: function() {
                if (input.parentNode) {
                    qq(input).remove();
                }
                qq(options.element).removeClass(options.focusClass);
                input = null;
                input = createInput();
            }
        });
        input = createInput();
    };
    qq.UploadButton.BUTTON_ID_ATTR_NAME = "qq-button-id";
    qq.UploadData = function(uploaderProxy) {
        "use strict";
        var data = [], byUuid = {}, byStatus = {}, byProxyGroupId = {}, byBatchId = {};
        function getDataByIds(idOrIds) {
            if (qq.isArray(idOrIds)) {
                var entries = [];
                qq.each(idOrIds, function(idx, id) {
                    entries.push(data[id]);
                });
                return entries;
            }
            return data[idOrIds];
        }
        function getDataByUuids(uuids) {
            if (qq.isArray(uuids)) {
                var entries = [];
                qq.each(uuids, function(idx, uuid) {
                    entries.push(data[byUuid[uuid]]);
                });
                return entries;
            }
            return data[byUuid[uuids]];
        }
        function getDataByStatus(status) {
            var statusResults = [], statuses = [].concat(status);
            qq.each(statuses, function(index, statusEnum) {
                var statusResultIndexes = byStatus[statusEnum];
                if (statusResultIndexes !== undefined) {
                    qq.each(statusResultIndexes, function(i, dataIndex) {
                        statusResults.push(data[dataIndex]);
                    });
                }
            });
            return statusResults;
        }
        qq.extend(this, {
            addFile: function(spec) {
                var status = spec.status || qq.status.SUBMITTING, id = data.push({
                    name: spec.name,
                    originalName: spec.name,
                    uuid: spec.uuid,
                    size: spec.size == null ? -1 : spec.size,
                    status: status
                }) - 1;
                if (spec.batchId) {
                    data[id].batchId = spec.batchId;
                    if (byBatchId[spec.batchId] === undefined) {
                        byBatchId[spec.batchId] = [];
                    }
                    byBatchId[spec.batchId].push(id);
                }
                if (spec.proxyGroupId) {
                    data[id].proxyGroupId = spec.proxyGroupId;
                    if (byProxyGroupId[spec.proxyGroupId] === undefined) {
                        byProxyGroupId[spec.proxyGroupId] = [];
                    }
                    byProxyGroupId[spec.proxyGroupId].push(id);
                }
                data[id].id = id;
                byUuid[spec.uuid] = id;
                if (byStatus[status] === undefined) {
                    byStatus[status] = [];
                }
                byStatus[status].push(id);
                spec.onBeforeStatusChange && spec.onBeforeStatusChange(id);
                uploaderProxy.onStatusChange(id, null, status);
                return id;
            },
            retrieve: function(optionalFilter) {
                if (qq.isObject(optionalFilter) && data.length) {
                    if (optionalFilter.id !== undefined) {
                        return getDataByIds(optionalFilter.id);
                    } else if (optionalFilter.uuid !== undefined) {
                        return getDataByUuids(optionalFilter.uuid);
                    } else if (optionalFilter.status) {
                        return getDataByStatus(optionalFilter.status);
                    }
                } else {
                    return qq.extend([], data, true);
                }
            },
            reset: function() {
                data = [];
                byUuid = {};
                byStatus = {};
                byBatchId = {};
            },
            setStatus: function(id, newStatus) {
                var oldStatus = data[id].status, byStatusOldStatusIndex = qq.indexOf(byStatus[oldStatus], id);
                byStatus[oldStatus].splice(byStatusOldStatusIndex, 1);
                data[id].status = newStatus;
                if (byStatus[newStatus] === undefined) {
                    byStatus[newStatus] = [];
                }
                byStatus[newStatus].push(id);
                uploaderProxy.onStatusChange(id, oldStatus, newStatus);
            },
            uuidChanged: function(id, newUuid) {
                var oldUuid = data[id].uuid;
                data[id].uuid = newUuid;
                byUuid[newUuid] = id;
                delete byUuid[oldUuid];
            },
            updateName: function(id, newName) {
                data[id].name = newName;
            },
            updateSize: function(id, newSize) {
                data[id].size = newSize;
            },
            setParentId: function(targetId, parentId) {
                data[targetId].parentId = parentId;
            },
            getIdsInProxyGroup: function(id) {
                var proxyGroupId = data[id].proxyGroupId;
                if (proxyGroupId) {
                    return byProxyGroupId[proxyGroupId];
                }
                return [];
            },
            getIdsInBatch: function(id) {
                var batchId = data[id].batchId;
                return byBatchId[batchId];
            }
        });
    };
    qq.status = {
        SUBMITTING: "submitting",
        SUBMITTED: "submitted",
        REJECTED: "rejected",
        QUEUED: "queued",
        CANCELED: "canceled",
        PAUSED: "paused",
        UPLOADING: "uploading",
        UPLOAD_RETRYING: "retrying upload",
        UPLOAD_SUCCESSFUL: "upload successful",
        UPLOAD_FAILED: "upload failed",
        DELETE_FAILED: "delete failed",
        DELETING: "deleting",
        DELETED: "deleted"
    };
    (function() {
        "use strict";
        qq.basePublicApi = {
            addBlobs: function(blobDataOrArray, params, endpoint) {
                this.addFiles(blobDataOrArray, params, endpoint);
            },
            addInitialFiles: function(cannedFileList) {
                var self = this;
                qq.each(cannedFileList, function(index, cannedFile) {
                    self._addCannedFile(cannedFile);
                });
            },
            addFiles: function(data, params, endpoint) {
                this._maybeHandleIos8SafariWorkaround();
                var batchId = this._storedIds.length === 0 ? qq.getUniqueId() : this._currentBatchId, processBlob = qq.bind(function(blob) {
                    this._handleNewFile({
                        blob: blob,
                        name: this._options.blobs.defaultName
                    }, batchId, verifiedFiles);
                }, this), processBlobData = qq.bind(function(blobData) {
                    this._handleNewFile(blobData, batchId, verifiedFiles);
                }, this), processCanvas = qq.bind(function(canvas) {
                    var blob = qq.canvasToBlob(canvas);
                    this._handleNewFile({
                        blob: blob,
                        name: this._options.blobs.defaultName + ".png"
                    }, batchId, verifiedFiles);
                }, this), processCanvasData = qq.bind(function(canvasData) {
                    var normalizedQuality = canvasData.quality && canvasData.quality / 100, blob = qq.canvasToBlob(canvasData.canvas, canvasData.type, normalizedQuality);
                    this._handleNewFile({
                        blob: blob,
                        name: canvasData.name
                    }, batchId, verifiedFiles);
                }, this), processFileOrInput = qq.bind(function(fileOrInput) {
                    if (qq.isInput(fileOrInput) && qq.supportedFeatures.ajaxUploading) {
                        var files = Array.prototype.slice.call(fileOrInput.files), self = this;
                        qq.each(files, function(idx, file) {
                            self._handleNewFile(file, batchId, verifiedFiles);
                        });
                    } else {
                        this._handleNewFile(fileOrInput, batchId, verifiedFiles);
                    }
                }, this), normalizeData = function() {
                    if (qq.isFileList(data)) {
                        data = Array.prototype.slice.call(data);
                    }
                    data = [].concat(data);
                }, self = this, verifiedFiles = [];
                this._currentBatchId = batchId;
                if (data) {
                    normalizeData();
                    qq.each(data, function(idx, fileContainer) {
                        if (qq.isFileOrInput(fileContainer)) {
                            processFileOrInput(fileContainer);
                        } else if (qq.isBlob(fileContainer)) {
                            processBlob(fileContainer);
                        } else if (qq.isObject(fileContainer)) {
                            if (fileContainer.blob && fileContainer.name) {
                                processBlobData(fileContainer);
                            } else if (fileContainer.canvas && fileContainer.name) {
                                processCanvasData(fileContainer);
                            }
                        } else if (fileContainer.tagName && fileContainer.tagName.toLowerCase() === "canvas") {
                            processCanvas(fileContainer);
                        } else {
                            self.log(fileContainer + " is not a valid file container!  Ignoring!", "warn");
                        }
                    });
                    this.log("Received " + verifiedFiles.length + " files.");
                    this._prepareItemsForUpload(verifiedFiles, params, endpoint);
                }
            },
            cancel: function(id) {
                this._handler.cancel(id);
            },
            cancelAll: function() {
                var storedIdsCopy = [], self = this;
                qq.extend(storedIdsCopy, this._storedIds);
                qq.each(storedIdsCopy, function(idx, storedFileId) {
                    self.cancel(storedFileId);
                });
                this._handler.cancelAll();
            },
            clearStoredFiles: function() {
                this._storedIds = [];
            },
            continueUpload: function(id) {
                var uploadData = this._uploadData.retrieve({
                    id: id
                });
                if (!qq.supportedFeatures.pause || !this._options.chunking.enabled) {
                    return false;
                }
                if (uploadData.status === qq.status.PAUSED) {
                    this.log(qq.format("Paused file ID {} ({}) will be continued.  Not paused.", id, this.getName(id)));
                    this._uploadFile(id);
                    return true;
                } else {
                    this.log(qq.format("Ignoring continue for file ID {} ({}).  Not paused.", id, this.getName(id)), "error");
                }
                return false;
            },
            deleteFile: function(id) {
                return this._onSubmitDelete(id);
            },
            doesExist: function(fileOrBlobId) {
                return this._handler.isValid(fileOrBlobId);
            },
            drawThumbnail: function(fileId, imgOrCanvas, maxSize, fromServer, customResizeFunction) {
                var promiseToReturn = new qq.Promise(), fileOrUrl, options;
                if (this._imageGenerator) {
                    fileOrUrl = this._thumbnailUrls[fileId];
                    options = {
                        customResizeFunction: customResizeFunction,
                        maxSize: maxSize > 0 ? maxSize : null,
                        scale: maxSize > 0
                    };
                    if (!fromServer && qq.supportedFeatures.imagePreviews) {
                        fileOrUrl = this.getFile(fileId);
                    }
                    if (fileOrUrl == null) {
                        promiseToReturn.failure({
                            container: imgOrCanvas,
                            error: "File or URL not found."
                        });
                    } else {
                        this._imageGenerator.generate(fileOrUrl, imgOrCanvas, options).then(function success(modifiedContainer) {
                            promiseToReturn.success(modifiedContainer);
                        }, function failure(container, reason) {
                            promiseToReturn.failure({
                                container: container,
                                error: reason || "Problem generating thumbnail"
                            });
                        });
                    }
                } else {
                    promiseToReturn.failure({
                        container: imgOrCanvas,
                        error: "Missing image generator module"
                    });
                }
                return promiseToReturn;
            },
            getButton: function(fileId) {
                return this._getButton(this._buttonIdsForFileIds[fileId]);
            },
            getEndpoint: function(fileId) {
                return this._endpointStore.get(fileId);
            },
            getFile: function(fileOrBlobId) {
                return this._handler.getFile(fileOrBlobId) || null;
            },
            getInProgress: function() {
                return this._uploadData.retrieve({
                    status: [ qq.status.UPLOADING, qq.status.UPLOAD_RETRYING, qq.status.QUEUED ]
                }).length;
            },
            getName: function(id) {
                return this._uploadData.retrieve({
                    id: id
                }).name;
            },
            getParentId: function(id) {
                var uploadDataEntry = this.getUploads({
                    id: id
                }), parentId = null;
                if (uploadDataEntry) {
                    if (uploadDataEntry.parentId !== undefined) {
                        parentId = uploadDataEntry.parentId;
                    }
                }
                return parentId;
            },
            getResumableFilesData: function() {
                return this._handler.getResumableFilesData();
            },
            getSize: function(id) {
                return this._uploadData.retrieve({
                    id: id
                }).size;
            },
            getNetUploads: function() {
                return this._netUploaded;
            },
            getRemainingAllowedItems: function() {
                var allowedItems = this._currentItemLimit;
                if (allowedItems > 0) {
                    return allowedItems - this._netUploadedOrQueued;
                }
                return null;
            },
            getUploads: function(optionalFilter) {
                return this._uploadData.retrieve(optionalFilter);
            },
            getUuid: function(id) {
                return this._uploadData.retrieve({
                    id: id
                }).uuid;
            },
            log: function(str, level) {
                if (this._options.debug && (!level || level === "info")) {
                    qq.log("[Fine Uploader " + qq.version + "] " + str);
                } else if (level && level !== "info") {
                    qq.log("[Fine Uploader " + qq.version + "] " + str, level);
                }
            },
            pauseUpload: function(id) {
                var uploadData = this._uploadData.retrieve({
                    id: id
                });
                if (!qq.supportedFeatures.pause || !this._options.chunking.enabled) {
                    return false;
                }
                if (qq.indexOf([ qq.status.UPLOADING, qq.status.UPLOAD_RETRYING ], uploadData.status) >= 0) {
                    if (this._handler.pause(id)) {
                        this._uploadData.setStatus(id, qq.status.PAUSED);
                        return true;
                    } else {
                        this.log(qq.format("Unable to pause file ID {} ({}).", id, this.getName(id)), "error");
                    }
                } else {
                    this.log(qq.format("Ignoring pause for file ID {} ({}).  Not in progress.", id, this.getName(id)), "error");
                }
                return false;
            },
            removeFileRef: function(id) {
                this._handler.expunge(id);
            },
            reset: function() {
                this.log("Resetting uploader...");
                this._handler.reset();
                this._storedIds = [];
                this._autoRetries = [];
                this._retryTimeouts = [];
                this._preventRetries = [];
                this._thumbnailUrls = [];
                qq.each(this._buttons, function(idx, button) {
                    button.reset();
                });
                this._paramsStore.reset();
                this._endpointStore.reset();
                this._netUploadedOrQueued = 0;
                this._netUploaded = 0;
                this._uploadData.reset();
                this._buttonIdsForFileIds = [];
                this._pasteHandler && this._pasteHandler.reset();
                this._options.session.refreshOnReset && this._refreshSessionData();
                this._succeededSinceLastAllComplete = [];
                this._failedSinceLastAllComplete = [];
                this._totalProgress && this._totalProgress.reset();
            },
            retry: function(id) {
                return this._manualRetry(id);
            },
            scaleImage: function(id, specs) {
                var self = this;
                return qq.Scaler.prototype.scaleImage(id, specs, {
                    log: qq.bind(self.log, self),
                    getFile: qq.bind(self.getFile, self),
                    uploadData: self._uploadData
                });
            },
            setCustomHeaders: function(headers, id) {
                this._customHeadersStore.set(headers, id);
            },
            setDeleteFileCustomHeaders: function(headers, id) {
                this._deleteFileCustomHeadersStore.set(headers, id);
            },
            setDeleteFileEndpoint: function(endpoint, id) {
                this._deleteFileEndpointStore.set(endpoint, id);
            },
            setDeleteFileParams: function(params, id) {
                this._deleteFileParamsStore.set(params, id);
            },
            setEndpoint: function(endpoint, id) {
                this._endpointStore.set(endpoint, id);
            },
            setForm: function(elementOrId) {
                this._updateFormSupportAndParams(elementOrId);
            },
            setItemLimit: function(newItemLimit) {
                this._currentItemLimit = newItemLimit;
            },
            setName: function(id, newName) {
                this._uploadData.updateName(id, newName);
            },
            setParams: function(params, id) {
                this._paramsStore.set(params, id);
            },
            setUuid: function(id, newUuid) {
                return this._uploadData.uuidChanged(id, newUuid);
            },
            setStatus: function(id, newStatus) {
                var fileRecord = this.getUploads({
                    id: id
                });
                if (!fileRecord) {
                    throw new qq.Error(id + " is not a valid file ID.");
                }
                switch (newStatus) {
                  case qq.status.DELETED:
                    this._onDeleteComplete(id, null, false);
                    break;

                  case qq.status.DELETE_FAILED:
                    this._onDeleteComplete(id, null, true);
                    break;

                  default:
                    var errorMessage = "Method setStatus called on '" + name + "' not implemented yet for " + newStatus;
                    this.log(errorMessage);
                    throw new qq.Error(errorMessage);
                }
            },
            uploadStoredFiles: function() {
                if (this._storedIds.length === 0) {
                    this._itemError("noFilesError");
                } else {
                    this._uploadStoredFiles();
                }
            }
        };
        qq.basePrivateApi = {
            _addCannedFile: function(sessionData) {
                var self = this;
                return this._uploadData.addFile({
                    uuid: sessionData.uuid,
                    name: sessionData.name,
                    size: sessionData.size,
                    status: qq.status.UPLOAD_SUCCESSFUL,
                    onBeforeStatusChange: function(id) {
                        sessionData.deleteFileEndpoint && self.setDeleteFileEndpoint(sessionData.deleteFileEndpoint, id);
                        sessionData.deleteFileParams && self.setDeleteFileParams(sessionData.deleteFileParams, id);
                        if (sessionData.thumbnailUrl) {
                            self._thumbnailUrls[id] = sessionData.thumbnailUrl;
                        }
                        self._netUploaded++;
                        self._netUploadedOrQueued++;
                    }
                });
            },
            _annotateWithButtonId: function(file, associatedInput) {
                if (qq.isFile(file)) {
                    file.qqButtonId = this._getButtonId(associatedInput);
                }
            },
            _batchError: function(message) {
                this._options.callbacks.onError(null, null, message, undefined);
            },
            _createDeleteHandler: function() {
                var self = this;
                return new qq.DeleteFileAjaxRequester({
                    method: this._options.deleteFile.method.toUpperCase(),
                    maxConnections: this._options.maxConnections,
                    uuidParamName: this._options.request.uuidName,
                    customHeaders: this._deleteFileCustomHeadersStore,
                    paramsStore: this._deleteFileParamsStore,
                    endpointStore: this._deleteFileEndpointStore,
                    cors: this._options.cors,
                    log: qq.bind(self.log, self),
                    onDelete: function(id) {
                        self._onDelete(id);
                        self._options.callbacks.onDelete(id);
                    },
                    onDeleteComplete: function(id, xhrOrXdr, isError) {
                        self._onDeleteComplete(id, xhrOrXdr, isError);
                        self._options.callbacks.onDeleteComplete(id, xhrOrXdr, isError);
                    }
                });
            },
            _createPasteHandler: function() {
                var self = this;
                return new qq.PasteSupport({
                    targetElement: this._options.paste.targetElement,
                    callbacks: {
                        log: qq.bind(self.log, self),
                        pasteReceived: function(blob) {
                            self._handleCheckedCallback({
                                name: "onPasteReceived",
                                callback: qq.bind(self._options.callbacks.onPasteReceived, self, blob),
                                onSuccess: qq.bind(self._handlePasteSuccess, self, blob),
                                identifier: "pasted image"
                            });
                        }
                    }
                });
            },
            _createStore: function(initialValue, _readOnlyValues_) {
                var store = {}, catchall = initialValue, perIdReadOnlyValues = {}, readOnlyValues = _readOnlyValues_, copy = function(orig) {
                    if (qq.isObject(orig)) {
                        return qq.extend({}, orig);
                    }
                    return orig;
                }, getReadOnlyValues = function() {
                    if (qq.isFunction(readOnlyValues)) {
                        return readOnlyValues();
                    }
                    return readOnlyValues;
                }, includeReadOnlyValues = function(id, existing) {
                    if (readOnlyValues && qq.isObject(existing)) {
                        qq.extend(existing, getReadOnlyValues());
                    }
                    if (perIdReadOnlyValues[id]) {
                        qq.extend(existing, perIdReadOnlyValues[id]);
                    }
                };
                return {
                    set: function(val, id) {
                        if (id == null) {
                            store = {};
                            catchall = copy(val);
                        } else {
                            store[id] = copy(val);
                        }
                    },
                    get: function(id) {
                        var values;
                        if (id != null && store[id]) {
                            values = store[id];
                        } else {
                            values = copy(catchall);
                        }
                        includeReadOnlyValues(id, values);
                        return copy(values);
                    },
                    addReadOnly: function(id, values) {
                        if (qq.isObject(store)) {
                            if (id === null) {
                                if (qq.isFunction(values)) {
                                    readOnlyValues = values;
                                } else {
                                    readOnlyValues = readOnlyValues || {};
                                    qq.extend(readOnlyValues, values);
                                }
                            } else {
                                perIdReadOnlyValues[id] = perIdReadOnlyValues[id] || {};
                                qq.extend(perIdReadOnlyValues[id], values);
                            }
                        }
                    },
                    remove: function(fileId) {
                        return delete store[fileId];
                    },
                    reset: function() {
                        store = {};
                        perIdReadOnlyValues = {};
                        catchall = initialValue;
                    }
                };
            },
            _createUploadDataTracker: function() {
                var self = this;
                return new qq.UploadData({
                    getName: function(id) {
                        return self.getName(id);
                    },
                    getUuid: function(id) {
                        return self.getUuid(id);
                    },
                    getSize: function(id) {
                        return self.getSize(id);
                    },
                    onStatusChange: function(id, oldStatus, newStatus) {
                        self._onUploadStatusChange(id, oldStatus, newStatus);
                        self._options.callbacks.onStatusChange(id, oldStatus, newStatus);
                        self._maybeAllComplete(id, newStatus);
                        if (self._totalProgress) {
                            setTimeout(function() {
                                self._totalProgress.onStatusChange(id, oldStatus, newStatus);
                            }, 0);
                        }
                    }
                });
            },
            _createUploadButton: function(spec) {
                var self = this, acceptFiles = spec.accept || this._options.validation.acceptFiles, allowedExtensions = spec.allowedExtensions || this._options.validation.allowedExtensions, button;
                function allowMultiple() {
                    if (qq.supportedFeatures.ajaxUploading) {
                        if (self._options.workarounds.iosEmptyVideos && qq.ios() && !qq.ios6() && self._isAllowedExtension(allowedExtensions, ".mov")) {
                            return false;
                        }
                        if (spec.multiple === undefined) {
                            return self._options.multiple;
                        }
                        return spec.multiple;
                    }
                    return false;
                }
                button = new qq.UploadButton({
                    acceptFiles: acceptFiles,
                    element: spec.element,
                    focusClass: this._options.classes.buttonFocus,
                    folders: spec.folders,
                    hoverClass: this._options.classes.buttonHover,
                    ios8BrowserCrashWorkaround: this._options.workarounds.ios8BrowserCrash,
                    multiple: allowMultiple(),
                    name: this._options.request.inputName,
                    onChange: function(input) {
                        self._onInputChange(input);
                    },
                    title: spec.title == null ? this._options.text.fileInputTitle : spec.title
                });
                this._disposeSupport.addDisposer(function() {
                    button.dispose();
                });
                self._buttons.push(button);
                return button;
            },
            _createUploadHandler: function(additionalOptions, namespace) {
                var self = this, lastOnProgress = {}, options = {
                    debug: this._options.debug,
                    maxConnections: this._options.maxConnections,
                    cors: this._options.cors,
                    paramsStore: this._paramsStore,
                    endpointStore: this._endpointStore,
                    chunking: this._options.chunking,
                    resume: this._options.resume,
                    blobs: this._options.blobs,
                    log: qq.bind(self.log, self),
                    preventRetryParam: this._options.retry.preventRetryResponseProperty,
                    onProgress: function(id, name, loaded, total) {
                        if (loaded < 0 || total < 0) {
                            return;
                        }
                        if (lastOnProgress[id]) {
                            if (lastOnProgress[id].loaded !== loaded || lastOnProgress[id].total !== total) {
                                self._onProgress(id, name, loaded, total);
                                self._options.callbacks.onProgress(id, name, loaded, total);
                            }
                        } else {
                            self._onProgress(id, name, loaded, total);
                            self._options.callbacks.onProgress(id, name, loaded, total);
                        }
                        lastOnProgress[id] = {
                            loaded: loaded,
                            total: total
                        };
                    },
                    onComplete: function(id, name, result, xhr) {
                        delete lastOnProgress[id];
                        var status = self.getUploads({
                            id: id
                        }).status, retVal;
                        if (status === qq.status.UPLOAD_SUCCESSFUL || status === qq.status.UPLOAD_FAILED) {
                            return;
                        }
                        retVal = self._onComplete(id, name, result, xhr);
                        if (retVal instanceof qq.Promise) {
                            retVal.done(function() {
                                self._options.callbacks.onComplete(id, name, result, xhr);
                            });
                        } else {
                            self._options.callbacks.onComplete(id, name, result, xhr);
                        }
                    },
                    onCancel: function(id, name, cancelFinalizationEffort) {
                        var promise = new qq.Promise();
                        self._handleCheckedCallback({
                            name: "onCancel",
                            callback: qq.bind(self._options.callbacks.onCancel, self, id, name),
                            onFailure: promise.failure,
                            onSuccess: function() {
                                cancelFinalizationEffort.then(function() {
                                    self._onCancel(id, name);
                                });
                                promise.success();
                            },
                            identifier: id
                        });
                        return promise;
                    },
                    onUploadPrep: qq.bind(this._onUploadPrep, this),
                    onUpload: function(id, name) {
                        self._onUpload(id, name);
                        self._options.callbacks.onUpload(id, name);
                    },
                    onUploadChunk: function(id, name, chunkData) {
                        self._onUploadChunk(id, chunkData);
                        self._options.callbacks.onUploadChunk(id, name, chunkData);
                    },
                    onUploadChunkSuccess: function(id, chunkData, result, xhr) {
                        self._options.callbacks.onUploadChunkSuccess.apply(self, arguments);
                    },
                    onResume: function(id, name, chunkData) {
                        return self._options.callbacks.onResume(id, name, chunkData);
                    },
                    onAutoRetry: function(id, name, responseJSON, xhr) {
                        return self._onAutoRetry.apply(self, arguments);
                    },
                    onUuidChanged: function(id, newUuid) {
                        self.log("Server requested UUID change from '" + self.getUuid(id) + "' to '" + newUuid + "'");
                        self.setUuid(id, newUuid);
                    },
                    getName: qq.bind(self.getName, self),
                    getUuid: qq.bind(self.getUuid, self),
                    getSize: qq.bind(self.getSize, self),
                    setSize: qq.bind(self._setSize, self),
                    getDataByUuid: function(uuid) {
                        return self.getUploads({
                            uuid: uuid
                        });
                    },
                    isQueued: function(id) {
                        var status = self.getUploads({
                            id: id
                        }).status;
                        return status === qq.status.QUEUED || status === qq.status.SUBMITTED || status === qq.status.UPLOAD_RETRYING || status === qq.status.PAUSED;
                    },
                    getIdsInProxyGroup: self._uploadData.getIdsInProxyGroup,
                    getIdsInBatch: self._uploadData.getIdsInBatch
                };
                qq.each(this._options.request, function(prop, val) {
                    options[prop] = val;
                });
                options.customHeaders = this._customHeadersStore;
                if (additionalOptions) {
                    qq.each(additionalOptions, function(key, val) {
                        options[key] = val;
                    });
                }
                return new qq.UploadHandlerController(options, namespace);
            },
            _fileOrBlobRejected: function(id) {
                this._netUploadedOrQueued--;
                this._uploadData.setStatus(id, qq.status.REJECTED);
            },
            _formatSize: function(bytes) {
                if (bytes === 0) {
                    return bytes + this._options.text.sizeSymbols[0];
                }
                var i = -1;
                do {
                    bytes = bytes / 1e3;
                    i++;
                } while (bytes > 999);
                return Math.max(bytes, .1).toFixed(1) + this._options.text.sizeSymbols[i];
            },
            _generateExtraButtonSpecs: function() {
                var self = this;
                this._extraButtonSpecs = {};
                qq.each(this._options.extraButtons, function(idx, extraButtonOptionEntry) {
                    var multiple = extraButtonOptionEntry.multiple, validation = qq.extend({}, self._options.validation, true), extraButtonSpec = qq.extend({}, extraButtonOptionEntry);
                    if (multiple === undefined) {
                        multiple = self._options.multiple;
                    }
                    if (extraButtonSpec.validation) {
                        qq.extend(validation, extraButtonOptionEntry.validation, true);
                    }
                    qq.extend(extraButtonSpec, {
                        multiple: multiple,
                        validation: validation
                    }, true);
                    self._initExtraButton(extraButtonSpec);
                });
            },
            _getButton: function(buttonId) {
                var extraButtonsSpec = this._extraButtonSpecs[buttonId];
                if (extraButtonsSpec) {
                    return extraButtonsSpec.element;
                } else if (buttonId === this._defaultButtonId) {
                    return this._options.button;
                }
            },
            _getButtonId: function(buttonOrFileInputOrFile) {
                var inputs, fileInput, fileBlobOrInput = buttonOrFileInputOrFile;
                if (fileBlobOrInput instanceof qq.BlobProxy) {
                    fileBlobOrInput = fileBlobOrInput.referenceBlob;
                }
                if (fileBlobOrInput && !qq.isBlob(fileBlobOrInput)) {
                    if (qq.isFile(fileBlobOrInput)) {
                        return fileBlobOrInput.qqButtonId;
                    } else if (fileBlobOrInput.tagName.toLowerCase() === "input" && fileBlobOrInput.type.toLowerCase() === "file") {
                        return fileBlobOrInput.getAttribute(qq.UploadButton.BUTTON_ID_ATTR_NAME);
                    }
                    inputs = fileBlobOrInput.getElementsByTagName("input");
                    qq.each(inputs, function(idx, input) {
                        if (input.getAttribute("type") === "file") {
                            fileInput = input;
                            return false;
                        }
                    });
                    if (fileInput) {
                        return fileInput.getAttribute(qq.UploadButton.BUTTON_ID_ATTR_NAME);
                    }
                }
            },
            _getNotFinished: function() {
                return this._uploadData.retrieve({
                    status: [ qq.status.UPLOADING, qq.status.UPLOAD_RETRYING, qq.status.QUEUED, qq.status.SUBMITTING, qq.status.SUBMITTED, qq.status.PAUSED ]
                }).length;
            },
            _getValidationBase: function(buttonId) {
                var extraButtonSpec = this._extraButtonSpecs[buttonId];
                return extraButtonSpec ? extraButtonSpec.validation : this._options.validation;
            },
            _getValidationDescriptor: function(fileWrapper) {
                if (fileWrapper.file instanceof qq.BlobProxy) {
                    return {
                        name: qq.getFilename(fileWrapper.file.referenceBlob),
                        size: fileWrapper.file.referenceBlob.size
                    };
                }
                return {
                    name: this.getUploads({
                        id: fileWrapper.id
                    }).name,
                    size: this.getUploads({
                        id: fileWrapper.id
                    }).size
                };
            },
            _getValidationDescriptors: function(fileWrappers) {
                var self = this, fileDescriptors = [];
                qq.each(fileWrappers, function(idx, fileWrapper) {
                    fileDescriptors.push(self._getValidationDescriptor(fileWrapper));
                });
                return fileDescriptors;
            },
            _handleCameraAccess: function() {
                if (this._options.camera.ios && qq.ios()) {
                    var acceptIosCamera = "image/*;capture=camera", button = this._options.camera.button, buttonId = button ? this._getButtonId(button) : this._defaultButtonId, optionRoot = this._options;
                    if (buttonId && buttonId !== this._defaultButtonId) {
                        optionRoot = this._extraButtonSpecs[buttonId];
                    }
                    optionRoot.multiple = false;
                    if (optionRoot.validation.acceptFiles === null) {
                        optionRoot.validation.acceptFiles = acceptIosCamera;
                    } else {
                        optionRoot.validation.acceptFiles += "," + acceptIosCamera;
                    }
                    qq.each(this._buttons, function(idx, button) {
                        if (button.getButtonId() === buttonId) {
                            button.setMultiple(optionRoot.multiple);
                            button.setAcceptFiles(optionRoot.acceptFiles);
                            return false;
                        }
                    });
                }
            },
            _handleCheckedCallback: function(details) {
                var self = this, callbackRetVal = details.callback();
                if (qq.isGenericPromise(callbackRetVal)) {
                    this.log(details.name + " - waiting for " + details.name + " promise to be fulfilled for " + details.identifier);
                    return callbackRetVal.then(function(successParam) {
                        self.log(details.name + " promise success for " + details.identifier);
                        details.onSuccess(successParam);
                    }, function() {
                        if (details.onFailure) {
                            self.log(details.name + " promise failure for " + details.identifier);
                            details.onFailure();
                        } else {
                            self.log(details.name + " promise failure for " + details.identifier);
                        }
                    });
                }
                if (callbackRetVal !== false) {
                    details.onSuccess(callbackRetVal);
                } else {
                    if (details.onFailure) {
                        this.log(details.name + " - return value was 'false' for " + details.identifier + ".  Invoking failure callback.");
                        details.onFailure();
                    } else {
                        this.log(details.name + " - return value was 'false' for " + details.identifier + ".  Will not proceed.");
                    }
                }
                return callbackRetVal;
            },
            _handleNewFile: function(file, batchId, newFileWrapperList) {
                var self = this, uuid = qq.getUniqueId(), size = -1, name = qq.getFilename(file), actualFile = file.blob || file, handler = this._customNewFileHandler ? this._customNewFileHandler : qq.bind(self._handleNewFileGeneric, self);
                if (!qq.isInput(actualFile) && actualFile.size >= 0) {
                    size = actualFile.size;
                }
                handler(actualFile, name, uuid, size, newFileWrapperList, batchId, this._options.request.uuidName, {
                    uploadData: self._uploadData,
                    paramsStore: self._paramsStore,
                    addFileToHandler: function(id, file) {
                        self._handler.add(id, file);
                        self._netUploadedOrQueued++;
                        self._trackButton(id);
                    }
                });
            },
            _handleNewFileGeneric: function(file, name, uuid, size, fileList, batchId) {
                var id = this._uploadData.addFile({
                    uuid: uuid,
                    name: name,
                    size: size,
                    batchId: batchId
                });
                this._handler.add(id, file);
                this._trackButton(id);
                this._netUploadedOrQueued++;
                fileList.push({
                    id: id,
                    file: file
                });
            },
            _handlePasteSuccess: function(blob, extSuppliedName) {
                var extension = blob.type.split("/")[1], name = extSuppliedName;
                if (name == null) {
                    name = this._options.paste.defaultName;
                }
                name += "." + extension;
                this.addFiles({
                    name: name,
                    blob: blob
                });
            },
            _handleDeleteSuccess: function(id) {
                if (this.getUploads({
                    id: id
                }).status !== qq.status.DELETED) {
                    var name = this.getName(id);
                    this._netUploadedOrQueued--;
                    this._netUploaded--;
                    this._handler.expunge(id);
                    this._uploadData.setStatus(id, qq.status.DELETED);
                    this.log("Delete request for '" + name + "' has succeeded.");
                }
            },
            _handleDeleteFailed: function(id, xhrOrXdr) {
                var name = this.getName(id);
                this._uploadData.setStatus(id, qq.status.DELETE_FAILED);
                this.log("Delete request for '" + name + "' has failed.", "error");
                if (!xhrOrXdr || xhrOrXdr.withCredentials === undefined) {
                    this._options.callbacks.onError(id, name, "Delete request failed", xhrOrXdr);
                } else {
                    this._options.callbacks.onError(id, name, "Delete request failed with response code " + xhrOrXdr.status, xhrOrXdr);
                }
            },
            _initExtraButton: function(spec) {
                var button = this._createUploadButton({
                    accept: spec.validation.acceptFiles,
                    allowedExtensions: spec.validation.allowedExtensions,
                    element: spec.element,
                    folders: spec.folders,
                    multiple: spec.multiple,
                    title: spec.fileInputTitle
                });
                this._extraButtonSpecs[button.getButtonId()] = spec;
            },
            _initFormSupportAndParams: function() {
                this._formSupport = qq.FormSupport && new qq.FormSupport(this._options.form, qq.bind(this.uploadStoredFiles, this), qq.bind(this.log, this));
                if (this._formSupport && this._formSupport.attachedToForm) {
                    this._paramsStore = this._createStore(this._options.request.params, this._formSupport.getFormInputsAsObject);
                    this._options.autoUpload = this._formSupport.newAutoUpload;
                    if (this._formSupport.newEndpoint) {
                        this._options.request.endpoint = this._formSupport.newEndpoint;
                    }
                } else {
                    this._paramsStore = this._createStore(this._options.request.params);
                }
            },
            _isDeletePossible: function() {
                if (!qq.DeleteFileAjaxRequester || !this._options.deleteFile.enabled) {
                    return false;
                }
                if (this._options.cors.expected) {
                    if (qq.supportedFeatures.deleteFileCorsXhr) {
                        return true;
                    }
                    if (qq.supportedFeatures.deleteFileCorsXdr && this._options.cors.allowXdr) {
                        return true;
                    }
                    return false;
                }
                return true;
            },
            _isAllowedExtension: function(allowed, fileName) {
                var valid = false;
                if (!allowed.length) {
                    return true;
                }
                qq.each(allowed, function(idx, allowedExt) {
                    if (qq.isString(allowedExt)) {
                        var extRegex = new RegExp("\\." + allowedExt + "$", "i");
                        if (fileName.match(extRegex) != null) {
                            valid = true;
                            return false;
                        }
                    }
                });
                return valid;
            },
            _itemError: function(code, maybeNameOrNames, item) {
                var message = this._options.messages[code], allowedExtensions = [], names = [].concat(maybeNameOrNames), name = names[0], buttonId = this._getButtonId(item), validationBase = this._getValidationBase(buttonId), extensionsForMessage, placeholderMatch;
                function r(name, replacement) {
                    message = message.replace(name, replacement);
                }
                qq.each(validationBase.allowedExtensions, function(idx, allowedExtension) {
                    if (qq.isString(allowedExtension)) {
                        allowedExtensions.push(allowedExtension);
                    }
                });
                extensionsForMessage = allowedExtensions.join(", ").toLowerCase();
                r("{file}", this._options.formatFileName(name));
                r("{extensions}", extensionsForMessage);
                r("{sizeLimit}", this._formatSize(validationBase.sizeLimit));
                r("{minSizeLimit}", this._formatSize(validationBase.minSizeLimit));
                placeholderMatch = message.match(/(\{\w+\})/g);
                if (placeholderMatch !== null) {
                    qq.each(placeholderMatch, function(idx, placeholder) {
                        r(placeholder, names[idx]);
                    });
                }
                this._options.callbacks.onError(null, name, message, undefined);
                return message;
            },
            _manualRetry: function(id, callback) {
                if (this._onBeforeManualRetry(id)) {
                    this._netUploadedOrQueued++;
                    this._uploadData.setStatus(id, qq.status.UPLOAD_RETRYING);
                    if (callback) {
                        callback(id);
                    } else {
                        this._handler.retry(id);
                    }
                    return true;
                }
            },
            _maybeAllComplete: function(id, status) {
                var self = this, notFinished = this._getNotFinished();
                if (status === qq.status.UPLOAD_SUCCESSFUL) {
                    this._succeededSinceLastAllComplete.push(id);
                } else if (status === qq.status.UPLOAD_FAILED) {
                    this._failedSinceLastAllComplete.push(id);
                }
                if (notFinished === 0 && (this._succeededSinceLastAllComplete.length || this._failedSinceLastAllComplete.length)) {
                    setTimeout(function() {
                        self._onAllComplete(self._succeededSinceLastAllComplete, self._failedSinceLastAllComplete);
                    }, 0);
                }
            },
            _maybeHandleIos8SafariWorkaround: function() {
                var self = this;
                if (this._options.workarounds.ios8SafariUploads && qq.ios800() && qq.iosSafari()) {
                    setTimeout(function() {
                        window.alert(self._options.messages.unsupportedBrowserIos8Safari);
                    }, 0);
                    throw new qq.Error(this._options.messages.unsupportedBrowserIos8Safari);
                }
            },
            _maybeParseAndSendUploadError: function(id, name, response, xhr) {
                if (!response.success) {
                    if (xhr && xhr.status !== 200 && !response.error) {
                        this._options.callbacks.onError(id, name, "XHR returned response code " + xhr.status, xhr);
                    } else {
                        var errorReason = response.error ? response.error : this._options.text.defaultResponseError;
                        this._options.callbacks.onError(id, name, errorReason, xhr);
                    }
                }
            },
            _maybeProcessNextItemAfterOnValidateCallback: function(validItem, items, index, params, endpoint) {
                var self = this;
                if (items.length > index) {
                    if (validItem || !this._options.validation.stopOnFirstInvalidFile) {
                        setTimeout(function() {
                            var validationDescriptor = self._getValidationDescriptor(items[index]), buttonId = self._getButtonId(items[index].file), button = self._getButton(buttonId);
                            self._handleCheckedCallback({
                                name: "onValidate",
                                callback: qq.bind(self._options.callbacks.onValidate, self, validationDescriptor, button),
                                onSuccess: qq.bind(self._onValidateCallbackSuccess, self, items, index, params, endpoint),
                                onFailure: qq.bind(self._onValidateCallbackFailure, self, items, index, params, endpoint),
                                identifier: "Item '" + validationDescriptor.name + "', size: " + validationDescriptor.size
                            });
                        }, 0);
                    } else if (!validItem) {
                        for (;index < items.length; index++) {
                            self._fileOrBlobRejected(items[index].id);
                        }
                    }
                }
            },
            _onAllComplete: function(successful, failed) {
                this._totalProgress && this._totalProgress.onAllComplete(successful, failed, this._preventRetries);
                this._options.callbacks.onAllComplete(qq.extend([], successful), qq.extend([], failed));
                this._succeededSinceLastAllComplete = [];
                this._failedSinceLastAllComplete = [];
            },
            _onAutoRetry: function(id, name, responseJSON, xhr, callback) {
                var self = this;
                self._preventRetries[id] = responseJSON[self._options.retry.preventRetryResponseProperty];
                if (self._shouldAutoRetry(id, name, responseJSON)) {
                    var retryWaitPeriod = self._options.retry.autoAttemptDelay * 1e3;
                    self._maybeParseAndSendUploadError.apply(self, arguments);
                    self._options.callbacks.onAutoRetry(id, name, self._autoRetries[id]);
                    self._onBeforeAutoRetry(id, name);
                    self._uploadData.setStatus(id, qq.status.UPLOAD_RETRYING);
                    self._retryTimeouts[id] = setTimeout(function() {
                        self.log("Starting retry for " + name + "...");
                        if (callback) {
                            callback(id);
                        } else {
                            self._handler.retry(id);
                        }
                    }, retryWaitPeriod);
                    return true;
                }
            },
            _onBeforeAutoRetry: function(id, name) {
                this.log("Waiting " + this._options.retry.autoAttemptDelay + " seconds before retrying " + name + "...");
            },
            _onBeforeManualRetry: function(id) {
                var itemLimit = this._currentItemLimit, fileName;
                if (this._preventRetries[id]) {
                    this.log("Retries are forbidden for id " + id, "warn");
                    return false;
                } else if (this._handler.isValid(id)) {
                    fileName = this.getName(id);
                    if (this._options.callbacks.onManualRetry(id, fileName) === false) {
                        return false;
                    }
                    if (itemLimit > 0 && this._netUploadedOrQueued + 1 > itemLimit) {
                        this._itemError("retryFailTooManyItems");
                        return false;
                    }
                    this.log("Retrying upload for '" + fileName + "' (id: " + id + ")...");
                    return true;
                } else {
                    this.log("'" + id + "' is not a valid file ID", "error");
                    return false;
                }
            },
            _onCancel: function(id, name) {
                this._netUploadedOrQueued--;
                clearTimeout(this._retryTimeouts[id]);
                var storedItemIndex = qq.indexOf(this._storedIds, id);
                if (!this._options.autoUpload && storedItemIndex >= 0) {
                    this._storedIds.splice(storedItemIndex, 1);
                }
                this._uploadData.setStatus(id, qq.status.CANCELED);
            },
            _onComplete: function(id, name, result, xhr) {
                if (!result.success) {
                    this._netUploadedOrQueued--;
                    this._uploadData.setStatus(id, qq.status.UPLOAD_FAILED);
                    if (result[this._options.retry.preventRetryResponseProperty] === true) {
                        this._preventRetries[id] = true;
                    }
                } else {
                    if (result.thumbnailUrl) {
                        this._thumbnailUrls[id] = result.thumbnailUrl;
                    }
                    this._netUploaded++;
                    this._uploadData.setStatus(id, qq.status.UPLOAD_SUCCESSFUL);
                }
                this._maybeParseAndSendUploadError(id, name, result, xhr);
                return result.success ? true : false;
            },
            _onDelete: function(id) {
                this._uploadData.setStatus(id, qq.status.DELETING);
            },
            _onDeleteComplete: function(id, xhrOrXdr, isError) {
                var name = this.getName(id);
                if (isError) {
                    this._handleDeleteFailed(id, xhrOrXdr);
                } else {
                    this._handleDeleteSuccess(id);
                }
            },
            _onInputChange: function(input) {
                var fileIndex;
                if (qq.supportedFeatures.ajaxUploading) {
                    for (fileIndex = 0; fileIndex < input.files.length; fileIndex++) {
                        this._annotateWithButtonId(input.files[fileIndex], input);
                    }
                    this.addFiles(input.files);
                } else if (input.value.length > 0) {
                    this.addFiles(input);
                }
                qq.each(this._buttons, function(idx, button) {
                    button.reset();
                });
            },
            _onProgress: function(id, name, loaded, total) {
                this._totalProgress && this._totalProgress.onIndividualProgress(id, loaded, total);
            },
            _onSubmit: function(id, name) {},
            _onSubmitCallbackSuccess: function(id, name) {
                this._onSubmit.apply(this, arguments);
                this._uploadData.setStatus(id, qq.status.SUBMITTED);
                this._onSubmitted.apply(this, arguments);
                if (this._options.autoUpload) {
                    this._options.callbacks.onSubmitted.apply(this, arguments);
                    this._uploadFile(id);
                } else {
                    this._storeForLater(id);
                    this._options.callbacks.onSubmitted.apply(this, arguments);
                }
            },
            _onSubmitDelete: function(id, onSuccessCallback, additionalMandatedParams) {
                var uuid = this.getUuid(id), adjustedOnSuccessCallback;
                if (onSuccessCallback) {
                    adjustedOnSuccessCallback = qq.bind(onSuccessCallback, this, id, uuid, additionalMandatedParams);
                }
                if (this._isDeletePossible()) {
                    this._handleCheckedCallback({
                        name: "onSubmitDelete",
                        callback: qq.bind(this._options.callbacks.onSubmitDelete, this, id),
                        onSuccess: adjustedOnSuccessCallback || qq.bind(this._deleteHandler.sendDelete, this, id, uuid, additionalMandatedParams),
                        identifier: id
                    });
                    return true;
                } else {
                    this.log("Delete request ignored for ID " + id + ", delete feature is disabled or request not possible " + "due to CORS on a user agent that does not support pre-flighting.", "warn");
                    return false;
                }
            },
            _onSubmitted: function(id) {},
            _onTotalProgress: function(loaded, total) {
                this._options.callbacks.onTotalProgress(loaded, total);
            },
            _onUploadPrep: function(id) {},
            _onUpload: function(id, name) {
                this._uploadData.setStatus(id, qq.status.UPLOADING);
            },
            _onUploadChunk: function(id, chunkData) {},
            _onUploadStatusChange: function(id, oldStatus, newStatus) {
                if (newStatus === qq.status.PAUSED) {
                    clearTimeout(this._retryTimeouts[id]);
                }
            },
            _onValidateBatchCallbackFailure: function(fileWrappers) {
                var self = this;
                qq.each(fileWrappers, function(idx, fileWrapper) {
                    self._fileOrBlobRejected(fileWrapper.id);
                });
            },
            _onValidateBatchCallbackSuccess: function(validationDescriptors, items, params, endpoint, button) {
                var errorMessage, itemLimit = this._currentItemLimit, proposedNetFilesUploadedOrQueued = this._netUploadedOrQueued;
                if (itemLimit === 0 || proposedNetFilesUploadedOrQueued <= itemLimit) {
                    if (items.length > 0) {
                        this._handleCheckedCallback({
                            name: "onValidate",
                            callback: qq.bind(this._options.callbacks.onValidate, this, validationDescriptors[0], button),
                            onSuccess: qq.bind(this._onValidateCallbackSuccess, this, items, 0, params, endpoint),
                            onFailure: qq.bind(this._onValidateCallbackFailure, this, items, 0, params, endpoint),
                            identifier: "Item '" + items[0].file.name + "', size: " + items[0].file.size
                        });
                    } else {
                        this._itemError("noFilesError");
                    }
                } else {
                    this._onValidateBatchCallbackFailure(items);
                    errorMessage = this._options.messages.tooManyItemsError.replace(/\{netItems\}/g, proposedNetFilesUploadedOrQueued).replace(/\{itemLimit\}/g, itemLimit);
                    this._batchError(errorMessage);
                }
            },
            _onValidateCallbackFailure: function(items, index, params, endpoint) {
                var nextIndex = index + 1;
                this._fileOrBlobRejected(items[index].id, items[index].file.name);
                this._maybeProcessNextItemAfterOnValidateCallback(false, items, nextIndex, params, endpoint);
            },
            _onValidateCallbackSuccess: function(items, index, params, endpoint) {
                var self = this, nextIndex = index + 1, validationDescriptor = this._getValidationDescriptor(items[index]);
                this._validateFileOrBlobData(items[index], validationDescriptor).then(function() {
                    self._upload(items[index].id, params, endpoint);
                    self._maybeProcessNextItemAfterOnValidateCallback(true, items, nextIndex, params, endpoint);
                }, function() {
                    self._maybeProcessNextItemAfterOnValidateCallback(false, items, nextIndex, params, endpoint);
                });
            },
            _prepareItemsForUpload: function(items, params, endpoint) {
                if (items.length === 0) {
                    this._itemError("noFilesError");
                    return;
                }
                var validationDescriptors = this._getValidationDescriptors(items), buttonId = this._getButtonId(items[0].file), button = this._getButton(buttonId);
                this._handleCheckedCallback({
                    name: "onValidateBatch",
                    callback: qq.bind(this._options.callbacks.onValidateBatch, this, validationDescriptors, button),
                    onSuccess: qq.bind(this._onValidateBatchCallbackSuccess, this, validationDescriptors, items, params, endpoint, button),
                    onFailure: qq.bind(this._onValidateBatchCallbackFailure, this, items),
                    identifier: "batch validation"
                });
            },
            _preventLeaveInProgress: function() {
                var self = this;
                this._disposeSupport.attach(window, "beforeunload", function(e) {
                    if (self.getInProgress()) {
                        e = e || window.event;
                        e.returnValue = self._options.messages.onLeave;
                        return self._options.messages.onLeave;
                    }
                });
            },
            _refreshSessionData: function() {
                var self = this, options = this._options.session;
                if (qq.Session && this._options.session.endpoint != null) {
                    if (!this._session) {
                        qq.extend(options, {
                            cors: this._options.cors
                        });
                        options.log = qq.bind(this.log, this);
                        options.addFileRecord = qq.bind(this._addCannedFile, this);
                        this._session = new qq.Session(options);
                    }
                    setTimeout(function() {
                        self._session.refresh().then(function(response, xhrOrXdr) {
                            self._sessionRequestComplete();
                            self._options.callbacks.onSessionRequestComplete(response, true, xhrOrXdr);
                        }, function(response, xhrOrXdr) {
                            self._options.callbacks.onSessionRequestComplete(response, false, xhrOrXdr);
                        });
                    }, 0);
                }
            },
            _sessionRequestComplete: function() {},
            _setSize: function(id, newSize) {
                this._uploadData.updateSize(id, newSize);
                this._totalProgress && this._totalProgress.onNewSize(id);
            },
            _shouldAutoRetry: function(id, name, responseJSON) {
                var uploadData = this._uploadData.retrieve({
                    id: id
                });
                if (!this._preventRetries[id] && this._options.retry.enableAuto && uploadData.status !== qq.status.PAUSED) {
                    if (this._autoRetries[id] === undefined) {
                        this._autoRetries[id] = 0;
                    }
                    if (this._autoRetries[id] < this._options.retry.maxAutoAttempts) {
                        this._autoRetries[id] += 1;
                        return true;
                    }
                }
                return false;
            },
            _storeForLater: function(id) {
                this._storedIds.push(id);
            },
            _trackButton: function(id) {
                var buttonId;
                if (qq.supportedFeatures.ajaxUploading) {
                    buttonId = this._handler.getFile(id).qqButtonId;
                } else {
                    buttonId = this._getButtonId(this._handler.getInput(id));
                }
                if (buttonId) {
                    this._buttonIdsForFileIds[id] = buttonId;
                }
            },
            _updateFormSupportAndParams: function(formElementOrId) {
                this._options.form.element = formElementOrId;
                this._formSupport = qq.FormSupport && new qq.FormSupport(this._options.form, qq.bind(this.uploadStoredFiles, this), qq.bind(this.log, this));
                if (this._formSupport && this._formSupport.attachedToForm) {
                    this._paramsStore.addReadOnly(null, this._formSupport.getFormInputsAsObject);
                    this._options.autoUpload = this._formSupport.newAutoUpload;
                    if (this._formSupport.newEndpoint) {
                        this.setEndpoint(this._formSupport.newEndpoint);
                    }
                }
            },
            _upload: function(id, params, endpoint) {
                var name = this.getName(id);
                if (params) {
                    this.setParams(params, id);
                }
                if (endpoint) {
                    this.setEndpoint(endpoint, id);
                }
                this._handleCheckedCallback({
                    name: "onSubmit",
                    callback: qq.bind(this._options.callbacks.onSubmit, this, id, name),
                    onSuccess: qq.bind(this._onSubmitCallbackSuccess, this, id, name),
                    onFailure: qq.bind(this._fileOrBlobRejected, this, id, name),
                    identifier: id
                });
            },
            _uploadFile: function(id) {
                if (!this._handler.upload(id)) {
                    this._uploadData.setStatus(id, qq.status.QUEUED);
                }
            },
            _uploadStoredFiles: function() {
                var idToUpload, stillSubmitting, self = this;
                while (this._storedIds.length) {
                    idToUpload = this._storedIds.shift();
                    this._uploadFile(idToUpload);
                }
                stillSubmitting = this.getUploads({
                    status: qq.status.SUBMITTING
                }).length;
                if (stillSubmitting) {
                    qq.log("Still waiting for " + stillSubmitting + " files to clear submit queue. Will re-parse stored IDs array shortly.");
                    setTimeout(function() {
                        self._uploadStoredFiles();
                    }, 1e3);
                }
            },
            _validateFileOrBlobData: function(fileWrapper, validationDescriptor) {
                var self = this, file = function() {
                    if (fileWrapper.file instanceof qq.BlobProxy) {
                        return fileWrapper.file.referenceBlob;
                    }
                    return fileWrapper.file;
                }(), name = validationDescriptor.name, size = validationDescriptor.size, buttonId = this._getButtonId(fileWrapper.file), validationBase = this._getValidationBase(buttonId), validityChecker = new qq.Promise();
                validityChecker.then(function() {}, function() {
                    self._fileOrBlobRejected(fileWrapper.id, name);
                });
                if (qq.isFileOrInput(file) && !this._isAllowedExtension(validationBase.allowedExtensions, name)) {
                    this._itemError("typeError", name, file);
                    return validityChecker.failure();
                }
                if (!this._options.validation.allowEmpty && size === 0) {
                    this._itemError("emptyError", name, file);
                    return validityChecker.failure();
                }
                if (size > 0 && validationBase.sizeLimit && size > validationBase.sizeLimit) {
                    this._itemError("sizeError", name, file);
                    return validityChecker.failure();
                }
                if (size > 0 && size < validationBase.minSizeLimit) {
                    this._itemError("minSizeError", name, file);
                    return validityChecker.failure();
                }
                if (qq.ImageValidation && qq.supportedFeatures.imagePreviews && qq.isFile(file)) {
                    new qq.ImageValidation(file, qq.bind(self.log, self)).validate(validationBase.image).then(validityChecker.success, function(errorCode) {
                        self._itemError(errorCode + "ImageError", name, file);
                        validityChecker.failure();
                    });
                } else {
                    validityChecker.success();
                }
                return validityChecker;
            },
            _wrapCallbacks: function() {
                var self, safeCallback, prop;
                self = this;
                safeCallback = function(name, callback, args) {
                    var errorMsg;
                    try {
                        return callback.apply(self, args);
                    } catch (exception) {
                        errorMsg = exception.message || exception.toString();
                        self.log("Caught exception in '" + name + "' callback - " + errorMsg, "error");
                    }
                };
                for (prop in this._options.callbacks) {
                    (function() {
                        var callbackName, callbackFunc;
                        callbackName = prop;
                        callbackFunc = self._options.callbacks[callbackName];
                        self._options.callbacks[callbackName] = function() {
                            return safeCallback(callbackName, callbackFunc, arguments);
                        };
                    })();
                }
            }
        };
    })();
    (function() {
        "use strict";
        qq.FineUploaderBasic = function(o) {
            var self = this;
            this._options = {
                debug: false,
                button: null,
                multiple: true,
                maxConnections: 3,
                disableCancelForFormUploads: false,
                autoUpload: true,
                request: {
                    customHeaders: {},
                    endpoint: "/server/upload",
                    filenameParam: "qqfilename",
                    forceMultipart: true,
                    inputName: "qqfile",
                    method: "POST",
                    params: {},
                    paramsInBody: true,
                    totalFileSizeName: "qqtotalfilesize",
                    uuidName: "qquuid"
                },
                validation: {
                    allowedExtensions: [],
                    sizeLimit: 0,
                    minSizeLimit: 0,
                    itemLimit: 0,
                    stopOnFirstInvalidFile: true,
                    acceptFiles: null,
                    image: {
                        maxHeight: 0,
                        maxWidth: 0,
                        minHeight: 0,
                        minWidth: 0
                    },
                    allowEmpty: false
                },
                callbacks: {
                    onSubmit: function(id, name) {},
                    onSubmitted: function(id, name) {},
                    onComplete: function(id, name, responseJSON, maybeXhr) {},
                    onAllComplete: function(successful, failed) {},
                    onCancel: function(id, name) {},
                    onUpload: function(id, name) {},
                    onUploadChunk: function(id, name, chunkData) {},
                    onUploadChunkSuccess: function(id, chunkData, responseJSON, xhr) {},
                    onResume: function(id, fileName, chunkData) {},
                    onProgress: function(id, name, loaded, total) {},
                    onTotalProgress: function(loaded, total) {},
                    onError: function(id, name, reason, maybeXhrOrXdr) {},
                    onAutoRetry: function(id, name, attemptNumber) {},
                    onManualRetry: function(id, name) {},
                    onValidateBatch: function(fileOrBlobData) {},
                    onValidate: function(fileOrBlobData) {},
                    onSubmitDelete: function(id) {},
                    onDelete: function(id) {},
                    onDeleteComplete: function(id, xhrOrXdr, isError) {},
                    onPasteReceived: function(blob) {},
                    onStatusChange: function(id, oldStatus, newStatus) {},
                    onSessionRequestComplete: function(response, success, xhrOrXdr) {}
                },
                messages: {
                    typeError: "{file} has an invalid extension. Valid extension(s): {extensions}.",
                    sizeError: "{file} is too large, maximum file size is {sizeLimit}.",
                    minSizeError: "{file} is too small, minimum file size is {minSizeLimit}.",
                    emptyError: "{file} is empty, please select files again without it.",
                    noFilesError: "No files to upload.",
                    tooManyItemsError: "Too many items ({netItems}) would be uploaded.  Item limit is {itemLimit}.",
                    maxHeightImageError: "Image is too tall.",
                    maxWidthImageError: "Image is too wide.",
                    minHeightImageError: "Image is not tall enough.",
                    minWidthImageError: "Image is not wide enough.",
                    retryFailTooManyItems: "Retry failed - you have reached your file limit.",
                    onLeave: "The files are being uploaded, if you leave now the upload will be canceled.",
                    unsupportedBrowserIos8Safari: "Unrecoverable error - this browser does not permit file uploading of any kind due to serious bugs in iOS8 Safari.  Please use iOS8 Chrome until Apple fixes these issues."
                },
                retry: {
                    enableAuto: false,
                    maxAutoAttempts: 3,
                    autoAttemptDelay: 5,
                    preventRetryResponseProperty: "preventRetry"
                },
                classes: {
                    buttonHover: "qq-upload-button-hover",
                    buttonFocus: "qq-upload-button-focus"
                },
                chunking: {
                    enabled: false,
                    concurrent: {
                        enabled: false
                    },
                    mandatory: false,
                    paramNames: {
                        partIndex: "qqpartindex",
                        partByteOffset: "qqpartbyteoffset",
                        chunkSize: "qqchunksize",
                        totalFileSize: "qqtotalfilesize",
                        totalParts: "qqtotalparts"
                    },
                    partSize: 2e6,
                    success: {
                        endpoint: null
                    }
                },
                resume: {
                    enabled: false,
                    recordsExpireIn: 7,
                    paramNames: {
                        resuming: "qqresume"
                    }
                },
                formatFileName: function(fileOrBlobName) {
                    return fileOrBlobName;
                },
                text: {
                    defaultResponseError: "Upload failure reason unknown",
                    fileInputTitle: "file input",
                    sizeSymbols: [ "kB", "MB", "GB", "TB", "PB", "EB" ]
                },
                deleteFile: {
                    enabled: false,
                    method: "