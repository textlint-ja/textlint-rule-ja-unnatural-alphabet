# textlint-rule-ja-unnatural-alphabet [![Build Status](https://travis-ci.org/textlint-ja/textlint-rule-ja-unnatural-alphabet.svg?branch=master)](https://travis-ci.org/textlint-ja/textlint-rule-ja-unnatural-alphabet)

不自然なアルファベットを検知する[textlint](https://github.com/textlint/textlint "textlint")ルール。

IMEの入力ミスによるtypoを見つけるルールです。

`{日本語}{アルファベット}{日本語}`のように不自然な形でアルファベットが登場した場合をチェックしていないかをチェックしています。

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
    - 無視するアルファベットや単語の配列
    - デフォルト: `["a", "i", "u", "e", "o", "n", 典型例 ]`
    - デフォルトでは母音とnを除外している
    - `"/正規表現/"` のような[RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)もサポートしています

```json5
{
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
}
```

### `allow`: `string[]`

`allow`オプションには、エラーとしたくない文字列または[RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)を指定できます。
[RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)は`/`と`/`で囲んだ正規表現ライクな文字列です。詳細は次を参照してください。

- [textlint/regexp-string-matcher: Regexp-like string matcher.](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

たとえば、`アンドロイドnを購入する`という文章は`{日本語}{アルファベット}{日本語}`のルールに該当するためエラーとなりますが、`allow`オプションではエラーを無視するように設定できます。

```json5
{
    // 無視する設定を追加
    "allow": [
        "アンドロイドn"
    ]
}
```

同様に[RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)を使うことで、`allow`オプションに正規表現のような指定が可能です。

:warning: [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)は文字列で正規表現リテラルを書くため、`\d`のような特殊文字は`"\\d"`とエスケープする必要があります。

次の設定は`アンドロイド{アルファベット}`は問題ないとしてエラーにしません。

```json5
{
    "allow": [
        // RegExp-like String は `/` と `/` で囲む
        "/アンドロイド[a-zA-Z]/"
    ]
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
