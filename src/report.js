// 提交码：把填报内容压成一段可复制的文字，学校复制后发给项目组，项目组在「解码」页还原。
// 格式：NS1. + base64url(JSON)。没有后台也能收，数据不经过第三方。

const PREFIX = "NS1.";

function toB64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64(b64) {
  const s = b64.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s + "=".repeat((4 - (s.length % 4)) % 4);
  const bin = atob(pad);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeReport(type, payload) {
  const doc = { t: type, at: new Date().toISOString().slice(0, 16), v: 1, d: payload };
  return PREFIX + toB64(JSON.stringify(doc));
}

export function decodeReports(text) {
  const out = [];
  const re = /NS1\.[A-Za-z0-9_-]+/g;
  let m;
  while ((m = re.exec(text))) {
    try {
      out.push(JSON.parse(fromB64(m[0].slice(PREFIX.length))));
    } catch (e) {
      out.push({ t: "error", raw: m[0].slice(0, 24) + "…" });
    }
  }
  return out;
}

export const REPORT_LABELS = {
  patrol: "每月巡护表",
  participation: "步道使用率",
  feedback: "路线反馈表",
};

export const FIELD_LABELS = {
  school: "学校", route: "路线编号", date: "日期", who: "填表人", weather: "天气", rows: "设施",
  id: "设施编号", look: "外观", reflect: "反光", fix: "固定", replace: "需更换", action: "处理措施",
  term: "学期", girls: "全校女生数", done: "完成至少 1 次完整路线的女生数", rate: "参与率 %",
  score: "评分", fun: "最好玩的一段", unclear: "看不清路标的地方", change: "想改的一处",
};
const VALUE_LABELS = { ok: "好", bad: "有问题", true: "是", false: "否" };
export function labelKey(k) {
  return k.replace(/[A-Za-z]+/g, (w) => FIELD_LABELS[w] || w);
}
export function labelValue(v) {
  return VALUE_LABELS[String(v)] ?? (v === "" || v === null || v === undefined ? "（空）" : String(v));
}

export function reportsToCsv(list) {
  const rows = [["类型", "提交时间", "字段", "值"]];
  for (const r of list) {
    if (r.t === "error") { rows.push(["无法解析", "", "", r.raw]); continue; }
    const flat = flatten(r.d);
    for (const [k, v] of Object.entries(flat)) rows.push([REPORT_LABELS[r.t] || r.t, r.at, labelKey(k), labelValue(v)]);
  }
  return rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n");
}

export function flatten(obj, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? prefix + "." + k : k;
    if (Array.isArray(v)) v.forEach((item, i) => Object.assign(out, flatten(item, key + "[" + (i + 1) + "]")));
    else if (v && typeof v === "object") Object.assign(out, flatten(v, key));
    else out[key] = v;
  }
  return out;
}
