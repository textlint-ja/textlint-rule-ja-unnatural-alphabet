// MIT © 2017 azu
"use strict";
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
// rule
const rule = require("../src/textlint-rule-ja-unnatural-alphabet");
// ruleName, rule, { valid, invalid }
tester.run("textlint-rule-ja-unnatural-alphabet", rule, {
    valid: [
        "リリース",
        "aiueo",
        "This is pen.",
        // 単独の大文字アルファベットは許容
        "リソースA、リソースB、リソースC、リソースD",
        "これはC言語",
        "これはD言語",
        "これはX座標",
        "これはX軸",
        "これはEメール",
        {
            text: "アンドロイドNは良し",
            options: {
                allow: ["N"]
            }
        }, {
            text: "アンドロイドNは良し",
            options: {
                allow: ["アンドロイドN"]
            }
        }, {
            text: "アンドロイドNは良し",
            options: {
                allow: ["/アンドロイド[a-zA-Z]/"]
            }
        }
    ],
    invalid: [
        {
            text: "リイr−ス",
            errors: [
                {
                    message: "不自然なアルファベットがあります: r"
                }
            ]
        },
        {
            text: "対応でｋない",
            errors: [
                {
                    message: "不自然なアルファベットがあります: ｋ"
                }
            ]
        },
        {
            text: "無駄なk脳",
            errors: [
                {
                    message: "不自然なアルファベットがあります: k"
                }
            ]
        }
    ]
});
