// MIT © 2017 azu
"use strict";
const escapeStringRegexp = require('escape-string-regexp');
const matchCaptureGroupAll = require("match-index").matchCaptureGroupAll;
const regx = require("regx").default;
// IME的に入力されそうな文字列
// 日本語 + 記号
const japaneseRegExp = /(?:[々〇〻\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F]|[\uFF00-\uFFEF]|[\uDC00-\uDFFF]|[ぁ-んァ-ヶー。、・−])/;
// 半角/全角のアルファベットの正規表現
const alphabetPattern = /([a-zA-Zａ-ｚＡ-Ｚ])/;
/**
 * 不自然なアルファベットの正規表現
 * @type {RegExp}
 */
const unnaturalPattern = regx("g")`${japaneseRegExp}${alphabetPattern}${japaneseRegExp}`;
/***
 * 不自然なアルファベットのグループを返す
 * @param {string} text
 * @returns {MatchCaptureGroup[]}
 */
const matchUnnaturalAlphabet = (text) => {
    return matchCaptureGroupAll(text, unnaturalPattern);
};

/**
 * if actual is in the `exceptGroups`, return true
 * @param {MatchCaptureGroup[]} exceptGroups
 * @param {MatchCaptureGroup} actual
 * @returns {boolean}
 */
const isIgnoredRange = (exceptGroups, actual) => {
    return exceptGroups.some(({ text, index }) => {
        const endIndex = index + text.length;
        return index <= actual.index && actual.index <= endIndex;
    });
};
/***
 *
 * @param {string} input
 * @param {string[]} allowAlphabets
 * @returns {MatchCaptureGroup[]}
 */
const createIgnoreRanges = (input, allowAlphabets) => {
    // str -> RegExp
    const patterns = allowAlphabets.map(allowWord => {
        if (!allowWord) {
            return /^$/;
        }
        if (allowWord[0] === "/" && allowWord[allowWord.length - 1] === "/") {
            const regExpString = allowWord.slice(1, allowWord.length - 1);
            return new RegExp(`(${regExpString})`, "g");
        }
        const escapeString = escapeStringRegexp(allowWord);
        return new RegExp(`(${escapeString})`, "g");
    });
    return patterns.reduce((total, pattern) => {
        return total.concat(matchCaptureGroupAll(input, pattern));
    }, []);
};

const defaultOptions = {
    // 無視するアルファベット
    // 例) ["X"]
    // デフォルトでは母音とnと典型例を除外している
    "allow": [
        "a", "i", "u", "e", "o",
        "n",
        "/[a-zA-Zａ-ｚＡ-Ｚ]言語/",
        "/[x-zX-Z]座標/",
        "/[x-zX-Z]軸/",
        "Eメール"
    ]
};
const report = (context, options = {}) => {
    const { Syntax, RuleError, report, getSource } = context;
    const allowAlphabets = options.allow || defaultOptions.allow;
    return {
        [Syntax.Str](node){
            const text = getSource(node);
            const ignoreMatch = createIgnoreRanges(text, allowAlphabets);
            matchUnnaturalAlphabet(text).forEach((actual) => {
                const { text, index } = actual;
                // 無視する単語を含んでいるなら無視
                if (isIgnoredRange(ignoreMatch, actual)) {
                    return;
                }
                report(node, new RuleError(`不自然なアルファベットがあります: ${text}`, {
                    index
                }));
            });
        }
    }
};

module.exports = report;
