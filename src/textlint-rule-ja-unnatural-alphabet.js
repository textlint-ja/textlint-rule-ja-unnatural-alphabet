// MIT © 2017 azu
"use strict";
const matchCaptureGroupAll = require("match-index").matchCaptureGroupAll;
const regx = require("regx").default;
// IME的に入力されそうな文字列
// 日本語 + 記号
const japaneseRegExp = /(?:[々〇〻\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[ぁ-んァ-ヶー。、・−])/;
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

const defaultOptions = {
    // 無視するアルファベット
    // 例) ["X"]
    // デフォルトでは母音とnを除外している
    "allow": ["a", "i", "u", "e", "o", "n"]
};
const report = (context, options = {}) => {
    const { Syntax, RuleError, report, getSource } = context;
    const allowAlphabets = options.allow || defaultOptions.allow;
    return {
        [Syntax.Str](node){
            const text = getSource(node);
            matchUnnaturalAlphabet(text).forEach(({ text, index }) => {
                // 無視するアルファベットであるなら無視
                if (allowAlphabets.indexOf(text) !== -1) {
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
