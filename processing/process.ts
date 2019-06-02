
const _ = require('lodash');
const JSSoup = require('jssoup').default;
const coutArray = require('count-array-values');
const validate = require('input-validate');

import preposition from './prepositions';
import rules from './rules';
import excluded from './excluded';
import rawHtml from './loader';


let rawHtmlText = '';

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

function getHtml(siteUrl: string, callback) {
  rawHtml(siteUrl, (rawHtmlString) => {
    callback(rawHtmlString.toString());
  });
}


function parseHtml(htmlBody, cb) {
  const soup = new JSSoup(htmlBody);
  // itterate all JSSoup elements array to find interesting tags
  soup.findAll().forEach(el => {
    // filters tags with no interest check excluded list at top
    const tag = _.find(excluded, (tagName) => {
      if (tagName === el.name) { return el; }
    });
    // concatinating all text in one place
    if (!tag && el.string !== undefined) { rawHtmlText += el.text + ' '; }
  });
  cb(rawHtmlText.replace(/"|'/g, '').toLowerCase());
}


function getProcessedData(siteUrl: string , callback) {
  getHtml(siteUrl, (body) => {
    // if (err) { callback(err, null); }
    parseHtml(body, (rawhtml) => {
      const allKw = rawhtml.split(' ');
      callback(null, allKw, allKw.length);
    });
  });
}


function filterSymboles(allKwordList: string[], callback) {
  const _keyWordCountRaw = coutArray(allKwordList, 'Keyword');
  const keyWordCount = _.filter(_keyWordCountRaw, (kwObj) => {
    const kwCheck = validate.customOr(kwObj.Keyword, rules, '');
    if (kwCheck) { return kwObj; }
  });
  callback(keyWordCount);
}


function filterPrepositionsAndVerbs(prepoLsit: string[], filterSymbole,  callback) {
  const filteredPreo = _.filter(filterSymbole, (el) => {
    const findPrep = _.find(prepoLsit, (findKw) => {
      if (findKw.toUpperCase() === el.Keyword.toUpperCase()) { return findKw; }
    });
    if (!findPrep) {
      return el;
    }
  });
  callback(filteredPreo);
}


function sortData(finalKwList: Object[], callback) {
  const sortedList = _.sortBy(finalKwList, (el) => {
    return el.count;
  });
  callback(sortedList);
}


// only this function is exposed to app
export default function getKeyDetail(siteUrl: string, callback) {
  try {
    getProcessedData(siteUrl, (err, all, totalKeyWords) => {
      if (err) { throw err; }
      filterSymboles(all, (filterdSymbol) => {
        filterPrepositionsAndVerbs(preposition, filterdSymbol, (finalData) => {
          sortData(finalData, (data) => {
            rawHtmlText = '';
            callback(null, data, totalKeyWords);
          });
        });
      });
    });
  } catch (err) {
    callback(err, null, null);
  }

}
