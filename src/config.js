// 项目组可改的配置。留空的项在页面上会显示为「待项目组填写」或隐藏对应按钮。
export const SITE_URL = "https://roger-2022.github.io/nike-stride-h5/";

// 在线填报入口：填入腾讯问卷或金山表单链接后，填报页会多出「在线提交」按钮。
export const SURVEY_URLS = {
  patrol: "",        // 每月巡护表
  participation: "", // 步道使用率
  feedback: "",      // 路线反馈表
};

// 提交码的接收方式。邮箱留空则不显示「发邮件」按钮。
export const CONTACT = {
  email: "",
  wechat: "项目组微信（交付时填写）",
};

// 工具包电子书链接（claude.ai 作品页，需项目组开放分享后才能打开）。
export const EBOOK_URL = "https://claude.ai/code/artifact/f6a28cb2-38fa-4e22-b255-827a49edb800";

export const VERSION = "V2.0 2026-09";
