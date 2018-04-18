// ==UserScript==
// @name         Spoiler GTM Post
// @namespace    http://tampermonkey.net/
// @version      0.54
// @description  Don't spoil Nier >:(
// @author       You
// @match        https://forum.gamestm.co.uk/posting.php?*
// @grant        none
// @license CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @author          Kyle Murphy
// @downloadURL https://github.com/murphyky/gtmspoiler/raw/master/gtmspoiler.user.js
// @updateURL https://github.com/murphyky/gtmspoiler/raw/master/gtmspoiler.user.js


// ==/UserScript==

(function() {
    'use strict';

    var postingHeader = document.getElementById("postingbox");
    postingHeader = postingHeader.getElementsByTagName("h3");
    postingHeader = postingHeader[0];
        
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
    optionOne.value = 'AUTO';
    optionOne.text = "Auto";


    var optionTwo = document.createElement("option");
    optionTwo.value = '#DCDFE4';
    optionTwo.text = "Grey";

    var textElement = document.getElementById("message");

    var optionThree = document.createElement("option");
    optionThree.value = '#F5F7FA';
    optionThree.text = "White";

    var optionFour = document.createElement("option");
    optionFour.value = '#EAE9DC';
    optionFour.text = "Yellow (for quoted posts)";
    spoilerBlockColourInput.appendChild(optionOne);
    spoilerBlockColourInput.appendChild(optionTwo);
    spoilerBlockColourInput.appendChild(optionThree);
    spoilerBlockColourInput.appendChild(optionFour);


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

        if (navigator.userAgent.indexOf("Chrome") !== -1){ 
            if (window.getSelection) {
                text = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
                text = document.selection.createRange().text;
            }
        } else {
            var start = textElement.selectionStart;
            var finish = textElement.selectionEnd;
            text = textElement.value.substring(start, finish);
        }
        return text;
    }

    function displayProgress() {

    }

    function spoiler(e) {
        e.preventDefault();

        function applySpoilerFilter() {
            var o = document.getElementById("message");
            var spoilerText = getSelectionText();

            if (spoilerText) {
                console.log("Spoilerify this text :", spoilerText);
                if (o.value.indexOf(spoilerText) > -1) {
                    o.value = slice(o.value, (o.value.indexOf(spoilerText)), 0, ("🤐[color=" + hideText) + "]");
                    o.value = slice(o.value, (o.value.indexOf(spoilerText) + spoilerText.length), 0, '[/color]🤐');
                }
            }            
        }

        if (spoilerBlockColourInput.value === "AUTO") {

            postingHeader.innerText = "Fetching correct spoiler colour, may take a few seconds......";

            //infer the hideText value from the current page count automatically
            getResource(getLastPage(), function(res) {
                getLastPagePostCount(res);
                applySpoilerFilter();

                postingHeader.innerText = "Updated Post!!!!";
                setTimeout(function(){
                    postingHeader.innerText = "Post a reply";
                }, 2000);
            });
        } else {
            applySpoilerFilter();
        }
    }

    function getResource(res, cb) {
        var xobj = new XMLHttpRequest();
        xobj.open("GET", res, true);
        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                var result = xobj.responseText; 
                cb(result);
            }            
        };
        xobj.send(null);
    }

    function getLastPage() {
        var postLinks = document.getElementsByClassName("author");
        var lastPost = postLinks[0];
        var lastPostLink = lastPost.getElementsByTagName("a");
        if (lastPostLink)
            lastPostLink = lastPostLink[0];
        return lastPostLink.href;
    }

    //enhancement
    //count the posts on the last post page
    //parse HTML DOC
    function getLastPagePostCount(lastPageHTML) {

        var posts = lastPageHTML.match(/(postbody)/g);
        var count = posts.length || 0;
        //if even
        if (((count % 2) === 0) || count === 15) {
            hideText = "#DCDFE4";
        } else {
            hideText = "#F5F7FA";
        }
    }

})();