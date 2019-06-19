"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash');
var JSSoup = require('jssoup').default;
var coutArray = require('count-array-values');
var validate = require('input-validate');
var prepositions_1 = require("./prepositions");
var rules_1 = require("./rules");
var excluded_1 = require("./excluded");
var loader_1 = require("./loader");
var rawHtmlText = '';
function parseHtml(htmlBody, cb) {
    var soup = new JSSoup(htmlBody);
    // itterate all JSSoup elements array to find interesting tags
    soup.findAll().forEach(function (el) {
        // filters tags with no interest check excluded list at top
        var tag = _.find(excluded_1.default, function (tagName) {
            if (tagName === el.name) {
                return el;
            }
        });
        // concatinating all text in one place
        if (!tag && el.string !== undefined) {
            rawHtmlText += el.text + ' ';
        }
    });
    cb(rawHtmlText.replace(/"|'/g, '').toLowerCase()); // Some Keywords are wraped in "" || '' which will be replace with \s using this RegEx
}
function fromHTMLtoStringArray(siteUrl, isLocal, callback) {
    loader_1.default(siteUrl, isLocal, function (body) {
        parseHtml(body, function (rawhtml) {
            var allKw = rawhtml.split(' ');
            callback(null, allKw, allKw.length);
        });
    });
}
function filterSymboles(allKwordList, callback) {
    var _keyWordCountRaw = coutArray(allKwordList, 'Keyword');
    var keyWordCount = _.filter(_keyWordCountRaw, function (kwObj) {
        var kwCheck = validate.customOr(kwObj.Keyword, rules_1.default, '');
        if (kwCheck) {
            return kwObj;
        }
    });
    callback(keyWordCount);
}
function excludeKeywords(excludedKw, filterSymbole, callback) {
    var filteredPreo = _.filter(filterSymbole, function (el) {
        var findPrep = _.find(excludedKw, function (findKw) {
            if (findKw.toUpperCase() === el.Keyword.toUpperCase()) {
                return findKw;
            }
        });
        if (!findPrep) {
            return el;
        }
    });
    callback(filteredPreo);
}
// Sort result in descending count
function sortData(finalKwList, callback) {
    var sortedList = _.sortBy(finalKwList, function (el) {
        return el.count;
    });
    callback(sortedList);
}
// only this function is exposed to app
function getKeyDetail(siteUrl, isLocal, callback) {
    try {
        fromHTMLtoStringArray(siteUrl, isLocal, function (err, all, totalKeyWords) {
            if (err) {
                throw err;
            }
            filterSymboles(all, function (filterdSymbol) {
                excludeKeywords(prepositions_1.default, filterdSymbol, function (finalData) {
                    sortData(finalData, function (data) {
                        rawHtmlText = ''; // Reset temp Raw HTML holder to null
                        callback(null, data, totalKeyWords); // if process successful err will null
                    });
                });
            });
        });
    }
    catch (err) {
        callback(err, null, null); // if process fail err will !null
    }
}
exports.default = getKeyDetail;
//# sourceMappingURL=process.js.map