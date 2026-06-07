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

/* ── HELPERS ── */
function GradientText({ children, style = {} }) {
  return <span style={{ background: "linear-gradient(135deg,#5B8CFF,#7B61FF,#FF4FA3)", backgroundSize: "200% 200%", animation: "gradShift 4s ease infinite", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", ...style }}>{children}</span>;
}

function GlassCard({ children, style = {}, className = "" }) {
  return <div className={`glass-card ${className}`} style={{ padding: "1.5rem", ...style }}>{children}</div>;
}

function SectionLabel({ icon, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.25rem" }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
    </div>
  );
}

function GradientBar({ value, colors = ["#5B8CFF", "#7B61FF"], height = 7 }) {
  return (
    <div style={{ background: "rgba(91,140,255,0.12)", borderRadius: 999, height, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: `linear-gradient(90deg,${colors[0]},${colors[1]})`, borderRadius: 999, transition: "width 1s ease" }} />
    </div>
  );
}

function Tag({ children, color = C.primary }) {
  return <span style={{ background: color + "18", color, border: `1px solid ${color}30`, borderRadius: 20, padding: "0.25rem 0.8rem", fontSize: 12, fontWeight: 600 }}>{children}</span>;
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

/* ── LOADING ── */
function LoadingScreen({ username }) {
  const [idx, setIdx] = useState(0);
  const [prog, setProg] = useState(0);
  useState(() => {
    const t1 = setInterval(() => setIdx(i => Math.min(i + 1, LOADING_MSGS.length - 1)), 950);
    const t2 = setInterval(() => setProg(p => Math.min(p + 1.4, 95)), 75);
    return () => { clearInterval(t1); clearInterval(t2); };
  });
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", fontFamily: "Inter,sans-serif" }}>
      <PageBg />
      <div className="glass fade-up" style={{ padding: "3rem 2.5rem", textAlign: "center", maxWidth: 440, width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#5B8CFF,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.75rem", boxShadow: "0 0 40px rgba(91,140,255,0.4)" }}>
          <svg style={{ animation: "spin 1.4s linear infinite" }} width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "0.4rem" }}>Analyzing <GradientText>@{username}</GradientText></h2>
        <p style={{ color: C.muted, marginBottom: "2rem", fontSize: 14, minHeight: 22 }}>
          {LOADING_MSGS[idx]}<span style={{ animation: "blink 1s infinite", display: "inline-block" }}>_</span>
        </p>
        <div style={{ background: "rgba(91,140,255,0.1)", borderRadius: 999, height: 6, overflow: "hidden", marginBottom: "0.75rem", border: "1px solid rgba(91,140,255,0.2)" }}>
          <div style={{ width: `${prog}%`, height: "100%", background: "linear-gradient(90deg,#5B8CFF,#7B61FF,#FF4FA3)", borderRadius: 999, transition: "width 0.2s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: C.muted }}>Processing...</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>{Math.round(prog)}%</span>
        </div>
      </div>
    </div>
  );
}

/* ── ERROR ── */
function ErrorScreen({ message, onRetry }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", fontFamily: "Inter,sans-serif" }}>
      <PageBg />
      <div className="glass fade-up" style={{ padding: "3rem 2.5rem", textAlign: "center", maxWidth: 440, width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 48, marginBottom: "1rem" }}>⚠️</div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem" }}>Analysis Failed</h2>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, marginBottom: "2rem" }}>{message}</p>
        <button className="btn-primary" onClick={onRetry}>← Try Again</button>
      </div>
    </div>
  );
}

/* ── HERO ── */
function HeroPage({ onAnalyze }) {
  const [val, setVal] = useState("");
  const [focused, setFocused] = useState(false);
  const submit = () => { const u = val.trim().replace(/^@/, ""); if (u) onAnalyze(u); };
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
            <input style={{ flex: 1 }} placeholder="Enter Instagram username" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
            <button className="btn-primary" onClick={submit} style={{ borderRadius: 18, padding: "0.75rem 1.4rem", fontSize: 14, flexShrink: 0 }}>Analyze →</button>
          </div>
        </div>
        <div className="fade-up" style={{ animationDelay: "0.4s", display: "flex", gap: "1.5rem", marginTop: "3rem", flexWrap: "wrap", justifyContent: "center" }}>
          {[["🎯","Niche Detection"],["📊","Engagement Stats"],["💡","AI Recommendations"],["🚀","Growth Insights"]].map(([ic,lb]) => (
            <div key={lb} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 16 }}>{ic}</span>
              <span style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>{lb}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── DASHBOARD ── */
function Dashboard({ username, data: d, onReset }) {
  const fmtColors = [["#5B8CFF","#7B61FF"],["#10B981","#059669"],["#F59E0B","#D97706"],["#FF4FA3","#FF6B35"]];

  // Safely read nested fields with fallbacks
  const profile = d.profile_overview || d.profile || {};
  const niche = d.niche_detection || d.niche || {};
  const posting = d.posting_analysis || d.posting || {};
  const content = d.content_analysis || d.content || {};
  const engagement = d.engagement_analysis || d.engagement || {};
  const topPosts = d.top_posts || d.topPosts || [];
  const audience = d.audience_insights || d.audience || {};
  const gaps = d.content_gaps || d.contentGaps || [];
  const recs = d.recommendations || [];

  const formatBreakdown =
  posting.content_mix ||
  content.format_breakdown ||
  content.formatBreakdown ||
  {};
  const sentimentBreakdown = engagement.sentiment_breakdown || engagement.sentimentBreakdown || {};
  const bestTimes =
  posting.best_posting_times ||
  posting.best_times ||
  posting.bestTimes ||
  [];
  const themes = content.themes || content.content_themes || [];
  const strengths = audience.strengths || [];
  const weaknesses = audience.weaknesses || [];

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
            <div style={{ fontSize: 11, color: C.muted }}>@{username}</div>
          </div>
        </div>
        <button className="btn-ghost" onClick={onReset} style={{ fontSize: 13, padding: "0.5rem 1rem" }}>← New Analysis</button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem", position: "relative", zIndex: 1 }}>

        {/* Profile Overview */}
        <section style={{ marginBottom: "1.5rem" }}>
          <SectionLabel icon="👤" label="Profile Overview" />
          <GlassCard>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "flex-start" }}>
              {profile.profile_picture_url || profile.profileImage ? (
                <div style={{ position: "relative" }}>
                  <img src={profile.profile_picture_url || profile.profileImage} alt="" style={{ width: 76, height: 76, borderRadius: "50%", border: "2.5px solid rgba(91,140,255,0.4)", objectFit: "cover" }} />
                  {(profile.is_verified || profile.verified) && (
                    <span style={{ position: "absolute", bottom: 2, right: 2, background: "linear-gradient(135deg,#5B8CFF,#7B61FF)", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                  )}
                </div>
              ) : (
                <div style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg,#5B8CFF,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", flexShrink: 0 }}>
                  {(profile.full_name || profile.name || username || "?")[0].toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 200 }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 4 }}>{profile.full_name || profile.name || username}</h2>
                <p style={{ marginBottom: 8 }}><GradientText style={{ fontSize: 13, fontWeight: 600 }}>@{profile.username || username}</GradientText></p>
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65 }}>{profile.bio || profile.biography || "—"}</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                ["Followers", profile.followers_count || profile.followers, ["#5B8CFF","#7B61FF"]],
                ["Following", profile.following_count || profile.following, ["#10B981","#059669"]],
                ["Posts", profile.posts_count || profile.totalPosts || profile.media_count, ["#F59E0B","#D97706"]],
              ].map(([l,v,g]) => v != null && (
                <div key={l} style={{ background: "rgba(255,255,255,0.6)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.6)", padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.35rem", fontWeight: 800, background: `linear-gradient(135deg,${g[0]},${g[1]})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{typeof v === "number" ? v.toLocaleString() : v}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 3, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
                </div>
              ))}
            </div>
            {(profile.summary || profile.account_summary) && (
              <div style={{ background: "linear-gradient(135deg,rgba(91,140,255,0.08),rgba(123,97,255,0.06))", borderRadius: 14, padding: "1rem", border: "1px solid rgba(91,140,255,0.15)" }}>
                <p style={{ color: "#4B5563", fontSize: 14, lineHeight: 1.65 }}>{profile.summary || profile.account_summary}</p>
              </div>
            )}
          </GlassCard>
        </section>



   {Object.keys(niche).length > 0 && (
  <GlassCard>
    <SectionLabel icon="🎯" label="Niche Detection" />

    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {[
        ["Primary Niche", niche.primary_niche || niche.primary, C.primary],
        ["Secondary Niche", niche.secondary_niche || niche.secondary, C.secondary],
        ["Audience Category", niche.audience_category || niche.audienceCategory, C.accent],
      ]
        .filter(([, v]) => v)
        .map(([l, v, c]) => (
          <div
            key={l}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 13, color: C.muted }}>{l}</span>
            <Tag color={c}>{v}</Tag>
          </div>
        ))}

      {(niche.confidence_score !== undefined ||
        niche.confidenceScore !== undefined) && (
        <div style={{ marginTop: 4 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 13, color: C.muted }}>
              Confidence Score
            </span>

            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.secondary,
              }}
            >
              {Math.round(
  (niche.confidence_score ??
    niche.confidenceScore ??
    0) <= 1
    ? (niche.confidence_score ??
        niche.confidenceScore ??
        0) * 100
    : (niche.confidence_score ??
        niche.confidenceScore ??
        0)
)}
%
            </span>
          </div>

          <GradientBar
  value={
    (niche.confidence_score ??
      niche.confidenceScore ??
      0) <= 1
      ? (niche.confidence_score ??
          niche.confidenceScore ??
          0) * 100
      : (niche.confidence_score ??
          niche.confidenceScore ??
          0)
  }
  colors={["#5B8CFF", "#7B61FF"]}
/>
        </div>
      )}
    </div>
  </GlassCard>
)}






        
        {/* Content + Engagement */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {Object.keys(content).length > 0 && (
            <GlassCard>
              <SectionLabel icon="📝" label="Content Analysis" />
              {themes.length > 0 && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Themes</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {themes.map((t,i) => <span key={i} style={{ background: "rgba(91,140,255,0.08)", color: C.secondary, border: "1px solid rgba(91,140,255,0.2)", borderRadius: 20, padding: "0.25rem 0.75rem", fontSize: 12, fontWeight: 500 }}>{t}</span>)}
                  </div>
                </div>
              )}
              {Object.keys(formatBreakdown).length > 0 && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Format Breakdown</p>
                  {Object.entries(formatBreakdown).map(([k,v],i) => (
                    <div key={k} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{k}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: (fmtColors[i] || fmtColors[0])[0] }}>{v}%</span>
                      </div>
                      <GradientBar value={v} colors={fmtColors[i] || fmtColors[0]} />
                    </div>
                  ))}
                </div>
              )}
              {(content.caption_style || content.captionStyle) && (
                <div style={{ background: "rgba(16,185,129,0.07)", borderRadius: 12, padding: "0.8rem", border: "1px solid rgba(16,185,129,0.18)" }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#047857" }}><b>Caption Style:</b> {content.caption_style || content.captionStyle}</p>
                </div>
              )}
            </GlassCard>
          )}

          {Object.keys(engagement).length > 0 && (
            <GlassCard>
              <SectionLabel icon="📊" label="Engagement Analysis" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                {[
                  ["Rate", engagement.engagement_rate || engagement.rate, ["#5B8CFF","#7B61FF"]],
                  ["Avg Likes", engagement.average_likes || engagement.avgLikes, ["#FF4FA3","#FF6B35"]],
                  ["Avg Comments", engagement.average_comments || engagement.avgComments, ["#10B981","#059669"]],
                  ["Sentiment", engagement.overall_sentiment || engagement.sentiment || "—", ["#F59E0B","#D97706"]],
                ].filter(([,v]) => v).map(([l,v,g]) => (
                  <div key={l} style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: 14, padding: "0.9rem" }}>
                    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: "1.15rem", fontWeight: 800, background: `linear-gradient(135deg,${g[0]},${g[1]})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{v}</div>
                  </div>
                ))}
              </div>
              {Object.keys(sentimentBreakdown).length > 0 && (
                <>
                  <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Comment Sentiment</p>
                  <div style={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden", gap: 2, marginBottom: 8 }}>
                    {Object.entries(sentimentBreakdown).map(([k,v],i) => (
                      <div key={k} style={{ width:`${v}%`, height:"100%", background:["linear-gradient(90deg,#10B981,#059669)","linear-gradient(90deg,#F59E0B,#D97706)","linear-gradient(90deg,#FF4FA3,#EF4444)"][i] || "#ccc", borderRadius: 999 }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {Object.entries(sentimentBreakdown).map(([k,v],i) => (
                      <span key={k} style={{ fontSize: 12, color: C.muted }}><span style={{ fontWeight: 700, color:["#10B981","#F59E0B","#EF4444"][i] || C.muted }}>{v}%</span> {k}</span>
                    ))}
                  </div>
                </>
              )}
            </GlassCard>
          )}
        </div>

        {/* Top Posts */}
        {topPosts.length > 0 && (
          <section style={{ marginBottom: "1.5rem" }}>
            <SectionLabel icon="🏆" label="Top Performing Posts" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "1rem" }}>
              {topPosts.map((p,i) => (
                <div key={i} className="glass-card" style={{ overflow: "hidden", padding: 0 }}>
                  {(p.thumbnail_url || p.thumbnail || p.image_url) && (
                    <div style={{ position: "relative" }}>
                      <img src={p.thumbnail_url || p.thumbnail || p.image_url} alt="" style={{ width: "100%", height: 155, objectFit: "cover", display: "block" }} onError={e => e.target.style.display="none"} />
                      <div style={{ position: "absolute", top: 10, left: 10, background: "linear-gradient(135deg,#5B8CFF,#7B61FF)", color: "#fff", borderRadius: 8, padding: "0.2rem 0.6rem", fontSize: 11, fontWeight: 700 }}>#{i+1}</div>
                      {(p.type || p.media_type) && <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", color: "#fff", borderRadius: 8, padding: "0.2rem 0.6rem", fontSize: 10, fontWeight: 600 }}>{p.type || p.media_type}</div>}
                    </div>
                  )}
                  <div style={{ padding: "1rem" }}>
                    {(p.caption) && <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>{p.caption}</p>}
                    <div style={{ display: "flex", gap: 14, marginBottom: 10, flexWrap: "wrap" }}>
                      {(p.likes || p.like_count) && <span style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>❤ {p.likes || p.like_count}</span>}
                      {(p.comments || p.comment_count) && <span style={{ fontSize: 12, fontWeight: 600, color: C.primary }}>💬 {p.comments || p.comment_count}</span>}
                      {(p.engagement_rate) && <span style={{ fontSize: 12, fontWeight: 600, color: C.secondary }}>📊 {p.engagement_rate}</span>}
                    </div>
                    {(p.ai_explanation || p.reason || p.why_it_performed) && (
                      <div style={{ background: "rgba(16,185,129,0.07)", borderRadius: 9, padding: "0.55rem 0.7rem", border: "1px solid rgba(16,185,129,0.18)" }}>
                        <p style={{ margin: 0, fontSize: 12, color: "#047857", lineHeight: 1.5 }}>{p.ai_explanation || p.reason || p.why_it_performed}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Audience */}
        {Object.keys(audience).length > 0 && (
          <section style={{ marginBottom: "1.5rem" }}>
            <SectionLabel icon="👥" label="Audience Insights" />
            <GlassCard>
              {(audience.audience_type || audience.type) && (
                <div style={{ background: "linear-gradient(135deg,rgba(91,140,255,0.07),rgba(123,97,255,0.05))", borderRadius: 14, padding: "1rem", border: "1px solid rgba(91,140,255,0.15)", marginBottom: "1.25rem" }}>
                  <p style={{ color: "#374151", fontSize: 14, fontWeight: 500 }}>{audience.audience_type || audience.type}</p>
                </div>
              )}
              {(audience.growth_trajectory || audience.trajectory) && (
                <p style={{ fontSize: 13, color: C.secondary, fontWeight: 600, marginBottom: "1.25rem" }}>📈 {audience.growth_trajectory || audience.trajectory}</p>
              )}
              {(strengths.length > 0 || weaknesses.length > 0) && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
                  {strengths.length > 0 && (
                    <div>
                      <p style={{ fontSize: 11, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Strengths</p>
                      {strengths.map((s,i) => <div key={i} style={{ fontSize: 13, color: C.muted, display: "flex", gap: 6, marginBottom: 6, alignItems: "flex-start" }}><span style={{ color: C.green, flexShrink: 0, fontWeight: 700 }}>✓</span>{s}</div>)}
                    </div>
                  )}
                  {weaknesses.length > 0 && (
                    <div>
                      <p style={{ fontSize: 11, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weaknesses</p>
                      {weaknesses.map((w,i) => <div key={i} style={{ fontSize: 13, color: C.muted, display: "flex", gap: 6, marginBottom: 6, alignItems: "flex-start" }}><span style={{ color: C.accent, flexShrink: 0, fontWeight: 700 }}>✗</span>{w}</div>)}
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </section>
        )}

        {/* Content Gaps */}
        {gaps.length > 0 && (
          <section style={{ marginBottom: "1.5rem" }}>
            <SectionLabel icon="🔍" label="Content Gaps & Opportunities" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "0.85rem" }}>
              {gaps.map((g,i) => (
                <GlassCard key={i} style={{ borderLeft: `3px solid ${C.accent}` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                    <span>🎯</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{g.gap || g.title || g.missing_content}</span>
                  </div>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{g.opportunity || g.description || g.growth_opportunity}</p>
                </GlassCard>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {recs.length > 0 && (
          <section style={{ marginBottom: "1.5rem" }}>
            <SectionLabel icon="💡" label="AI Recommendations" />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {recs.map((r,i) => (
                <GlassCard key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#5B8CFF,#7B61FF)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, boxShadow: "0 4px 12px rgba(91,140,255,0.3)" }}>{i+1}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{r.title || r.recommendation}</h4>
                    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 8 }}>{r.description || r.details}</p>
                    {(r.impact || r.expected_impact) && <span style={{ fontSize: 12, color: C.secondary, fontWeight: 600 }}>📈 Expected: {r.impact || r.expected_impact}</span>}
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        )}

        {/* Export */}
        <section>
          <GlassCard style={{ textAlign: "center", background: "linear-gradient(135deg,rgba(91,140,255,0.07),rgba(255,79,163,0.05))", border: "1px solid rgba(91,140,255,0.18)" }}>
            <div style={{ fontSize: 40, marginBottom: "0.75rem" }}>✨</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 6 }}>Export Your Report</h3>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: "1.5rem" }}>Save or share the full analysis for <GradientText>@{username}</GradientText></p>
            <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => window.print()}>📄 Download PDF</button>
              <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(`Instagram Analysis — @${username}`)}>📋 Copy Report</button>
              <button className="btn-ghost" onClick={onReset}>🔄 Analyze Another</button>
            </div>
          </GlassCard>
        </section>

      </div>
    </div>
  );
}

/* ── ROOT ── */
export default function App() {
  const [phase, setPhase] = useState("hero");
  const [username, setUsername] = useState("");
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAnalyze = async (uname) => {
    setUsername(uname);
    setPhase("loading");
    setErrorMsg("");

    try {
      const webhookUrl =
  import.meta.env.VITE_N8N_WEBHOOK_URL ||
  "https://okrishit.app.n8n.cloud/webhook/instagram-analyzer";
  if (!webhookUrl) throw new Error("VITE_N8N_WEBHOOK_URL is not set. In your Vite project, ensure it's in your .env file. For local testing, set window.VITE_N8N_WEBHOOK_URL in your browser console.");

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: uname }),
      });

      if (!response.ok) throw new Error(`Server responded with status ${response.status}. Check your n8n workflow.`);

      const raw = await response.json();

      // Handle multiple possible response shapes from n8n
      let report = null;

      if (Array.isArray(raw)) {
        // e.g. [{ analysis: "..." }] or [{ ...reportFields }]
        const first = raw[0];
        if (first?.analysis) {
          report = typeof first.analysis === "string" ? JSON.parse(first.analysis) : first.analysis;
        } else {
          report = first;
        }
      } else if (raw?.analysis) {
        report = typeof raw.analysis === "string" ? JSON.parse(raw.analysis) : raw.analysis;
      } else {
        // Assume the root object IS the report
        report = raw;
      }

      if (!report || typeof report !== "object") throw new Error("Unexpected response format from n8n. Could not parse report.");

      setResults(report);
      setPhase("results");
    } catch (err) {
      console.error("n8n Error:", err);
      setErrorMsg(err.message || "Something went wrong. Please check your n8n workflow and try again.");
      setPhase("error");
    }
  };

  const handleReset = () => { setPhase("hero"); setUsername(""); setResults(null); setErrorMsg(""); };

  return (
    <>
      <style>{globalCss}</style>
      {phase === "hero"    && <HeroPage onAnalyze={handleAnalyze} />}
      {phase === "loading" && <LoadingScreen username={username} />}
      {phase === "error"   && <ErrorScreen message={errorMsg} onRetry={handleReset} />}
      {phase === "results" && results && <Dashboard username={username} data={results} onReset={handleReset} />}
    </>
  );
}
