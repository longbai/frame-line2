# Frame Line 2

每日一部电影：从 Hitokoto 影视金句中按日期选句，根据金句的影片出处匹配 TMDB 电影，再使用 `poster-ai` 生成 1080 × 1440 电影日签。

本仓库只包含日签应用实现。[Michaelliv/poster](https://github.com/Michaelliv/poster) 通过 npm 包 `poster-ai` 作为依赖使用，不包含其源码。

## 安装

```bash
npm install
cp .env.example .env
cp config.json.example config.json
```

在 `.env` 中填写：

```dotenv
TMDB_READ_ACCESS_TOKEN=
TMDB_API_KEY=
OMDB_API_KEY=
```

TMDB Token 与 API Key 任选其一；OMDb 用于补充校验导演和年份。

## 配置

`config.json` 控制背景、左上角 slogan、左下角 Logo、右下角 slogan 与二维码：

```json
{
  "appearance": {
    "grayBackground": true
  },
  "header": {
    "slogan": "电影的美好"
  },
  "brand": {
    "name": "FRAME/LINE",
    "tagline": "A FILM FOR EVERY DAY",
    "logo": "assets/example-cinema-logo.png"
  },
  "qr": {
    "target": "",
    "image": "",
    "monochrome": true,
    "slogan": "此刻，是我们共度的时光",
    "description": []
  }
}
```

- `appearance.grayBackground`: `true` 为浅灰背景；`false` 为透明背景。
- `brand.logo`: 本地文件、HTTP(S) URL 或 data URL；文件不存在时使用内置默认 Logo。
- `qr.target`: 自动生成二维码的内容；为空时使用当天电影的 TMDB 页面。
- `qr.image`: 直接使用二维码图片；为空时自动生成。
- `qr.monochrome`: 将指定二维码无损显示为黑色。

本地 Logo、二维码统一放在 `assets/`。`assets/`、`config.json`、`.env`、生成数据与成品均已忽略，不会进入 Git。

## 生成

```bash
npm run generate
npm run build
npm run export
```

或一次完成：

```bash
npm run daily
```

输出：

- `output/daily-movie.html`
- `output/daily-movie.png`

无 API Key 时可运行固定演示：

```bash
npm run demo
```

## 测试

```bash
npm test
```
