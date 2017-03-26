# textlint-rule-ja-unnatural-alphabet [![Build Status](https://travis-ci.org/textlint-ja/textlint-rule-ja-unnatural-alphabet.svg?branch=master)](https://travis-ci.org/textlint-ja/textlint-rule-ja-unnatural-alphabet)

不自然なアルファベットを検知する[textlint](https://github.com/textlint/textlint "textlint")ルール。

IMEの入力ミスによるtypoを見つけるルールです。

## Example

**OK**:

```
リリース
aiueo
This is pen.
```

**NG**:

```
リイr−ス
対応でｋない
```

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-ja-unnatural-alphabet

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "ja-unnatural-alphabet": true
    }
}
```

Via CLI

```
textlint --rule ja-unnatural-alphabet README.md
```

## Options

- `allow`: `string[]`
    - 無視するアルファベットの配列
    - デフォルト: `["a", "i", "u", "e", "o", "n", 典型例 ]`
    - デフォルトでは母音とnを除外している
    - `"/正規表現/" のような文字列もサポート

```json5
{
    // 無視するアルファベット
    // 例) ["X"]
    // デフォルトでは母音とnを除外
    "allow": [
        "a", "i", "u", "e", "o", "n"
    ],
    // ビルトインの典型例を除外するかどうか
    // 例) C言語
    "allowCommonCase": true
}
```

## 参考文献

> (3) 不自然なアルファベット

- 1文字のみのアルファベットが日本語中に現れた場合に検出対象とする
- 大文字は、略記号などを意識して入れている可能性がある
- このミスでは母音(`aiueo`)は発生しないので除く
- `n`も多くの場合には、`ん`となるため除く

[CiNii 論文 -  日本語文章校正ツール"Chanterelle" : 入力ミス及び表記揺らぎについて](http://ci.nii.ac.jp/naid/110002893543)より

## Changelog

See [Releases page](https://github.com/textlint-ja/textlint-rule-ja-unnatural-alphabet/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-ja/textlint-rule-ja-unnatural-alphabet/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
