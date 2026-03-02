import { useState, useEffect } from "react";

const STORAGE_KEY = "ironman-checklist-state";

const DEFAULT_SECTIONS = [
  {
    id: "swim",
    label: "SWIM",
    color: "#0ea5e9",
    icon: "🏊",
    items: [
      { id: "s1", label: "Wetsuit (if water temp allows)" },
      { id: "s2", label: "Swim goggles (+ backup pair)" },
      { id: "s3", label: "Swim cap (race-issued)" },
      { id: "s4", label: "Tri suit / swimskin" },
      { id: "s5", label: "Body Glide / anti-chafe lubricant" },
      { id: "s6", label: "Wetsuit strippers (for T1)" },
      { id: "s7", label: "Earplugs (optional)" },
      { id: "s8", label: "Timing chip & ankle strap" },
    ],
  },
  {
    id: "t1",
    label: "T1",
    color: "#f59e0b",
    icon: "⚡",
    items: [
      { id: "t1a", label: "Transition bag (T1)" },
      { id: "t1b", label: "Towel for drying off" },
      { id: "t1c", label: "Cycling shoes" },
      { id: "t1d", label: "Cycling helmet (MANDATORY)" },
      { id: "t1e", label: "Sunglasses" },
      { id: "t1f", label: "Socks (optional)" },
      { id: "t1g", label: "Race number belt" },
    ],
  },
  {
    id: "bike",
    label: "BIKE",
    color: "#10b981",
    icon: "🚴",
    items: [
      { id: "b1", label: "Road or TT bike (race-ready)" },
      { id: "b2", label: "Bike computer / GPS" },
      { id: "b3", label: "Aero bars / clip-ons" },
      { id: "b4", label: "Water bottles (2x) or aero bottle" },
      { id: "b5", label: "Nutrition (gels, bars, chews)" },
      { id: "b6", label: "CO2 cartridges (2x) or pump" },
      { id: "b7", label: "Spare inner tube (2x)" },
      { id: "b8", label: "Tire levers" },
      { id: "b9", label: "Multi-tool" },
      { id: "b10", label: "Patch kit" },
      { id: "b11", label: "Saddle bag" },
      { id: "b12", label: "Heart rate monitor / power meter" },
      { id: "b13", label: "Cycling gloves (optional)" },
    ],
  },
  {
    id: "t2",
    label: "T2",
    color: "#f59e0b",
    icon: "⚡",
    items: [
      { id: "t2a", label: "Transition bag (T2)" },
      { id: "t2b", label: "Running shoes" },
      { id: "t2c", label: "Running socks" },
      { id: "t2d", label: "Race number (front-facing)" },
      { id: "t2e", label: "Running hat or visor (optional)" },
      { id: "t2f", label: "Change of socks if needed" },
    ],
  },
  {
    id: "run",
    label: "RUN",
    color: "#ef4444",
    icon: "🏃",
    items: [
      { id: "r1", label: "Running shoes (race-day broken in)" },
      { id: "r2", label: "GPS watch" },
      { id: "r3", label: "Nutrition (gels, chews)" },
      { id: "r4", label: "Handheld water bottle (optional)" },
      { id: "r5", label: "Sunscreen (applied before race)" },
      { id: "r6", label: "Compression socks/sleeves (optional)" },
      { id: "r7", label: "Anti-chafe stick" },
    ],
  },
  {
    id: "race",
    label: "RACE DAY",
    color: "#8b5cf6",
    icon: "📋",
    items: [
      { id: "rd1", label: "Race registration / athlete guide" },
      { id: "rd2", label: "Government-issued ID" },
      { id: "rd3", label: "USAT / triathlon membership card" },
      { id: "rd4", label: "Race bib number" },
      { id: "rd5", label: "Permanent marker (for body marking)" },
      { id: "rd6", label: "Pre-race nutrition & breakfast" },
      { id: "rd7", label: "Water & electrolyte drinks" },
      { id: "rd8", label: "Cash / card for expo or emergencies" },
      { id: "rd9", label: "Phone (left in bag or car)" },
      { id: "rd10", label: "Warm-up layers / throwaway clothes" },
      { id: "rd11", label: "Post-race recovery clothes & shoes" },
      { id: "rd12", label: "Cooler with post-race food" },
    ],
  },
];

