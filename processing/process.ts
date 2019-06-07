
const _ = require('lodash');
const JSSoup = require('jssoup').default;
const coutArray = require('count-array-values');
const validate = require('input-validate');

import unInterestedWords from './prepositions';
import rules from './rules';
import excluded from './excluded';
import rawHtml from './loader';


let rawHtmlText = '';

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
  cb(rawHtmlText.replace(/"|'/g, '').toLowerCase()); // Some Keywords are wraped in "" || '' which will be replace with \s using this RegEx
}


function fromHTMLtoStringArray(siteUrl: string , callback) {
  rawHtml(siteUrl, (body) => {
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


function excludeKeywords(excludedKw: string[], filterSymbole,  callback) {
  const filteredPreo = _.filter(filterSymbole, (el) => {
    const findPrep = _.find(excludedKw, (findKw) => {
      if (findKw.toUpperCase() === el.Keyword.toUpperCase()) { return findKw; }
    });
    if (!findPrep) {
      return el;
    }
  });
  callback(filteredPreo);
}

// Sort result in descending count
function sortData(finalKwList: Object[], callback) {
  const sortedList = _.sortBy(finalKwList, (el) => {
    return el.count;
  });
  callback(sortedList);
}


// only this function is exposed to app
export default function getKeyDetail(siteUrl: string, callback) {
  try {
    fromHTMLtoStringArray(siteUrl, (err, all, totalKeyWords) => { // Parse HTML To String Array
      if (err) { throw err; }
      filterSymboles(all, (filterdSymbol) => {          // Filter Keywords that are not valid words
        excludeKeywords(unInterestedWords, filterdSymbol, (finalData) => {  // Exclude unneccessary Keywords like "The", "me", "you" ...
          sortData(finalData, (data) => {   // Sort data with highes number of count first
            rawHtmlText = '';               // Reset temp Raw HTML holder to null
            callback(null, data, totalKeyWords); // if process successful err will null
          });
        });
      });
    });
  } catch (err) {
    callback(err, null, null); // if process fail err will !null
  }

}
