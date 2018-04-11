// ==UserScript==
// @name         Spoiler GTM Post
// @namespace    http://tampermonkey.net/
// @version      0.43
// @description  Don't spoil Nier >:(
// @author       You
// @match        https://forum.gamestm.co.uk/posting.php?*
// @grant        none
// @license CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @author          Kyle Murphy

// ==/UserScript==

(function() {
    'use strict';
        
    var elem = document.createElement('input');
    elem.id = "spoilerButton";
    elem.className = "button1";
    elem.onclick = spoiler;
    elem.value = "Spoiler";
    elem.type = "submit";

    var spoilerBlockColourInput = document.createElement('select');
    spoilerBlockColourInput.id = "spoilerSelect";
    spoilerBlockColourInput.style["margin-left"] = "10px";
    var optionOne = document.createElement("option");
    optionOne.value = '#DCDFE4';
    optionOne.text = "Grey";

    var textElement = document.getElementById("message");

    var optionTwo = document.createElement("option");
    optionTwo.value = '#F5F7FA';
    optionTwo.text = "White";
    spoilerBlockColourInput.appendChild(optionOne);
    spoilerBlockColourInput.appendChild(optionTwo);

    var buttonElements = document.getElementsByClassName("submit-buttons");
    buttonElements = buttonElements[0];
    buttonElements.appendChild(elem);
    buttonElements.appendChild(spoilerBlockColourInput);

    var hideText = optionOne.value;

    spoilerBlockColourInput.onchange = function(v) {
        var selectedOption = this[this.selectedIndex];
        hideText = selectedOption.value;
    };

    function slice(str, start, delCount, newSubStr) {
        return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount));
    }

    function getSelectionText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }

    function spoiler(e) {
        e.preventDefault();
        var o = document.getElementById("message");
        var spoilerText = getSelectionText();

        if (spoilerText) {
            console.log("Spoilerfy this text :", spoilerText);
            if (o.value.indexOf(spoilerText) > -1) {
                o.value = slice(o.value, (o.value.indexOf(spoilerText)), 0, ("[color=" + hideText) + "]");
                o.value = slice(o.value, (o.value.indexOf(spoilerText) + spoilerText.length), 0, '[/color]');
            }

        } else {

            if (o.value.indexOf("[SPOILER]") > -1) {
                o.value = slice(o.value, (o.value.indexOf("[SPOILER]") + "[SPOILER]".length), 0, "[color=#DCDFE4]");
                o.value = slice(o.value, o.value.indexOf("[/SPOILER]"), 0, "[/color]");
            }

        }
    }
    // Your code here...
})();