const DEFAULT_STATE = {
  sections: DEFAULT_SECTIONS,
  checked: {},
};

function loadState() {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;
    const parsed = JSON.parse(stored);

    // New shape: { sections, checked }
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray(parsed.sections) &&
      parsed.checked &&
      typeof parsed.checked === "object"
    ) {
      return {
        ...DEFAULT_STATE,
        ...parsed,
      };
    }

    // Legacy shape: just the checked map
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return {
        ...DEFAULT_STATE,
        checked: parsed,
      };
    }
  } catch {
    // ignore parse errors and fall back to defaults
  }
  return DEFAULT_STATE;
}

export default function IronmanChecklist() {
  const [state, setState] = useState(loadState);
  const [activeSection, setActiveSection] = useState("swim");
  const [newItemLabel, setNewItemLabel] = useState("");

  const { sections, checked } = state;

  const toggle = (id) =>
    setState((prev) => ({
      ...prev,
      checked: { ...prev.checked, [id]: !prev.checked[id] },
    }));

  const handleAddItem = () => {
    const label = newItemLabel.trim();
    if (!label) return;

    const itemId = `${activeSection}-${Date.now()}`;
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === activeSection
          ? {
              ...s,
              items: [...s.items, { id: itemId, label }],
            }
          : s
      ),
    }));
    setNewItemLabel("");
  };

  const handleRemoveItem = (sectionId, itemId) => {
    setState((prev) => {
      const nextSections = prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.filter((i) => i.id !== itemId),
            }
          : s
      );

      const { [itemId]: _removed, ...restChecked } = prev.checked;
      return {
        ...prev,
        sections: nextSections,
        checked: restChecked,
      };
    });
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
    setActiveSection("swim");
    setNewItemLabel("");
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore write errors (e.g. private mode)
    }
  }, [state]);

  const totalItems = sections.reduce((a, s) => a + s.items.length, 0);
  const totalChecked = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((totalChecked / totalItems) * 100);

  const activeData = sections.find((s) => s.id === activeSection);

  const sectionProgress = (s) => {
    const done = s.items.filter((i) => checked[i.id]).length;
    return {
      done,
      total: s.items.length,
      pct: Math.round((done / s.items.length) * 100),
    };
  };

  return (
    <div
      style={{
        fontFamily: "'Bebas Neue', 'Arial Narrow', Arial, sans-serif",
        background: "#0a0a0f",
        minHeight: "100vh",
        color: "#fff",
        padding: "0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
        .item-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); cursor: pointer; transition: all 0.15s; }
        .item-row:hover { background: rgba(255,255,255,0.03); border-radius: 6px; padding: 10px 8px; margin: 0 -8px; }
        .item-row:last-child { border-bottom: none; }
        .checkbox { width: 20px; height: 20px; border-radius: 4px; border: 2px solid; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .tab-btn { background: none; border: none; cursor: pointer; font-family: 'Bebas Neue', sans-serif; font-size: 13px; letter-spacing: 2px; padding: 8px 12px; border-radius: 6px; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .tab-btn:hover { background: rgba(255,255,255,0.08); }
        .progress-bar-track { background: rgba(255,255,255,0.1); border-radius: 99px; overflow: hidden; }
        .progress-bar-fill { height: 100%; border-radius: 99px; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }
        .section-mini-bar { height: 3px; border-radius: 99px; margin-top: 4px; background: rgba(255,255,255,0.1); overflow: hidden; }
        .section-mini-fill { height: 100%; border-radius: 99px; transition: width 0.3s; }
      `}</style>

      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #111128 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "28px 24px 20px",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: 4,
                color: "#64748b",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              RACE PREPARATION
            </div>
            <button
              onClick={handleReset}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                letterSpacing: 1,
                padding: "4px 10px",
                borderRadius: 999,
                border: "1px solid rgba(248,250,252,0.2)",
                background: "rgba(15,23,42,0.9)",
                color: "#e2e8f0",
                cursor: "pointer",
              }}
            >
              Reset list
            </button>
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 8vw, 56px)",
              letterSpacing: 3,
              lineHeight: 1,
              marginBottom: 16,
            }}
          >
            IRONMAN <span style={{ color: "#ef4444" }}>70.3</span>
          </h1>
          <div
            style={{ fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <span style={{ color: "#94a3b8", fontSize: 13 }}>
                {totalChecked} of {totalItems} items packed
              </span>
              <span
                style={{
                  fontSize: 20,
                  fontFamily: "'Bebas Neue', sans-serif",
                  color: pct === 100 ? "#10b981" : "#fff",
                }}
              >
                {pct}%
              </span>
            </div>
            <div className="progress-bar-track" style={{ height: 6 }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${pct}%`,
                  background:
                    pct === 100
                      ? "#10b981"
                      : "linear-gradient(90deg, #ef4444, #f59e0b)",
                }}
              />
            </div>
          </div>
          {pct === 100 && (
            <div
              style={{
                background: "rgba(16,185,129,0.15)",
                border: "1px solid rgba(16,185,129,0.4)",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 13,
                color: "#10b981",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ✓ You're race-ready. Go crush it!
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "#0d0d1a",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 2,
            padding: "8px 16px",
            maxWidth: 600,
            margin: "0 auto",
            minWidth: "max-content",
          }}
        >
          {sections.map((s) => {
            const { done, total, pct: sp } = sectionProgress(s);
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                className="tab-btn"
                onClick={() => setActiveSection(s.id)}
                style={{
                  color: isActive ? s.color : "#64748b",
                  background: isActive ? `${s.color}18` : "none",
                  minWidth: 64,
                }}
              >
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span>{s.label}</span>
                <div
                  className="section-mini-bar"
                  style={{ width: 36, background: "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="section-mini-fill"
                    style={{ width: `${sp}%`, background: s.color }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 9,
                    color: "#475569",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {done}/{total}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div
        style={{ maxWidth: 600, margin: "0 auto", padding: "16px 24px 40px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 22 }}>{activeData.icon}</span>
          <h2
            style={{ fontSize: 28, letterSpacing: 2, color: activeData.color }}
          >
            {activeData.label} GEAR
          </h2>
        </div>

        <div>
          {activeData.items.map((item) => {
            const isChecked = checked[item.id];
            return (
              <div
                key={item.id}
                className="item-row"
                onClick={() => toggle(item.id)}
              >
                <div
                  className="checkbox"
                  style={{
                    borderColor: isChecked
                      ? activeData.color
                      : "rgba(255,255,255,0.2)",
                    background: isChecked ? activeData.color : "transparent",
                  }}
                >
                  {isChecked && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <polyline
                        points="2,6 5,9 10,3"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    color: isChecked ? "#64748b" : "#e2e8f0",
                    textDecoration: isChecked ? "line-through" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {item.label}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(activeData.id, item.id);
                  }}
                  style={{
                    marginLeft: "auto",
                    background: "transparent",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: 4,
                  }}
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Add custom item"
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddItem();
              }
            }}
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.6)",
              background: "rgba(15,23,42,0.9)",
              color: "#e2e8f0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
            }}
          />
          <button
            onClick={handleAddItem}
            disabled={!newItemLabel.trim()}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              background: newItemLabel.trim()
                ? "linear-gradient(90deg, #ef4444, #f97316)"
                : "rgba(148,163,184,0.4)",
              color: "#0f172a",
              cursor: newItemLabel.trim() ? "pointer" : "default",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            Add
          </button>
        </div>

        <div
          style={{
            marginTop: 24,
            padding: "14px 16px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 10,
            borderLeft: `3px solid ${activeData.color}`,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "#64748b",
            }}
          >
            {activeData.id === "swim" &&
              "💡 Check water temp before race day — wetsuit legal is typically below 76.1°F (24.5°C)."}
            {activeData.id === "t1" &&
              "💡 Practice your T1 routine — every second counts. Lay out gear in the exact order you'll use it."}
            {activeData.id === "bike" &&
              "💡 Do a full bike check the day before: brakes, gears, tire pressure, and nutrition loaded."}
            {activeData.id === "t2" &&
              "💡 Elastic laces in your running shoes can save 20–30 seconds in T2."}
            {activeData.id === "run" &&
              "💡 Start the run conservatively. Most 70.3 crashes happen in the first 3 miles of the run."}
            {activeData.id === "race" &&
              "💡 Arrive at transition at least 90 mins before race start. Bring snacks for the wait!"}
          </div>
        </div>
      </div>
    </div>
  );
}
