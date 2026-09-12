import React, { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { SCHOOLS, RULES, VIDEO_TYPES, CRAFTS, MECHANISMS, KIT_BOOKS } from "./data.js";
import { SITE_URL, SURVEY_URLS, CONTACT, EBOOK_URL, VERSION } from "./config.js";
import { encodeReport, decodeReports, reportsToCsv, REPORT_LABELS, flatten, labelKey, labelValue } from "./report.js";
import panorama from "./assets/f-panorama.jpg";
import modules from "./assets/f-trail-modules.jpg";

/* ---------- 路由：hash，方便 GitHub Pages 和二维码直达 ---------- */
function useRoute() {
  const parse = () => window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [parts, setParts] = useState(parse);
  useEffect(() => {
    const on = () => { setParts(parse()); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return parts;
}
const go = (path) => { window.location.hash = "#/" + path; };

/* ---------- 基础件 ---------- */
const SW = "M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8-.317.51-.56 1.06-.746 1.643-.373 1.175-.28 2.052.28 2.632.28.28.7.42 1.26.42.42 0 .93-.093 1.54-.28L24 7.8z";
function Swoosh({ className = "h-3 w-8" }) {
  return (
    <svg viewBox="0 0 24 9" className={className} aria-hidden="true">
      <path d={SW} transform="translate(0,-7.4)" fill="#FA5400" />
    </svg>
  );
}
function Kicker({ children }) {
  return <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-mute">{children}</div>;
}
function SectionHead({ kicker, title, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3 border-b-2 border-ink pb-2">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="mt-1 text-[22px] font-black leading-tight text-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}
function Chip({ children, tone = "ink" }) {
  const map = { ink: "bg-ink text-cream", orange: "bg-orange text-ink", green: "bg-green text-cream", line: "border border-ink text-ink" };
  return <span className={`inline-flex items-center rounded-md px-2 py-[3px] text-[11px] font-extrabold ${map[tone]}`}>{children}</span>;
}
function Btn({ children, onClick, tone = "ink", href, className = "" }) {
  const map = { ink: "bg-ink text-cream", orange: "bg-orange text-ink", line: "border-[1.5px] border-ink text-ink bg-transparent", soft: "bg-peach text-ink" };
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-extrabold ${map[tone]} ${className}`;
  if (href) return <a className={cls} href={href} target="_blank" rel="noreferrer">{children}</a>;
  return <button type="button" className={cls} onClick={onClick}>{children}</button>;
}
function StampBadge({ s }) {
  if (!s) return null;
  return <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-green px-1.5 text-[11px] font-black text-green">{s}</span>;
}
function ColorStrip() {
  return (
    <div className="flex items-center gap-1.5">
      {["#FA5400", "#6BA539", "#1A1A1A", "#FFFFFF", "#FFE0CC"].map((c) => (
        <span key={c} className="h-3.5 w-3.5 border border-ink" style={{ background: c }} />
      ))}
    </div>
  );
}

/* ---------- 顶栏与页脚 ---------- */
function TopBar({ route }) {
  const tabs = [
    ["", "首页"],
    ["schools", "三校"],
    ["report", "学校填报"],
    ["kit", "工具包"],
  ];
  const cur = route[0] || "";
  return (
    <header className="sticky top-0 z-20 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-[520px] items-center justify-between px-4 py-2.5">
        <button type="button" onClick={() => go("")} className="flex items-center gap-2 text-left">
          <Swoosh />
          <span className="text-[10px] font-extrabold tracking-[0.18em] text-ink">NIKE STRIDE</span>
        </button>
        <nav className="flex gap-1">
          {tabs.map(([k, label]) => (
            <button key={k} type="button" onClick={() => go(k)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-extrabold ${cur === k || (k === "schools" && (cur === "school" || cur === "point")) ? "bg-ink text-cream" : "text-ink"}`}>
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
function Footer() {
  return (
    <footer className="mt-12 border-t-2 border-ink px-4 pb-10 pt-5">
      <div className="mx-auto max-w-[520px]">
        <div className="flex items-center justify-between">
          <ColorStrip />
          <span className="text-[10px] font-bold tracking-[0.12em] text-mute">{VERSION}</span>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-mute">
          TURN EVERY RETIRED SHOE INTO A NEW COMPASS。清华大学 NIKE HACK 4 SDG 项目组。
          本页只做展示，学生打卡走纸质护照盖章，不记名、不定位。
        </p>
        <p className="mt-2 text-[11px] text-mute">项目组联系：{CONTACT.wechat}{CONTACT.email ? `，${CONTACT.email}` : ""}</p>
      </div>
    </footer>
  );
}

/* ---------- 首页 ---------- */
function Home() {
  return (
    <div className="mx-auto max-w-[520px]">
      <section className="px-4 pt-5">
        <div className="overflow-hidden border border-ink bg-cream">
          <img src={panorama} alt="行远步道剪纸全景" className="block w-full" />
        </div>
        <div className="mt-5">
          <Kicker>Nike Stride · Rural Girls Trail</Kicker>
          <h1 className="mt-1 text-[38px] font-black leading-[1.1] text-ink">行远步道</h1>
          <p className="mt-3 text-[15px] font-bold leading-relaxed text-ink">让每一双旧鞋，都成为新的方向。</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-body">
            用回收旧鞋做路标，在校园和周边建一条定向越野步道。女生自己定线、自己维护，沿路标走完全程、盖章记录。
          </p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[[`${RULES.maxKm} km`, "以内，单次活动线"], [`${RULES.points} 个`, "打卡点 W1 至 W6"], [`${RULES.activeMinutes} 分钟`, "走动时间，不含停留"]].map(([v, l]) => (
            <div key={l} className="border border-ink p-3">
              <div className="text-[20px] font-black text-orange">{v}</div>
              <div className="mt-1 text-[11px] leading-snug text-mute">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-9 px-4">
        <SectionHead kicker="How a walk works" title="走一次，四步" />
        <ol className="grid grid-cols-2 gap-3">
          {[
            ["领护照", "学生版免费，封面写名字和项目编号。"],
            ["沿路标走", "橙绿白三色鞋带指路，打卡点 W1 到 W6 含起终点。"],
            ["三站盖章", `印章站 S1 起点、S2 中途、S3 终点，盖满 ${RULES.stamps} 个章算一次完整路线。`],
            ["记一页", "一次路线记一页：日期、路线编号、本次序号。用满找老师领新本。"],
          ].map(([t, d], i) => (
            <li key={t} className="border border-ink p-3">
              <div className="text-[22px] font-black text-orange">{i + 1}</div>
              <div className="mt-1 text-[14px] font-black text-ink">{t}</div>
              <div className="mt-1 text-[12px] leading-relaxed text-body">{d}</div>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[11.5px] leading-relaxed text-mute">
          带队：每次至少 2 名成人，且每 {RULES.adultRatio} 名学生配 1 名带队成人。扫二维码只看内容，不做打卡、不记名。
        </p>
      </section>

      <section className="mt-9 px-4">
        <SectionHead kicker="Three pilots" title="三所试点学校" action={<button type="button" onClick={() => go("schools")} className="text-[12px] font-extrabold text-orange">全部 ›</button>} />
        <div className="grid gap-3">
          {SCHOOLS.map((s) => <SchoolCard key={s.id} s={s} />)}
        </div>
      </section>

      <section className="mt-9 px-4">
        <SectionHead kicker="Girls' videos" title="女生短视频栏目" />
        <div className="grid gap-3">
          {VIDEO_TYPES.map((v) => {
            const s = SCHOOLS.find((x) => x.id === v.school);
            return (
              <div key={v.type} className="grid grid-cols-[120px_1fr] gap-3 border border-ink">
                <div className="relative overflow-hidden bg-ink">
                  <img src={s.poster} alt={v.type} className="h-full w-full object-cover" />
                  <span className="absolute left-1.5 top-1.5 rounded bg-cream px-1.5 py-0.5 text-[9px] font-extrabold text-ink">栏目海报</span>
                </div>
                <div className="py-3 pr-3">
                  <Chip tone="orange">{v.type}</Chip>
                  <div className="mt-1.5 text-[14px] font-black leading-snug text-ink">{s.posterTitle}</div>
                  <div className="mt-1 text-[12px] leading-relaxed text-body">{v.text}</div>
                  <div className="mt-2 text-[11px] text-mute">{s.name} · 短片上线后在此播放</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-9 px-4">
        <SectionHead kicker="Craft" title="旧鞋文创" />
        <div className="grid grid-cols-2 gap-3">
          {CRAFTS.map((c) => (
            <div key={c.name} className="border border-ink">
              <img src={c.image} alt={c.name} className="aspect-square w-full object-cover" />
              <div className="p-3">
                <div className="text-[14px] font-black text-ink">{c.name}</div>
                <div className="mt-1 text-[11.5px] leading-relaxed text-body">{c.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 border border-ink bg-white p-3">
          <img src={modules} alt="步道模块示意" className="block w-full" />
          <div className="mt-2 text-[11px] text-mute">路标立柱、鞋带标识、印章站、起终点平台：一套工具箱装得下。</div>
        </div>
      </section>

      <section className="mt-9 px-4">
        <SectionHead kicker="Keep it going" title="行远者计划：四条路径" />
        <ul className="divide-y divide-line border-y border-ink">
          {MECHANISMS.map((m) => (
            <li key={m.no} className="grid grid-cols-[28px_1fr] gap-3 py-3">
              <div className="text-[20px] font-black text-orange">{m.no}</div>
              <div>
                <div className="text-[14px] font-black text-ink">{m.name}</div>
                <div className="mt-1 text-[12px] leading-relaxed text-body">{m.text}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-9 px-4">
        <div className="bg-ink p-5 text-cream">
          <Kicker>For schools</Kicker>
          <h2 className="mt-1 text-[22px] font-black leading-tight">学校填报，手机上就能填</h2>
          <p className="mt-2 text-[12.5px] leading-relaxed text-cream/80">每月巡护表、步道使用率、路线反馈表。填完生成一段提交码，复制发给项目组即可，不用登录、不装软件。</p>
          <div className="mt-4 flex gap-2">
            <Btn tone="orange" onClick={() => go("report")}>去填报</Btn>
            <Btn tone="line" className="!border-cream !text-cream" onClick={() => go("kit")}>看工具包</Btn>
          </div>
        </div>
      </section>
    </div>
  );
}

function SchoolCard({ s }) {
  return (
    <button type="button" onClick={() => go(`school/${s.id}`)} className="grid grid-cols-[132px_1fr] gap-3 border border-ink text-left">
      <img src={s.photo} alt={s.name} className="h-full w-full object-cover" />
      <div className="py-3 pr-3">
        <div className="flex items-center gap-2">
          <Chip tone="ink">{s.code}</Chip>
          <Chip tone="line">{s.terrain}</Chip>
        </div>
        <div className="mt-1.5 text-[16px] font-black text-ink">{s.name}</div>
        <div className="text-[12px] text-mute">{s.place}</div>
        <div className="mt-2 text-[15px] font-black text-orange">{s.plannedKm} <span className="text-[10px]">KM</span> <span className="text-[10px] font-bold text-mute">示范路网规划总长（计划值）</span></div>
      </div>
    </button>
  );
}

/* ---------- 三校 ---------- */
function Schools() {
  return (
    <div className="mx-auto max-w-[520px] px-4 pt-5">
      <Kicker>Three pilots</Kicker>
      <h1 className="mt-1 text-[28px] font-black text-ink">三所试点学校</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-body">山地、海岛、校园三种地形各建一条，检查这套做法是否适用于不同学校。公里数是示范路网规划总长；学生单次活动线一律不超过 {RULES.maxKm} km、{RULES.points} 个打卡点。</p>
      <div className="mt-5 grid gap-3">{SCHOOLS.map((s) => <SchoolCard key={s.id} s={s} />)}</div>
    </div>
  );
}

function RouteMap({ points, active, onPick }) {
  // 六个点位摆成两行三列的折线，起终点在两端。
  const pos = [[40, 40], [200, 40], [360, 40], [360, 120], [200, 120], [40, 120]];
  const path = pos.map((p, i) => (i ? "L" : "M") + p.join(" ")).join(" ");
  return (
    <svg viewBox="0 0 400 160" className="block w-full">
      <path d={path} fill="none" stroke="#111111" strokeWidth="3" strokeDasharray="8 6" />
      {points.map((p, i) => {
        const [x, y] = pos[i];
        const on = active === p.w;
        return (
          <g key={p.w} onClick={() => onPick(p)} style={{ cursor: "pointer" }}>
            <circle cx={x} cy={y} r="17" fill={on ? "#FA5400" : p.stamp ? "#6BA539" : "#F5F1EA"} stroke="#111111" strokeWidth="2.5" />
            <text x={x} y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="900" fill={on || p.stamp ? "#F5F1EA" : "#111111"}>{p.w}</text>
            {p.stamp && <text x={x} y={y + 34} textAnchor="middle" fontSize="10" fontWeight="800" fill="#6BA539">{p.stamp}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function School({ id }) {
  const s = SCHOOLS.find((x) => x.id === id);
  const [active, setActive] = useState(null);
  if (!s) return <NotFound />;
  return (
    <div className="mx-auto max-w-[520px]">
      <div className="relative">
        <img src={s.photo} alt={s.name} className="block h-[210px] w-full object-cover" />
        <div className="absolute left-4 top-4 flex gap-2"><Chip tone="ink">{s.code}</Chip><Chip tone="orange">{s.terrain}</Chip></div>
      </div>
      <section className="px-4 pt-4">
        <Kicker>{s.place}</Kicker>
        <h1 className="mt-1 text-[28px] font-black leading-tight text-ink">{s.name}</h1>
        <p className="mt-2 text-[15px] font-black text-ink">{s.headline}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-body">{s.desc}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip tone="line">规划总长 {s.plannedKm} km（计划值）</Chip>
          <Chip tone="line">单次活动线 ≤ {RULES.maxKm} km</Chip>
          <Chip tone="line">{RULES.points} 个打卡点</Chip>
        </div>
      </section>
      <section className="mt-6 px-4">
        <SectionHead kicker="Route" title="打卡点与印章站" />
        <div className="border border-ink bg-white p-3">
          <RouteMap points={s.points} active={active} onPick={(p) => go(`point/${s.id}/${p.w}`)} />
          <div className="mt-1 flex items-center gap-3 text-[10.5px] text-mute">
            <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full border border-ink bg-green" />印章站 S1 至 S3</span>
            <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full border border-ink bg-cream" />打卡点</span>
          </div>
        </div>
        <ul className="mt-3 divide-y divide-line border-y border-ink">
          {s.points.map((p) => (
            <li key={p.w}>
              <button type="button" onClick={() => go(`point/${s.id}/${p.w}`)} onMouseEnter={() => setActive(p.w)} className="flex w-full items-center gap-3 py-3 text-left">
                <span className="inline-flex h-9 w-11 items-center justify-center rounded-md bg-ink text-[12px] font-black text-cream">{p.w}</span>
                <span className="flex-1">
                  <span className="block text-[14px] font-black text-ink">{p.name}</span>
                  <span className="block text-[11.5px] text-mute">{p.stamp ? "印章站，走到这里盖章" : "路标立柱，看下一条鞋带的方向"}</span>
                </span>
                <StampBadge s={p.stamp} />
                <span className="text-orange">›</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] leading-relaxed text-mute">点位名称为示例，正式点位以本校女生管理小组定线并经老师核验的路线图为准。</p>
      </section>
    </div>
  );
}

/* ---------- 点位页（二维码落地） ---------- */
function useQr(text) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let alive = true;
    QRCode.toString(text, { type: "svg", margin: 1, width: 240, color: { dark: "#111111", light: "#FFFFFF" } }).then((s) => alive && setSvg(s));
    return () => { alive = false; };
  }, [text]);
  return svg;
}

function Point({ sid, w }) {
  const s = SCHOOLS.find((x) => x.id === sid);
  const idx = s ? s.points.findIndex((p) => p.w === w) : -1;
  const url = `${SITE_URL}#/point/${sid}/${w}`;
  const svg = useQr(url);
  if (!s || idx < 0) return <NotFound />;
  const p = s.points[idx];
  const prev = s.points[idx - 1];
  const next = s.points[idx + 1];
  return (
    <div className="mx-auto max-w-[520px] px-4 pt-5">
      <button type="button" onClick={() => go(`school/${s.id}`)} className="text-[12px] font-extrabold text-orange">‹ {s.name}</button>
      <div className="mt-3 flex items-center gap-3">
        <span className="inline-flex h-14 w-16 items-center justify-center rounded-lg bg-ink text-[20px] font-black text-cream">{p.w}</span>
        <div>
          <h1 className="text-[26px] font-black leading-tight text-ink">{p.name}</h1>
          <div className="mt-1 flex items-center gap-2"><Chip tone="line">{s.terrain} · {s.place}</Chip><StampBadge s={p.stamp} /></div>
        </div>
      </div>
      <p className="mt-4 text-[14px] leading-relaxed text-body">{p.story}</p>

      <div className="mt-5 border border-ink bg-peach p-4">
        <Kicker>在这里做什么</Kicker>
        <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-ink">
          {p.stamp ? (
            <>
              <li>1. 翻到护照打卡记录页，在本次序号那一列盖 <b>{p.stamp}</b> 章，列头写日期和路线编号。</li>
              <li>2. 清点同组人数，等齐了再出发。</li>
            </>
          ) : (
            <>
              <li>1. 看路标立柱上的箭头，找下一条鞋带标识（每 30 至 50 米一条）。</li>
              <li>2. 拉一下鞋带，松了记下编号，回去交给老师报修。</li>
            </>
          )}
          <li>{p.stamp ? "3." : "3."} 扫码只看内容，本页不做打卡、不记名。</li>
        </ul>
      </div>

      <div className="mt-5 grid grid-cols-[120px_1fr] gap-3 border border-ink">
        <div className="relative overflow-hidden bg-ink">
          <img src={s.poster} alt="短视频栏目海报" className="h-full w-full object-cover" />
        </div>
        <div className="py-3 pr-3">
          <Chip tone="orange">女生短视频</Chip>
          <div className="mt-1.5 text-[14px] font-black leading-snug text-ink">{s.posterTitle}</div>
          <div className="mt-1 text-[11.5px] text-mute">短片上线后在此置顶播放。拍摄前家长按三级用途签影像授权。</div>
        </div>
      </div>

      <div className="mt-5 border border-ink bg-white p-4">
        <div className="flex items-start gap-4">
          <div className="qr w-[120px] shrink-0 border border-ink bg-white" dangerouslySetInnerHTML={{ __html: svg }} />
          <div className="min-w-0">
            <Kicker>Trace plate QR</Kicker>
            <div className="mt-1 text-[15px] font-black text-ink">{p.name} 溯源牌二维码</div>
            <p className="mt-1 text-[11.5px] leading-relaxed text-body">打印后贴在溯源牌下方。扫码直接打开本页。</p>
            <p className="mt-1 break-all text-[10px] text-mute">{url}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-between gap-2">
        {prev ? <Btn tone="line" onClick={() => go(`point/${s.id}/${prev.w}`)}>‹ {prev.w} {prev.name}</Btn> : <span />}
        {next ? <Btn tone="ink" onClick={() => go(`point/${s.id}/${next.w}`)}>{next.w} {next.name} ›</Btn> : <Btn tone="orange" onClick={() => go(`school/${s.id}`)}>回到路线</Btn>}
      </div>
    </div>
  );
}

/* ---------- 学校填报 ---------- */
const F = ({ label, children, hint }) => (
  <label className="block">
    <span className="text-[11px] font-extrabold text-mute">{label}</span>
    <div className="mt-1">{children}</div>
    {hint && <span className="mt-1 block text-[10.5px] text-mute">{hint}</span>}
  </label>
);
const inputCls = "w-full rounded-md border-[1.5px] border-ink bg-white px-3 py-2 text-[14px] text-ink outline-none focus:ring-2 focus:ring-orange";
function Input(props) { return <input className={inputCls} {...props} />; }
function Textarea(props) { return <textarea className={inputCls + " min-h-[72px]"} {...props} />; }

function useDraft(key, init) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem("ns-draft-" + key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem("ns-draft-" + key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

function PatrolForm({ onDone }) {
  const empty = () => ({ id: "", look: "", reflect: "", fix: "", replace: false, action: "" });
  const [d, setD] = useDraft("patrol", { school: "", route: "", date: "", who: "", weather: "", rows: [empty(), empty(), empty()] });
  const set = (k, v) => setD({ ...d, [k]: v });
  const setRow = (i, k, v) => setD({ ...d, rows: d.rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)) });
  const Tri = ({ i, k }) => (
    <div className="flex gap-1">
      {[["ok", "好"], ["bad", "有问题"]].map(([val, lab]) => (
        <button key={val} type="button" onClick={() => setRow(i, k, val)} className={`rounded px-2 py-1 text-[11px] font-extrabold ${d.rows[i][k] === val ? (val === "ok" ? "bg-green text-cream" : "bg-orange text-ink") : "border border-ink text-ink"}`}>{lab}</button>
      ))}
    </div>
  );
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <F label="学校"><Input value={d.school} onChange={(e) => set("school", e.target.value)} /></F>
        <F label="步道 / 路线编号"><Input value={d.route} onChange={(e) => set("route", e.target.value)} placeholder="如 JS-1" /></F>
        <F label="巡护日期"><Input type="date" value={d.date} onChange={(e) => set("date", e.target.value)} /></F>
        <F label="巡护人"><Input value={d.who} onChange={(e) => set("who", e.target.value)} /></F>
      </div>
      <F label="天气"><Input value={d.weather} onChange={(e) => set("weather", e.target.value)} placeholder="晴 / 雨后 / 大风" /></F>
      <div className="text-[11px] font-extrabold text-mute">逐设施检查（设施编号见设施清册：W 打卡点、S 印章站、P 立柱、M 鞋带标识）</div>
      {d.rows.map((r, i) => (
        <div key={i} className="space-y-2 border border-ink p-3">
          <div className="grid grid-cols-[90px_1fr] items-center gap-2">
            <Input value={r.id} onChange={(e) => setRow(i, "id", e.target.value)} placeholder="P03" />
            <label className="flex items-center gap-2 text-[12px] font-bold text-ink"><input type="checkbox" checked={r.replace} onChange={(e) => setRow(i, "replace", e.target.checked)} />需更换</label>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div><div className="mb-1 text-mute">外观</div><Tri i={i} k="look" /></div>
            <div><div className="mb-1 text-mute">反光</div><Tri i={i} k="reflect" /></div>
            <div><div className="mb-1 text-mute">固定</div><Tri i={i} k="fix" /></div>
          </div>
          <Input value={r.action} onChange={(e) => setRow(i, "action", e.target.value)} placeholder="处理措施（安全问题当场取下）" />
        </div>
      ))}
      <div className="flex gap-2">
        <Btn tone="line" onClick={() => setD({ ...d, rows: [...d.rows, empty()] })}>+ 加一个设施</Btn>
        <Btn tone="orange" onClick={() => onDone(encodeReport("patrol", d))}>生成提交码</Btn>
      </div>
    </div>
  );
}

function ParticipationForm({ onDone }) {
  const [d, setD] = useDraft("participation", { school: "", term: "", girls: "", done: "", who: "", date: "" });
  const set = (k, v) => setD({ ...d, [k]: v });
  const rate = d.girls > 0 && d.done !== "" ? Math.round((Number(d.done) / Number(d.girls)) * 1000) / 10 : null;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <F label="学校"><Input value={d.school} onChange={(e) => set("school", e.target.value)} /></F>
        <F label="学期"><Input value={d.term} onChange={(e) => set("term", e.target.value)} placeholder="2027 春" /></F>
        <F label="全校女生数"><Input type="number" inputMode="numeric" value={d.girls} onChange={(e) => set("girls", e.target.value)} /></F>
        <F label="完成至少 1 次完整路线的女生数" hint="盖满 S1 至 S3 算一次；按项目编号去重，同一人只算一次"><Input type="number" inputMode="numeric" value={d.done} onChange={(e) => set("done", e.target.value)} /></F>
        <F label="统计人"><Input value={d.who} onChange={(e) => set("who", e.target.value)} /></F>
        <F label="统计日期"><Input type="date" value={d.date} onChange={(e) => set("date", e.target.value)} /></F>
      </div>
      <div className="border border-ink bg-peach p-3">
        <Kicker>参与率</Kicker>
        <div className="mt-1 text-[28px] font-black text-ink">{rate === null ? "—" : `${rate}%`}</div>
        <div className="text-[11px] text-mute">= 完成至少 1 次完整路线的女生数 ÷ 全校女生数。各月人数不能相加。</div>
      </div>
      <Btn tone="orange" onClick={() => onDone(encodeReport("participation", { ...d, rate }))}>生成提交码</Btn>
    </div>
  );
}

function FeedbackForm({ onDone }) {
  const [d, setD] = useDraft("feedback", { school: "", route: "", date: "", score: 0, fun: "", unclear: "", change: "", who: "" });
  const set = (k, v) => setD({ ...d, [k]: v });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <F label="学校"><Input value={d.school} onChange={(e) => set("school", e.target.value)} /></F>
        <F label="路线编号"><Input value={d.route} onChange={(e) => set("route", e.target.value)} /></F>
        <F label="日期"><Input type="date" value={d.date} onChange={(e) => set("date", e.target.value)} /></F>
        <F label="填表人（可不填）"><Input value={d.who} onChange={(e) => set("who", e.target.value)} /></F>
      </div>
      <F label="给这条路线打分" hint="请选择一个分数，分数越高代表路线体验越好">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => set("score", n)} className={`h-11 w-11 rounded-full border-2 border-ink text-[15px] font-black ${d.score === n ? "bg-orange text-ink" : "bg-white text-ink"}`}>{n}</button>
          ))}
        </div>
      </F>
      <F label="最好玩的一段"><Textarea value={d.fun} onChange={(e) => set("fun", e.target.value)} /></F>
      <F label="看不清路标的地方" hint="写清在哪个点位附近、往哪个方向走时看不见"><Textarea value={d.unclear} onChange={(e) => set("unclear", e.target.value)} /></F>
      <F label="我们想改的一处"><Textarea value={d.change} onChange={(e) => set("change", e.target.value)} /></F>
      <Btn tone="orange" onClick={() => onDone(encodeReport("feedback", d))}>生成提交码</Btn>
    </div>
  );
}

function Report({ type }) {
  const t = REPORT_LABELS[type] ? type : "patrol";
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => { setCode(""); setCopied(false); }, [t]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); } catch { setCopied(false); }
  };
  const survey = SURVEY_URLS[t];
  const mail = CONTACT.email ? `mailto:${CONTACT.email}?subject=${encodeURIComponent("行远步道填报 " + REPORT_LABELS[t])}&body=${encodeURIComponent(code)}` : "";
  return (
    <div className="mx-auto max-w-[520px] px-4 pt-5">
      <Kicker>For schools</Kicker>
      <h1 className="mt-1 text-[28px] font-black text-ink">学校填报</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-body">和纸质表同一套字段。填完生成一段提交码，复制发给项目组；草稿会留在本机，换页不会丢。</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {Object.entries(REPORT_LABELS).map(([k, label]) => (
          <button key={k} type="button" onClick={() => go(`report/${k}`)} className={`rounded-md border-[1.5px] border-ink px-2 py-2 text-[12px] font-extrabold ${t === k ? "bg-ink text-cream" : "text-ink"}`}>{label}</button>
        ))}
      </div>
      <div className="mt-5">
        {t === "patrol" && <PatrolForm onDone={setCode} />}
        {t === "participation" && <ParticipationForm onDone={setCode} />}
        {t === "feedback" && <FeedbackForm onDone={setCode} />}
      </div>
      {code && (
        <div className="mt-6 border-2 border-ink bg-white p-4">
          <Kicker>提交码</Kicker>
          <textarea readOnly value={code} className="mt-2 h-24 w-full resize-none rounded-md border border-line bg-cream p-2 font-mono text-[11px] text-ink" onFocus={(e) => e.target.select()} />
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn tone="orange" onClick={copy}>{copied ? "已复制" : "复制提交码"}</Btn>
            {mail && <Btn tone="ink" href={mail}>发邮件给项目组</Btn>}
            {survey && <Btn tone="line" href={survey}>在线提交（问卷）</Btn>}
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-mute">把提交码粘贴到微信发给{CONTACT.wechat}。项目组在「解码」页还原成表格。提交码只含你填的内容，不含设备信息。</p>
        </div>
      )}
      <p className="mt-6 text-[11px] text-mute">项目组入口：<button type="button" onClick={() => go("decode")} className="font-extrabold text-orange">解码提交码 ›</button></p>
    </div>
  );
}

function Decode() {
  const [text, setText] = useState("");
  const list = useMemo(() => decodeReports(text), [text]);
  const download = () => {
    const blob = new Blob(["﻿" + reportsToCsv(list)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `行远步道填报-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };
  return (
    <div className="mx-auto max-w-[520px] px-4 pt-5">
      <Kicker>Project team</Kicker>
      <h1 className="mt-1 text-[28px] font-black text-ink">解码提交码</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-body">把学校发来的提交码整段粘贴进来（多条一起粘也行），下面自动还原，可导出 CSV 进 Excel。</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="NS1.…" className="mt-4 h-32 w-full rounded-md border-[1.5px] border-ink bg-white p-3 font-mono text-[12px] text-ink outline-none focus:ring-2 focus:ring-orange" />
      {list.length > 0 && (
        <>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[12px] font-extrabold text-ink">共 {list.length} 条</span>
            <Btn tone="ink" onClick={download}>导出 CSV</Btn>
          </div>
          <div className="mt-3 space-y-3">
            {list.map((r, i) => (
              <div key={i} className="border border-ink p-3">
                <div className="flex items-center justify-between">
                  <Chip tone="orange">{REPORT_LABELS[r.t] || r.t}</Chip>
                  <span className="text-[11px] text-mute">{r.at}</span>
                </div>
                {r.t === "error" ? <div className="mt-2 text-[12px] text-body">无法解析：{r.raw}</div> : (
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[12px] leading-relaxed">
                    {Object.entries(flatten(r.d)).map(([k, v]) => (
                      <React.Fragment key={k}><dt className="text-mute">{labelKey(k)}</dt><dd className="break-all text-ink">{labelValue(v)}</dd></React.Fragment>
                    ))}
                  </dl>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- 工具包 ---------- */
function Kit() {
  return (
    <div className="mx-auto max-w-[520px] px-4 pt-5">
      <Kicker>Field kit</Kicker>
      <h1 className="mt-1 text-[28px] font-black text-ink">行远步道执行工具包</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-body">五册手册、行远护照、实施清单、VI 设计规范和一箱工具。学校从这一箱开始，不需要定向运动经验。</p>
      <ul className="mt-5 divide-y divide-line border-y border-ink">
        {KIT_BOOKS.map((b) => (
          <li key={b.code} className="flex items-center gap-3 py-3">
            <span className="inline-flex h-12 w-10 items-center justify-center rounded-lg border border-ink text-[13px] font-black" style={{ background: b.color, color: b.ink }}>{b.code}</span>
            <div className="flex-1">
              <div className="text-[15px] font-black text-ink">{b.name}</div>
              <div className="text-[11.5px] text-mute">主要读者：{b.who}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 border border-ink bg-peach p-4">
        <Kicker>从哪一本开始读</Kicker>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink">校长先读管理者册；老师先读教师册「开线前的四道关口」；志愿者先读施工册；女生从学生册第一页开始。</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Btn tone="ink" href={EBOOK_URL}>打开电子书</Btn>
        <Btn tone="line" onClick={() => go("report")}>学校填报</Btn>
      </div>
      <p className="mt-2 text-[11px] text-mute">电子书为项目组内部链接，需项目组开放分享后可打开；印刷版随工具箱交付。</p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-[520px] px-4 pt-10 text-center">
      <div className="text-[40px] font-black text-orange">?</div>
      <p className="mt-2 text-[14px] text-body">没有这一页。</p>
      <div className="mt-4"><Btn tone="ink" onClick={() => go("")}>回首页</Btn></div>
    </div>
  );
}

export default function App() {
  const route = useRoute();
  const [a, b, c] = route;
  let page;
  if (!a) page = <Home />;
  else if (a === "schools") page = <Schools />;
  else if (a === "school") page = <School id={b} />;
  else if (a === "point") page = <Point sid={b} w={c} />;
  else if (a === "report") page = <Report type={b} />;
  else if (a === "decode") page = <Decode />;
  else if (a === "kit") page = <Kit />;
  else page = <NotFound />;
  return (
    <div className="min-h-screen bg-cream text-ink">
      <TopBar route={route} />
      <main className="pb-6">{page}</main>
      <Footer />
    </div>
  );
}
