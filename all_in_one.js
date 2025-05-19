// ==UserScript==
// @name         Limitless Browser: No Popups & Restrictions
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  破解所有网站的切屏检测，解除复制限制，并禁止打开新窗口但允许新标签页
// @author       share121 & Cangshi
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457563/%E7%A0%B4%E8%A7%A3%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/457563/%E7%A0%B4%E8%A7%A3%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

// 破解切屏检测部分
["visibilitychange", "blur", "focus", "focusin", "focusout"].forEach((e) => {
  window.addEventListener(
    e,
    (e) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    true
  );
});
document.hasFocus = () => true;
Object.defineProperty(document, "hidden", {
  get() {
    return false;
  },
});

// 解除复制限制部分
function removeCopyEvent() {
    Array.prototype.concat.call(document.querySelectorAll('*'), document)
        .forEach(function (ele) {
            ele.oncopy = undefined;
            ele.oncontextmenu = undefined;
        });
}

'use strict';
~function (global) {
    function generate() {
        return function () {

            global.addEventListener('contextmenu', function (e) {
                removeCopyEvent();
            });

            global.addEventListener('keydown', function (e) {
                if (e.ctrlKey || e.keyCode === 224 || e.keyCode === 17 || e.keyCode === 91 || e.keyCode === 93) {
                    removeCopyEvent();
                }
            });

            this.hookBefore(EventTarget.prototype, 'addEventListener',
                function (m, args) {
                    if (args[0] === 'copy' || args[0] === 'contextmenu') {
                        args[0] = 'prevent ' + args[0] + ' handler';
                        console.log('[AllowCopy Plugins]', args[0]);
                    }
                }, false);

            var style = 'body * :not(input):not(textarea){-webkit-user-select:auto!important;-moz-user-select:auto!important;-ms-user-select:auto!important;user-select:auto!important}';

            var stylenode = document.createElement('style');

            stylenode.setAttribute("type", "text/css");
            if (stylenode.styleSheet) {// IE
                stylenode.styleSheet.cssText = style;
            } else {// w3c
                var cssText = document.createTextNode(style);
                stylenode.appendChild(cssText);
            }

            document.addEventListener('readystatechange', function () {
                if (document.readyState === "interactive" || document.readyState === "complete") {
                    setTimeout(function () {
                        document.head.appendChild(stylenode);
                        console.log('[AllowCopy Plugins] css applied')
                    }, 2000);
                }
            });

            console.log('[AllowCopy Plugins]', 'works.');
        }
    }

    // 阻止打开新窗口，只允许打开新的标签页
    const originalOpen = window.open;
    window.open = function(url, target, features) {
        if (target !== "_blank") {
            target = "_blank";  // 强制将 target 设置为 _blank，确保在新标签页中打开
        }
        return originalOpen.call(window, url, target, features);
    };

    if (global.eHook) {
        global.eHook.plugins({
            name: 'allowCopy',
            mount: generate()
        });
    }
}(window);
