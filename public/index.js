"use strict";
//function declarations
var makeEl = function (element, tag) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var el = document.createElement(tag);
    var txt = document.createTextNode(element || "");
    el.appendChild(txt);
    if (children) {
        children.map(function (x) { return el.innerHTML += x; });
    }
    return el;
};
var isOdd = function (num) { return num % 2; };
var inlineFormat = function (_a) {
    var txt = _a.txt, char = _a.char, replStart = _a.replStart, rplEnd = _a.rplEnd, index = _a.index, wrapper = _a.wrapper;
    var format = txt.split(char);
    format.map(function (x, i) {
        if (isOdd(i) > 0) {
            format[i] = "" + replStart + x + rplEnd;
        }
    });
    wrapper[index].innerHTML = format.join(" ");
    return format.join(" ");
};
var parseMd = function (string) {
    //  declaring variables
    var el = string;
    var lines = [];
    var formattedFull = [];
    var isList = false;
    var listIndex = 0;
    // extract explicit line breaks
    el.split('\n').map(function (x) { return lines.push(x); });
    // check for headers
    lines.map(function (x, i) {
        switch (x.slice(0, (x.indexOf(' ') + 1))) {
            case ">\ ":
            case "-\ ":
                if (isList) {
                    var listItem = "<li>" + x.slice(2, x.length) + "</li>";
                    formattedFull[listIndex].append(listItem);
                }
                else {
                    isList = true;
                    listIndex = i;
                    var listItem = "<li>" + x.slice(2, x.length) + "</li>";
                    var newList = makeEl(listItem, 'ul');
                    formattedFull.push(newList);
                }
                break;
            case "0. ":
            case "1. ":
            case "2. ":
            case "3. ":
            case "4. ":
            case "5. ":
            case "6. ":
            case "7. ":
            case "8. ":
            case "9. ":
                if (isList) {
                    var listItem = "<li>" + x.slice(2, x.length) + "</li>";
                    formattedFull[listIndex - 1].append(listItem);
                }
                else {
                    isList = true;
                    listIndex = i;
                    var listItem = "<li>" + x.slice(2, x.length) + "</li>";
                    var newList = makeEl(listItem, 'ol');
                    formattedFull.push(newList);
                }
                break;
            case "#\ ":
                formattedFull.push(makeEl(x.replace('#\ ', ""), 'h1'));
                break;
            case "##\ ":
                formattedFull.push(makeEl(x.replace('##\ ', ""), 'h2'));
                break;
            case "###\ ":
                formattedFull.push(makeEl(x.replace('###\ ', ""), 'h3'));
                break;
            case "####\ ":
                formattedFull.push(makeEl(x.replace('####\ ', ""), 'h4'));
                break;
            case "#####\ ":
                formattedFull.push(makeEl(x.replace('#####\ ', ""), 'h5'));
                break;
            case "######\ ":
                formattedFull.push(makeEl(x.replace('######\ ', ""), 'h6'));
                break;
            default:
                isList = false;
                formattedFull.push(makeEl(x, 'p'));
                break;
        }
    });
    formattedFull.map(function (x, i) {
        // target and format italic
        var str = x.textContent || "";
        str = inlineFormat({
            txt: str,
            char: "~~",
            replStart: "<i>",
            rplEnd: "</i>",
            index: i,
            wrapper: formattedFull
        });
        // target and format bold
        str = inlineFormat({
            txt: str,
            char: "**",
            replStart: "<strong>",
            rplEnd: "</strong>",
            index: i,
            wrapper: formattedFull
        });
        // target and format underline
        str = inlineFormat({
            txt: str,
            char: "__",
            replStart: "<u>",
            rplEnd: "</u>",
            index: i,
            wrapper: formattedFull
        });
    });
    return formattedFull;
};
var testTexty = "\n# Linux ~~commands~~\n\n## __Os bootable ~~install~~ usb__\n**__sudo__ dd** if=manjaro-openbox-18.0.2-2018520-stable-x86_64.iso of=/dev/rdisk3 bs=1m\n## Erase a __disk__ from console\ndiskutil **eraseDisk** JHFS+ Emptied /**dev**/disk6s2\n##### Os bootable install usb\nsudo dd if=__manjaro-openbox__-18.0.2-2018520-stable-x86_64.iso of=/dev/rdisk3 bs=1m\n###### Erase a ~~disk~~ from console\ndiskutil eraseDisk ~~JHFS+~~ Emptied /dev/disk6s2\n> test list\n> list 2\n. third test\n- fourth test\nnot a list anymore\n1. new ordered list element\n1. fuck\n2. yeah\n";
var parsedText = parseMd(testTexty);
parsedText.map(function (x) { return document.body.append(x); });
