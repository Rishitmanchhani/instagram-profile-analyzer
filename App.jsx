import { useState } from "react";

const C = {
  primary: "#5B8CFF", secondary: "#7B61FF", accent: "#FF4FA3",
  bg: "#F5F7FA", text: "#111827", muted: "#6B7280",
  green: "#10B981", yellow: "#F59E0B", red: "#EF4444",
};

const LOADING_MSGS = [
  "Fetching Instagram profile...", "Collecting content data...",
  "Analyzing engagement patterns...", "Understanding audience behavior...",
  "Generating AI insights...", "Building final report...",
];

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter',sans-serif;background:#F5F7FA;overflow-x:hidden;}
  ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(91,140,255,0.3);border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(0.95)}}
  @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  .fade-up{animation:fadeUp 0.6s ease both;}
  .glass{background:rgba(255,255,255,0.55);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.5);border-radius:24px;box-shadow:0 8px 32px rgba(91,140,255,0.08),0 2px 8px rgba(0,0,0,0.04);}
  .glass-card{background:rgba(255,255,255,0.6);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.55);border-radius:20px;box-shadow:0 4px 24px rgba(91,140,255,0.07),0 1px 4px rgba(0,0,0,0.03);transition:transform 0.25s,box-shadow 0.25s;}
  .glass-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(91,140,255,0.14),0 4px 12px rgba(0,0,0,0.06);}
  .btn-primary{background:linear-gradient(135deg,#5B8CFF,#7B61FF);color:#fff;border:none;border-radius:14px;padding:0.8rem 1.6rem;font-size:15px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.25s;box-shadow:0 4px 20px rgba(91,140,255,0.35);}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(91,140,255,0.5);}
  .btn-ghost{background:rgba(255,255,255,0.7);color:#374151;border:1px solid rgba(255,255,255,0.6);border-radius:14px;padding:0.8rem 1.6rem;font-size:14px;font-weight:500;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;backdrop-filter:blur(10px);}
  .btn-ghost:hover{background:rgba(255,255,255,0.9);transform:translateY(-1px);}
  input{background:transparent;border:none;outline:none;font-family:'Inter',sans-serif;color:#111827;font-size:15px;}
  input::placeholder{color:#9CA3AF;}
`;

// ── safe helpers ──────────────────────────────────────────────
function strVal(v) {
  if (v == null) return null;
  if (typeof v === "string") return v.trim() || null;
  if (typeof v === "number") return String(v);
  if (typeof v === "object") {
    return v.primary || v.name || v.label ||
      Object.values(v).find(function(x){ return typeof x === "string"; }) || null;
  }
  return null;
}

function arrVal(v) {
  if (Array.isArray(v)) return v;
  if (v && typeof v === "object") {
    return Object.values(v).filter(function(x){ return typeof x === "string"; });
  }
  return [];
}

function numFmt(v) {
  if (v == null) return null;
  if (typeof v === "number") return v.toLocaleString();
  return String(v);
}

// ── UI helpers ────────────────────────────────────────────────
function GradientText(props) {
  return (
    <span style={Object.assign({
      background: "linear-gradient(135deg,#5B8CFF,#7B61FF,#FF4FA3)",
      backgroundSize: "200% 200%",
      animation: "gradShift 4s ease infinite",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }, props.style || {})}>{props.children}</span>
  );
}

function GlassCard(props) {
  return (
    <div className={"glass-card " + (props.className || "")}
      style={Object.assign({ padding: "1.5rem" }, props.style || {})}>
      {props.children}
    </div>
  );
}

function SectionLabel(props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.25rem" }}>
      <span style={{ fontSize: 16 }}>{props.icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{props.label}</span>
    </div>
  );
}

function GradientBar(props) {
  var value = props.value;
  var colors = props.colors || ["#5B8CFF", "#7B61FF"];
  var height = props.height || 7;
  var num = Math.min(parseFloat(value) || 0, 100);
  return (
    <div style={{ background: "rgba(91,140,255,0.12)", borderRadius: 999, height: height, overflow: "hidden" }}>
      <div style={{ width: num + "%", height: "100%", background: "linear-gradient(90deg," + colors[0] + "," + colors[1] + ")", borderRadius: 999, transition: "width 1s ease" }} />
    </div>
  );
}

function Tag(props) {
  var color = props.color || C.primary;
  return (
    <span style={{ background: color + "18", color: color, border: "1px solid " + color + "30", borderRadius: 20, padding: "0.25rem 0.8rem", fontSize: 12, fontWeight: 600 }}>
      {props.children}
    </span>
  );
}

function PageBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#F5F7FA 0%,#E8EEFF 35%,#EFD8FF 65%,#FFE0F3 100%)" }} />
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 700, height: 700, background: "radial-gradient(circle,rgba(91,140,255,0.22) 0%,transparent 65%)", filter: "blur(10px)" }} />
      <div style={{ position: "absolute", top: "20%", right: "-8%", width: 600, height: 600, background: "radial-gradient(circle,rgba(255,79,163,0.18) 0%,transparent 65%)", filter: "blur(10px)" }} />
      <div style={{ position: "absolute", bottom: "-5%", left: "30%", width: 500, height: 500, background: "radial-gradient(circle,rgba(123,97,255,0.14) 0%,transparent 65%)", filter: "blur(8px)" }} />
    </div>
  );
}

// ── LOADING ───────────────────────────────────────────────────
function LoadingScreen(props) {
  var username = props.username;
  var [idx, setIdx] = useState(0);
  var [prog, setProg] = useState(0);
  useState(function() {
    var t1 = setInterval(function(){ setIdx(function(i){ return Math.min(i + 1, LOADING_MSGS.length - 1); }); }, 950);
    var t2 = setInterval(function(){ setProg(function(p){ return Math.min(p + 1.4, 95); }); }, 75);
    return function(){ clearInterval(t1); clearInterval(t2); };
  });
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", fontFamily: "Inter,sans-serif" }}>
      <PageBg />
      <div className="glass fade-up" style={{ padding: "3rem 2.5rem", textAlign: "center", maxWidth: 440, width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#5B8CFF,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.75rem", boxShadow: "0 0 40px rgba(91,140,255,0.4)" }}>
          <svg style={{ animation: "spin 1.4s linear infinite" }} width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "0.4rem" }}>Analyzing <GradientText>{"@" + username}</GradientText></h2>
        <p style={{ color: C.muted, marginBottom: "2rem", fontSize: 14, minHeight: 22 }}>
          {LOADING_MSGS[idx]}<span style={{ animation: "blink 1s infinite", display: "inline-block" }}>_</span>
        </p>
        <div style={{ background: "rgba(91,140,255,0.1)", borderRadius: 999, height: 6, overflow: "hidden", marginBottom: "0.75rem", border: "1px solid rgba(91,140,255,0.2)" }}>
          <div style={{ width: prog + "%", height: "100%", background: "linear-gradient(90deg,#5B8CFF,#7B61FF,#FF4FA3)", borderRadius: 999, transition: "width 0.2s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: C.muted }}>Processing...</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>{Math.round(prog)}%</span>
        </div>
      </div>
    </div>
  );
}

// ── ERROR ─────────────────────────────────────────────────────
function ErrorScreen(props) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", fontFamily: "Inter,sans-serif" }}>
      <PageBg />
      <div className="glass fade-up" style={{ padding: "3rem 2.5rem", textAlign: "center", maxWidth: 440, width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 48, marginBottom: "1rem" }}>⚠️</div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem" }}>Analysis Failed</h2>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, marginBottom: "2rem" }}>{props.message}</p>
        <button className="btn-primary" onClick={props.onRetry}>← Try Again</button>
      </div>
    </div>
  );
}

// ── HERO ──────────────────────────────────────────────────────
function HeroPage(props) {
  var [val, setVal] = useState("");
  var [focused, setFocused] = useState(false);
  function submit() {
    var u = val.trim().replace(/^@/, "");
    if (u) props.onAnalyze(u);
  }
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", position: "relative", fontFamily: "Inter,sans-serif" }}>
      <PageBg />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 680, width: "100%" }}>
        <div className="fade-up glass" style={{ borderRadius: 999, padding: "0.45rem 1.1rem", fontSize: 12, fontWeight: 600, color: C.secondary, display: "flex", alignItems: "center", gap: 7, marginBottom: "2rem" }}>
          <span style={{ width: 7, height: 7, background: "linear-gradient(135deg,#5B8CFF,#FF4FA3)", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
          AI-Powered Instagram Intelligence
        </div>
        <h1 className="fade-up" style={{ animationDelay: "0.1s", fontSize: "clamp(2.4rem,6vw,4.2rem)", fontWeight: 900, textAlign: "center", lineHeight: 1.08, letterSpacing: "-0.04em", color: C.text, marginBottom: "1.25rem" }}>
          Instagram Profile<br /><GradientText>Analyzer</GradientText>
        </h1>
        <p className="fade-up" style={{ animationDelay: "0.2s", fontSize: "clamp(1rem,2vw,1.15rem)", color: C.muted, textAlign: "center", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 520 }}>
          Get AI-powered insights into any public Instagram profile. Analyze content strategy, audience engagement, and growth patterns.
        </p>
        <div className="fade-up" style={{ animationDelay: "0.3s", width: "100%", maxWidth: 520 }}>
          <div className="glass" style={{ borderRadius: 24, padding: "0.55rem 0.55rem 0.55rem 1.4rem", display: "flex", alignItems: "center", gap: "0.5rem", border: focused ? "1.5px solid rgba(91,140,255,0.5)" : "1px solid rgba(255,255,255,0.5)", boxShadow: focused ? "0 0 0 4px rgba(91,140,255,0.1),0 8px 32px rgba(91,140,255,0.1)" : "0 8px 32px rgba(91,140,255,0.08)", transition: "all 0.25s" }}>
            <span style={{ color: "#9CA3AF", fontSize: 15, flexShrink: 0 }}>@</span>
            <input style={{ flex: 1 }} placeholder="Enter Instagram username" value={val}
              onChange={function(e){ setVal(e.target.value); }}
              onKeyDown={function(e){ if (e.key === "Enter") submit(); }}
              onFocus={function(){ setFocused(true); }}
              onBlur={function(){ setFocused(false); }} />
            <button className="btn-primary" onClick={submit} style={{ borderRadius: 18, padding: "0.75rem 1.4rem", fontSize: 14, flexShrink: 0 }}>Analyze →</button>
          </div>
        </div>
        <div className="fade-up" style={{ animationDelay: "0.4s", display: "flex", gap: "1.5rem", marginTop: "3rem", flexWrap: "wrap", justifyContent: "center" }}>
          {[["🎯","Niche Detection"],["📊","Engagement Stats"],["💡","AI Recommendations"],["🚀","Growth Insights"]].map(function(item) {
            return (
              <div key={item[1]} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 16 }}>{item[0]}</span>
                <span style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>{item[1]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────
var FMT_COLORS = [["#5B8CFF","#7B61FF"],["#10B981","#059669"],["#F59E0B","#D97706"],["#FF4FA3","#FF6B35"]];

function Dashboard(props) {
  var username = props.username;
  var onReset = props.onReset;

  // ── unwrap report ──
  // Handles: { analysis: "JSON string", cached: bool }  ← current n8n shape
  //          { username, report: {...} }
  //          flat report object
  var raw = props.data;
  var d;
  if (raw && typeof raw.analysis === "string") {
    try { d = JSON.parse(raw.analysis); } catch(e) { d = {}; }
  } else if (raw && raw.report && typeof raw.report === "object") {
    d = raw.report;
  } else {
    d = raw || {};
  }

  // ── section pointers ──
  var profile    = d.profile_overview    || d.profile    || {};
  var niche      = d.niche_detection     || d.niche      || {};
  var posting    = d.posting_analysis    || d.posting    || {};
  var content    = d.content_analysis    || d.content    || {};
  var engagement = d.engagement_analysis || d.engagement || {};
  var topPosts   = Array.isArray(d.top_posts)  ? d.top_posts
                 : Array.isArray(d.topPosts)   ? d.topPosts : [];
  var audience   = d.audience_insights   || d.audience   || {};

  // content_gaps: array OR object {underutilized_formats, missing_topics}
  var gaps = [];
  if (Array.isArray(d.content_gaps)) {
    gaps = d.content_gaps;
  } else if (d.content_gaps && typeof d.content_gaps === "object") {
    var cg = d.content_gaps;
    if (Array.isArray(cg.underutilized_formats)) {
      cg.underutilized_formats.forEach(function(f){ gaps.push({ gap: "Underutilized Format", opportunity: f }); });
    }
    if (Array.isArray(cg.missing_topics)) {
      cg.missing_topics.forEach(function(t){ gaps.push({ gap: "Missing Topic", opportunity: t }); });
    }
  }

  var recs = Array.isArray(d.recommendations) ? d.recommendations : [];

  // ── posting fields ──
  var postingFreq  = strVal(posting.posting_frequency || posting.frequency
    || (typeof d.posting_frequency === "string" ? d.posting_frequency : null));
  var avgPerWeek   = posting.average_posts_per_week;
  var consistScore = posting.consistency_score || posting.consistencyScore;
  var bestTimes    = arrVal(posting.best_posting_times || posting.best_times || posting.bestTimes);
  var bestSingle   = posting.best_posting_time_estimate;

  // ── content fields ──
  var themes = arrVal(content.themes || content.content_themes);
  // handle object-style content_themes: { theme_1, theme_2, theme_3 }
  if (themes.length === 0 && content.content_themes && typeof content.content_themes === "object" && !Array.isArray(content.content_themes)) {
    themes = Object.values(content.content_themes).filter(function(x){ return typeof x === "string"; });
  }

  // format_breakdown OR content_mix → normalise to percentages
  var rawFmt = content.format_breakdown || content.formatBreakdown || posting.content_mix || {};
  var fmtEntries = Object.entries(rawFmt);
  var fmtTotal = fmtEntries.reduce(function(acc, kv){ return acc + (parseFloat(kv[1]) || 0); }, 0);
  var fmtNorm = {};
  fmtEntries.forEach(function(kv) {
    var label = kv[0].charAt(0).toUpperCase() + kv[0].slice(1);
    fmtNorm[label] = fmtTotal > 0 ? Math.round((parseFloat(kv[1]) / fmtTotal) * 100) : (parseFloat(kv[1]) || 0);
  });

  // ── engagement fields ──
  var engRate     = engagement.engagement_rate ?? engagement.rate;
  var avgLikes    = engagement.average_likes    ?? engagement.avgLikes    ?? audience.average_likes_per_post;
  var avgComments = engagement.average_comments ?? engagement.avgComments ?? audience.average_comments_per_post;
  var overallSent = strVal(engagement.overall_sentiment || engagement.sentiment || engagement.engagement_quality);
  var sentBreak   = engagement.sentiment_breakdown || engagement.sentimentBreakdown || {};
  var perfSummary = engagement.performance_summary;
  var engReasons  = Array.isArray(engagement.reasons) ? engagement.reasons : [];

  // format engagement_rate nicely
  var engRateStr = null;
  if (engRate != null) {
    engRateStr = typeof engRate === "number"
      ? (engRate < 1 ? (engRate * 100).toFixed(2) + "%" : engRate + "%")
      : String(engRate);
  }

  // ── audience fields ──
  var audienceTypeStr = strVal(audience.audience_type || audience.type
    || (audience.primary_audience ? { primary: audience.primary_audience } : null));
  var growthTraj = strVal(audience.growth_trajectory || audience.trajectory);
  var audienceInts = arrVal(audience.audience_interests || audience.interests);
  var ageGroup = audience.age_group_estimate;
  var audStrengths = arrVal(audience.strengths);
  var audWeaknesses = arrVal(audience.weaknesses);

  // ── niche secondary ──
  var nicheSecondary = Array.isArray(niche.secondary_niches)
    ? niche.secondary_niches[0]
    : strVal(niche.secondary_niche || niche.secondary);
  var nicheExtraList = Array.isArray(niche.secondary_niches) && niche.secondary_niches.length > 1
    ? niche.secondary_niches.slice(1) : [];

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter,sans-serif", color: C.text, position: "relative" }}>
      <PageBg />

      {/* topbar */}
      <div className="glass" style={{ position: "sticky", top: 0, zIndex: 100, borderRadius: 0, borderLeft: 0, borderRight: 0, borderTop: 0, padding: "0.9rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#5B8CFF,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(91,140,255,0.35)" }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Analysis Report</div>
            <div style={{ fontSize: 11, color: C.muted }}>@{profile.username || username}</div>
          </div>
        </div>
        <button className="btn-ghost" onClick={onReset} style={{ fontSize: 13, padding: "0.5rem 1rem" }}>← New Analysis</button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem", position: "relative", zIndex: 1 }}>

        {/* ── Profile Overview ── */}
        <section style={{ marginBottom: "1.5rem" }}>
          <SectionLabel icon="👤" label="Profile Overview" />
          <GlassCard>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "flex-start" }}>
              <div style={{ position: "relative" }}>
                {profile.profile_picture_url ? (
                  <img src={profile.profile_picture_url} alt="" style={{ width: 76, height: 76, borderRadius: "50%", border: "2.5px solid rgba(91,140,255,0.4)", objectFit: "cover" }} onError={function(e){ e.target.style.display="none"; }} />
                ) : (
                  <div style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg,#5B8CFF,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff" }}>
                    {(profile.full_name || profile.name || username || "?")[0].toUpperCase()}
                  </div>
                )}
                {(profile.is_verified || profile.verified) && (
                  <span style={{ position: "absolute", bottom: 2, right: 2, background: "linear-gradient(135deg,#5B8CFF,#7B61FF)", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 4 }}>{profile.full_name || profile.name || username}</h2>
                <p style={{ marginBottom: 8 }}><GradientText style={{ fontSize: 13, fontWeight: 600 }}>@{profile.username || username}</GradientText></p>
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65 }}>{profile.bio || profile.biography || profile.bio_summary || "—"}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                ["Followers", profile.followers_count != null ? profile.followers_count : profile.followers, ["#5B8CFF","#7B61FF"]],
                ["Following", profile.following_count != null ? profile.following_count : profile.following, ["#10B981","#059669"]],
                ["Posts",     profile.posts_count     != null ? profile.posts_count     : (profile.media_count != null ? profile.media_count : profile.totalPosts), ["#F59E0B","#D97706"]],
              ].filter(function(item){ return item[1] != null; }).map(function(item) {
                return (
                  <div key={item[0]} style={{ background: "rgba(255,255,255,0.6)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.6)", padding: "1rem", textAlign: "center" }}>
                    <div style={{ fontSize: "1.35rem", fontWeight: 800, background: "linear-gradient(135deg," + item[2][0] + "," + item[2][1] + ")", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{numFmt(item[1])}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item[0]}</div>
                  </div>
                );
              })}
            </div>

            {(profile.account_summary || profile.summary) && (
              <div style={{ background: "linear-gradient(135deg,rgba(91,140,255,0.08),rgba(123,97,255,0.06))", borderRadius: 14, padding: "1rem", border: "1px solid rgba(91,140,255,0.15)" }}>
                <p style={{ color: "#4B5563", fontSize: 14, lineHeight: 1.65 }}>{profile.account_summary || profile.summary}</p>
              </div>
            )}
          </GlassCard>
        </section>

        {/* ── Niche + Posting ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {Object.keys(niche).length > 0 && (
            <GlassCard>
              <SectionLabel icon="🎯" label="Niche Detection" />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {[
                  ["Primary Niche",     strVal(niche.primary_niche || niche.primary), C.primary],
                  ["Secondary Niche",   nicheSecondary, C.secondary],
                  ["Audience Category", strVal(niche.audience_category || niche.audienceCategory), C.accent],
                ].filter(function(item){ return item[1]; }).map(function(item) {
                  return (
                    <div key={item[0]} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                      <span style={{ fontSize: 13, color: C.muted }}>{item[0]}</span>
                      <Tag color={item[2]}>{item[1]}</Tag>
                    </div>
                  );
                })}
                {nicheExtraList.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {nicheExtraList.map(function(n, i){ return <Tag key={i} color={C.secondary}>{n}</Tag>; })}
                  </div>
                )}
                {niche.confidence_score != null && (
                  <div style={{ marginTop: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: C.muted }}>Confidence Score</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.secondary }}>{niche.confidence_score}%</span>
                    </div>
                    <GradientBar value={niche.confidence_score} colors={["#5B8CFF","#7B61FF"]} />
                  </div>
                )}
                {niche.reasoning && (
                  <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginTop: 4 }}>{niche.reasoning}</p>
                )}
              </div>
            </GlassCard>
          )}

          <GlassCard>
            <SectionLabel icon="🕐" label="Posting Analysis" />
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {postingFreq && (
                <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.6)", padding: "0.85rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{postingFreq}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Posting Frequency</div>
                </div>
              )}
              {avgPerWeek != null && (
                <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.6)", padding: "0.85rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{avgPerWeek}× per week</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Avg Posts / Week</div>
                </div>
              )}
              {consistScore != null && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: C.muted }}>Consistency</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.secondary }}>{consistScore}%</span>
                  </div>
                  <GradientBar value={consistScore} colors={["#5B8CFF","#7B61FF"]} height={8} />
                </div>
              )}
              {posting.consistency && (
                <div style={{ background: "rgba(91,140,255,0.07)", borderRadius: 10, padding: "0.6rem 0.8rem", fontSize: 13, color: C.secondary, fontWeight: 500 }}>{posting.consistency}</div>
              )}
              {bestTimes.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Best Times</p>
                  {bestTimes.map(function(t, i) {
                    return (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "0.5rem 0.75rem", background: "rgba(251,188,5,0.08)", borderRadius: 10, border: "1px solid rgba(251,188,5,0.2)", marginBottom: 6 }}>
                        <span style={{ color: C.yellow }}>⏰</span>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{t}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {bestSingle && bestTimes.length === 0 && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "0.5rem 0.75rem", background: "rgba(251,188,5,0.08)", borderRadius: 10, border: "1px solid rgba(251,188,5,0.2)" }}>
                  <span style={{ color: C.yellow }}>⏰</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{bestSingle}</span>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* ── Content + Engagement ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <GlassCard>
            <SectionLabel icon="📝" label="Content Analysis" />
            {themes.length > 0 && (
              <div style={{ marginBottom: "1.25rem" }}>
                <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Themes</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {themes.map(function(t, i) {
                    return <span key={i} style={{ background: "rgba(91,140,255,0.08)", color: C.secondary, border: "1px solid rgba(91,140,255,0.2)", borderRadius: 20, padding: "0.25rem 0.75rem", fontSize: 12, fontWeight: 500 }}>{t}</span>;
                  })}
                </div>
              </div>
            )}
            {Object.keys(fmtNorm).length > 0 && (
              <div style={{ marginBottom: "1.25rem" }}>
                <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Format Breakdown</p>
                {Object.keys(fmtNorm).map(function(k, i) {
                  var v = fmtNorm[k];
                  var colors = FMT_COLORS[i] || FMT_COLORS[0];
                  return (
                    <div key={k} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{k}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: colors[0] }}>{v}%</span>
                      </div>
                      <GradientBar value={v} colors={colors} />
                    </div>
                  );
                })}
              </div>
            )}
            {(content.caption_style || content.captionStyle || content.content_style) && (
              <div style={{ background: "rgba(16,185,129,0.07)", borderRadius: 12, padding: "0.8rem", border: "1px solid rgba(16,185,129,0.18)", marginBottom: 8 }}>
                <p style={{ margin: 0, fontSize: 12, color: "#047857" }}><b>Caption Style:</b> {content.caption_style || content.captionStyle || content.content_style}</p>
              </div>
            )}
            {content.hashtag_strategy && (
              <div style={{ background: "rgba(91,140,255,0.06)", borderRadius: 12, padding: "0.8rem", border: "1px solid rgba(91,140,255,0.15)" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#1e40af" }}><b>Hashtag Strategy:</b> {content.hashtag_strategy}</p>
              </div>
            )}
          </GlassCard>

          <GlassCard>
            <SectionLabel icon="📊" label="Engagement Analysis" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                ["Eng. Rate",    engRateStr],
                ["Avg Likes",    numFmt(avgLikes)],
                ["Avg Comments", numFmt(avgComments)],
                ["Sentiment",    overallSent],
              ].filter(function(item){ return item[1] != null; }).map(function(item, i) {
                var gradients = [["#5B8CFF","#7B61FF"],["#FF4FA3","#FF6B35"],["#10B981","#059669"],["#F59E0B","#D97706"]];
                var g = gradients[i] || gradients[0];
                return (
                  <div key={item[0]} style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: 14, padding: "0.9rem" }}>
                    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{item[0]}</div>
                    <div style={{ fontSize: "1.15rem", fontWeight: 800, background: "linear-gradient(135deg," + g[0] + "," + g[1] + ")", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{item[1]}</div>
                  </div>
                );
              })}
            </div>
            {perfSummary && (
              <div style={{ background: "rgba(91,140,255,0.07)", borderRadius: 12, padding: "0.8rem", border: "1px solid rgba(91,140,255,0.15)", marginBottom: "1rem" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#1e40af", lineHeight: 1.6 }}>{perfSummary}</p>
              </div>
            )}
            {Object.keys(sentBreak).length > 0 && (
              <div>
                <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Comment Sentiment</p>
                <div style={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden", gap: 2, marginBottom: 8 }}>
                  {Object.keys(sentBreak).map(function(k, i) {
                    var bgs = ["linear-gradient(90deg,#10B981,#059669)","linear-gradient(90deg,#F59E0B,#D97706)","linear-gradient(90deg,#FF4FA3,#EF4444)"];
                    return <div key={k} style={{ width: sentBreak[k] + "%", height: "100%", background: bgs[i] || "#ccc", borderRadius: 999 }} />;
                  })}
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {Object.keys(sentBreak).map(function(k, i) {
                    var colors = ["#10B981","#F59E0B","#EF4444"];
                    return <span key={k} style={{ fontSize: 12, color: C.muted }}><span style={{ fontWeight: 700, color: colors[i] || C.muted }}>{sentBreak[k]}%</span> {k}</span>;
                  })}
                </div>
              </div>
            )}
            {engReasons.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Key Factors</p>
                {engReasons.map(function(r, i) {
                  return (
                    <div key={i} style={{ fontSize: 13, color: C.muted, display: "flex", gap: 6, marginBottom: 6 }}>
                      <span style={{ color: C.primary, fontWeight: 700, flexShrink: 0 }}>→</span>{r}
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>

        {/* ── Top Posts ── */}
        {topPosts.length > 0 && (
          <section style={{ marginBottom: "1.5rem" }}>
            <SectionLabel icon="🏆" label="Top Performing Posts" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "1rem" }}>
              {topPosts.map(function(p, i) {
                var likes    = p.likes    != null ? p.likes    : p.like_count;
                var comments = p.comments != null ? p.comments : p.comment_count;
                var imgSrc   = p.thumbnail_url || p.thumbnail || p.image_url;
                return (
                  <div key={i} className="glass-card" style={{ overflow: "hidden", padding: 0 }}>
                    {imgSrc ? (
                      <div style={{ position: "relative" }}>
                        <img src={imgSrc} alt="" style={{ width: "100%", height: 155, objectFit: "cover", display: "block" }} onError={function(e){ e.target.style.display="none"; }} />
                        <div style={{ position: "absolute", top: 10, left: 10, background: "linear-gradient(135deg,#5B8CFF,#7B61FF)", color: "#fff", borderRadius: 8, padding: "0.2rem 0.6rem", fontSize: 11, fontWeight: 700 }}>{"#" + (i+1)}</div>
                        {(p.type || p.media_type) && <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", color: "#fff", borderRadius: 8, padding: "0.2rem 0.6rem", fontSize: 10, fontWeight: 600 }}>{p.type || p.media_type}</div>}
                      </div>
                    ) : (
                      <div style={{ background: "linear-gradient(135deg,rgba(91,140,255,0.12),rgba(123,97,255,0.08))", height: 60, display: "flex", alignItems: "center", paddingLeft: "1rem", gap: 10 }}>
                        <div style={{ background: "linear-gradient(135deg,#5B8CFF,#7B61FF)", color: "#fff", borderRadius: 8, padding: "0.2rem 0.7rem", fontSize: 13, fontWeight: 700 }}>{"#" + (i+1)}</div>
                        {(p.type || p.media_type) && <Tag color={C.primary}>{p.type || p.media_type}</Tag>}
                        {p.url && <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: C.primary, marginLeft: "auto", marginRight: "1rem" }}>View ↗</a>}
                      </div>
                    )}
                    <div style={{ padding: "1rem" }}>
                      {p.caption && <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.caption}</p>}
                      <div style={{ display: "flex", gap: 14, marginBottom: 10, flexWrap: "wrap" }}>
                        {likes != null && <span style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>❤ {numFmt(likes)}</span>}
                        {comments != null && <span style={{ fontSize: 12, fontWeight: 600, color: C.primary }}>💬 {numFmt(comments)}</span>}
                        {p.engagement_rate != null && <span style={{ fontSize: 12, fontWeight: 600, color: C.secondary }}>📊 {p.engagement_rate}</span>}
                      </div>
                      {(p.ai_explanation || p.reason || p.why_it_performed) && (
                        <div style={{ background: "rgba(16,185,129,0.07)", borderRadius: 9, padding: "0.55rem 0.7rem", border: "1px solid rgba(16,185,129,0.18)" }}>
                          <p style={{ margin: 0, fontSize: 12, color: "#047857", lineHeight: 1.5 }}>{p.ai_explanation || p.reason || p.why_it_performed}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Audience Insights ── */}
        {Object.keys(audience).length > 0 && (
          <section style={{ marginBottom: "1.5rem" }}>
            <SectionLabel icon="👥" label="Audience Insights" />
            <GlassCard>
              {audienceTypeStr && (
                <div style={{ background: "linear-gradient(135deg,rgba(91,140,255,0.07),rgba(123,97,255,0.05))", borderRadius: 14, padding: "1rem", border: "1px solid rgba(91,140,255,0.15)", marginBottom: "1.25rem" }}>
                  <p style={{ color: "#374151", fontSize: 14, fontWeight: 500 }}>{audienceTypeStr}</p>
                  {ageGroup && <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Age group: {ageGroup}</p>}
                </div>
              )}
              {growthTraj && <p style={{ fontSize: 13, color: C.secondary, fontWeight: 600, marginBottom: "1.25rem" }}>📈 {growthTraj}</p>}
              {audienceInts.length > 0 && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Interests</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {audienceInts.map(function(t, i){ return <Tag key={i} color={C.secondary}>{t}</Tag>; })}
                  </div>
                </div>
              )}
              {(audStrengths.length > 0 || audWeaknesses.length > 0) && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
                  {audStrengths.length > 0 && (
                    <div>
                      <p style={{ fontSize: 11, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Strengths</p>
                      {audStrengths.map(function(s, i){ return <div key={i} style={{ fontSize: 13, color: C.muted, display: "flex", gap: 6, marginBottom: 6, alignItems: "flex-start" }}><span style={{ color: C.green, flexShrink: 0, fontWeight: 700 }}>✓</span>{s}</div>; })}
                    </div>
                  )}
                  {audWeaknesses.length > 0 && (
                    <div>
                      <p style={{ fontSize: 11, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weaknesses</p>
                      {audWeaknesses.map(function(w, i){ return <div key={i} style={{ fontSize: 13, color: C.muted, display: "flex", gap: 6, marginBottom: 6, alignItems: "flex-start" }}><span style={{ color: C.accent, flexShrink: 0, fontWeight: 700 }}>✗</span>{w}</div>; })}
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </section>
        )}

        {/* ── Content Gaps ── */}
        {gaps.length > 0 && (
          <section style={{ marginBottom: "1.5rem" }}>
            <SectionLabel icon="🔍" label="Content Gaps & Opportunities" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "0.85rem" }}>
              {gaps.map(function(g, i) {
                var gapTitle = typeof g === "string" ? g : (g.gap || g.title || g.missing_content || "Gap");
                var gapBody  = typeof g === "string" ? "" : (g.opportunity || g.description || g.growth_opportunity || "");
                return (
                  <GlassCard key={i} style={{ borderLeft: "3px solid " + C.accent }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                      <span>🎯</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{gapTitle}</span>
                    </div>
                    {gapBody && <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{gapBody}</p>}
                  </GlassCard>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Recommendations ── */}
        {recs.length > 0 && (
          <section style={{ marginBottom: "1.5rem" }}>
            <SectionLabel icon="💡" label="AI Recommendations" />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {recs.map(function(r, i) {
                return (
                  <GlassCard key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#5B8CFF,#7B61FF)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, boxShadow: "0 4px 12px rgba(91,140,255,0.3)" }}>{i+1}</div>
                    <div style={{ flex: 1 }}>
                      {typeof r === "string" ? (
                        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>{r}</p>
                      ) : (
                        <div>
                          {(r.title || r.recommendation) && <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{r.title || r.recommendation}</h4>}
                          {r.description && <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: (r.expected_impact || r.impact) ? 8 : 0 }}>{r.description}</p>}
                          {(r.expected_impact || r.impact) && <span style={{ fontSize: 12, color: C.secondary, fontWeight: 600 }}>📈 Expected: {r.expected_impact || r.impact}</span>}
                        </div>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Export ── */}
        <section>
          <GlassCard style={{ textAlign: "center", background: "linear-gradient(135deg,rgba(91,140,255,0.07),rgba(255,79,163,0.05))", border: "1px solid rgba(91,140,255,0.18)" }}>
            <div style={{ fontSize: 40, marginBottom: "0.75rem" }}>✨</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 6 }}>Export Your Report</h3>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: "1.5rem" }}>Save or share the full analysis for <GradientText>{"@" + username}</GradientText></p>
            <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={function(){ window.print(); }}>📄 Download PDF</button>
              <button className="btn-ghost" onClick={function(){ navigator.clipboard.writeText("Instagram Analysis — @" + username); }}>📋 Copy Report</button>
              <button className="btn-ghost" onClick={onReset}>🔄 Analyze Another</button>
            </div>
          </GlassCard>
        </section>

      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────
export default function App() {
  var [phase,    setPhase]    = useState("hero");
  var [username, setUsername] = useState("");
  var [results,  setResults]  = useState(null);
  var [errorMsg, setErrorMsg] = useState("");

  async function handleAnalyze(uname) {
    setUsername(uname);
    setPhase("loading");
    setErrorMsg("");
    try {
      var webhookUrl = "https://okrishit.app.n8n.cloud/webhook/instagram-analyzer";
      var response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: uname }),
      });
      if (!response.ok) throw new Error("Server error: " + response.status + ". Check your n8n workflow.");
      var raw = await response.json();

      // Unwrap array wrapper if present: [{ analysis: "...", cached: bool }]
      var item = Array.isArray(raw) ? raw[0] : raw;

      // Shape A: { analysis: "JSON string" }  ← current n8n output
      // Shape B: { username, report: {...} }
      // Shape C: flat report object
      var report;
      if (item && typeof item.analysis === "string") {
        report = JSON.parse(item.analysis);
      } else if (item && item.report && typeof item.report === "object") {
        report = item.report;
        if (report.profile_overview && !report.profile_overview.username) {
          report.profile_overview.username = item.username || uname;
        }
      } else {
        report = item;
      }

      if (!report || typeof report !== "object") throw new Error("Unexpected response format from n8n.");
      setResults(report);
      setPhase("results");
    } catch(err) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setPhase("error");
    }
  }

  function handleReset() { setPhase("hero"); setUsername(""); setResults(null); setErrorMsg(""); }

  return (
    <div>
      <style>{globalCss}</style>
      {phase === "hero"    && <HeroPage onAnalyze={handleAnalyze} />}
      {phase === "loading" && <LoadingScreen username={username} />}
      {phase === "error"   && <ErrorScreen message={errorMsg} onRetry={handleReset} />}
      {phase === "results" && results && <Dashboard username={username} data={results} onReset={handleReset} />}
    </div>
  );
}
