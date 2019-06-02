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
// lagacy function to load html throw http request
// dont gives true results for site that are using react.js, angular.js etc
// function getHtml(siteUrl: string, callback) {
//   request.get(siteUrl, (err, res, body) => {
//     if (res.statusCode >= 400) {
//       throw new Error('Cannot Reach Site');
//     }
//     callback(err, body);
//   });
// }
function getHtml(siteUrl, callback) {
    loader_1.default(siteUrl, function (rawHtmlString) {
        callback(rawHtmlString.toString());
    });
}
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
    cb(rawHtmlText.replace(/"|'/g, '').toLowerCase());
}
function getProcessedData(siteUrl, callback) {
    getHtml(siteUrl, function (body) {
        // if (err) { callback(err, null); }
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
function filterPrepositionsAndVerbs(prepoLsit, filterSymbole, callback) {
    var filteredPreo = _.filter(filterSymbole, function (el) {
        var findPrep = _.find(prepoLsit, function (findKw) {
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
function sortData(finalKwList, callback) {
    var sortedList = _.sortBy(finalKwList, function (el) {
        return el.count;
    });
    callback(sortedList);
}
// only this function is exposed to app
function getKeyDetail(siteUrl, callback) {
    try {
        getProcessedData(siteUrl, function (err, all, totalKeyWords) {
            if (err) {
                throw err;
            }
            filterSymboles(all, function (filterdSymbol) {
                filterPrepositionsAndVerbs(prepositions_1.default, filterdSymbol, function (finalData) {
                    sortData(finalData, function (data) {
                        rawHtmlText = '';
                        callback(null, data, totalKeyWords);
                    });
                });
            });
        });
    }
    catch (err) {
        callback(err, null, null);
    }
}
exports.default = getKeyDetail;
//# sourceMappingURL=process.js.map