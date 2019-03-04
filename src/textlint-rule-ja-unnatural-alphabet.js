// MIT © 2017 azu
"use strict";
const { matchPatterns } = require("@textlint/regexp-string-matcher");
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
 * if actual is in the `matchPatternResults`, return true
 * @param {matchPatternResult[]} matchPatternResults
 * @param {MatchCaptureGroup} actual
 * @returns {boolean}
 */
const isIgnoredRange = (matchPatternResults, actual) => {
    return matchPatternResults.some(result => {
        return result.startIndex <= actual.index && actual.index <= result.endIndex;
    });
};

/**
 * ビルトインの無視するリスト
 * @type {[*]}
 */
const builtInCommonAllow = [
    "/[a-zA-Zａ-ｚＡ-Ｚ]言語/",
    "/[x-zX-Z]座標/",
    "/[x-zX-Z]軸/",
    "/Eメール/i"
];
const defaultOptions = {
    // 無視するアルファベット
    // 例) ["r"]
    // デフォルトでは母音とn、大文字のアルファベットを除外
    // 単独の大文字のアルファベットは入力ミスでは発生しにくため
    "allow": [
        "a", "i", "u", "e", "o", "n",
        "/[A-Z]/"
    ],
    // ビルトインの典型例を除外するかどうか
    // 例) C言語
    "allowCommonCase": true
};
const report = (context, options = {}) => {
    const { Syntax, RuleError, report, getSource } = context;
    const allowAlphabets = options.allow || defaultOptions.allow;
    const allowCommonCase = options.allowCommonCase !== undefined
        ? options.allowCommonCase
        : defaultOptions.allowCommonCase;
    const allow = allowCommonCase ? allowAlphabets.concat(builtInCommonAllow) : allowAlphabets;
    return {
        [Syntax.Str](node){
            const text = getSource(node);
            const ignoreMatch = matchPatterns(text, allow);
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
