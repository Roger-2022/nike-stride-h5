# 行远步道 Nike Stride H5

行远步道执行工具包的手机入口：三所试点学校与打卡点、每个点位的溯源牌二维码、女生短视频栏目、旧鞋文创、行远者计划四条路径、学校填报（每月巡护表、步道使用率、路线反馈表）与项目组解码。

线上地址：https://roger-2022.github.io/nike-stride-h5/

## 结构

- `src/App.jsx` 页面与路由（hash 路由：`#/`、`#/schools`、`#/school/:id`、`#/point/:id/:W`、`#/report/:type`、`#/decode`、`#/kit`）
- `src/data.js` 三校、点位、栏目、文创、四机制。数字与规则来自《行远步道执行工具包》V14，点位名称为示例
- `src/config.js` 项目组可改：站点地址、在线问卷链接、联系方式、电子书链接
- `src/report.js` 提交码编码与解码（`NS1.` + base64url JSON），无后台

## 学校填报怎么收

学校在手机上填完生成一段提交码，复制发微信给项目组；项目组打开 `#/decode` 粘贴，自动还原并可导出 CSV。若在 `src/config.js` 填入腾讯问卷或金山表单链接，填报页会多一个「在线提交」按钮。

## 本地预览与发布

```bash
npm install
npm run dev      # 本地预览
npm run build    # 构建到 dist/
```

推送到 `main` 后 GitHub Actions 自动构建并发布到 GitHub Pages。

## 来源

Fork 自 Owen-Kinggg/nike-stride-h5（2026-04 原型），2026-09 按工具包口径重做。
