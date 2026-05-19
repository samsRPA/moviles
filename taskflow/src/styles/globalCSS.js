export const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
  font-family: 'Inter', sans-serif;
  background: #0F0F1A;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
  width: 100%;   /* ← agregar */
  height: 100%;  /* ← agregar */
  margin: 0;     /* ← agregar */
}

  html.capacitor body {
  background: #F9FAFB;
  display: block;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.capacitor .shell {
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  min-width: 100vw !important;
  min-height: 100vh !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden;
}

html.capacitor .screen {
  padding-top: 0;  /* el padding lo manejan los headers individualmente */
}

html.capacitor .hhdr,
html.capacitor .thdr,
html.capacitor .cal-hdr,
html.capacitor .prof-hdr {
  padding-top: calc(var(--sat) + 16px);
}

html.capacitor .aw {
  padding-top: var(--sat);
}

html.capacitor .splash {
  padding-top: calc(var(--sat) + 40px);
}

  /* ── LAYOUT ── */
  .shell {
    width: 390px;
    height: 844px;
    background: #F9FAFB;
    border-radius: 44px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08);
    display: flex;
    flex-direction: column;
  }

  
  .screen {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    position: relative;
  }
  .screen::-webkit-scrollbar { display: none; }

  .notch {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 126px; height: 34px;
    background: #000;
    border-radius: 0 0 20px 20px;
    z-index: 20;
  }
  .nc { width: 12px; height: 12px; background: #1a1a1a; border-radius: 50%; position: absolute; top: 10px; right: 18px; }
  .np { width: 8px; height: 8px; background: #2a2a2a; border-radius: 50%; position: absolute; top: 12px; right: 34px; }

  .sbar {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px 0 24px;
    padding-top: 6px;
    font-size: 12px;
    font-weight: 600;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
  }
  .sbar.dk { background: #1E1B4B; color: #fff; }
  .sbar.lt { background: #F9FAFB; color: #1E1B4B; }
  .sicons { display: flex; align-items: center; gap: 6px; }

  /* ── ANIMATIONS ── */
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sin { animation: slideIn 0.35s ease both; }

  .spinner {
    width: 36px; height: 36px;
    border: 3px solid #EEF2FF;
    border-top-color: #4F46E5;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
    margin: auto;
  }

  /* ── AUTH SCREENS ── */
  .aw {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(160deg, #1E1B4B 0%, #312E81 40%, #4F46E5 100%);
  }
  .ahero {
    padding: 40px 28px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .alogo {
    width: 72px; height: 72px;
    background: rgba(255,255,255,0.15);
    border-radius: 22px;
    display: flex; align-items: center; justify-content: center;
    font-size: 34px;
    margin-bottom: 18px;
    border: 1px solid rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
  }
  .ah1 { font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .asub { font-size: 14px; color: #A5B4FC; font-weight: 400; }

  .abody {
    flex: 1;
    background: #F9FAFB;
    border-radius: 28px 28px 0 0;
    padding: 28px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .lbl { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; display: block; }
  .iw { margin-bottom: 14px; }
  .iw input {
    width: 100%;
    border: 1.5px solid #E5E7EB;
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    color: #111827;
    background: #fff;
    outline: none;
    transition: border-color 0.2s;
  }
  .iw input:focus { border-color: #4F46E5; }

  .btnp {
    width: 100%;
    background: #4F46E5;
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 14px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    margin-top: 6px;
    transition: background 0.2s, transform 0.1s;
  }
  .btnp:active { transform: scale(0.98); background: #3730A3; }
  .btnp:disabled { background: #A5B4FC; cursor: not-allowed; }

  .div { display: flex; align-items: center; gap: 10px; margin: 14px 0; }
  .div::before, .div::after { content:''; flex:1; height:1px; background:#E5E7EB; }
  .div span { font-size: 12px; color: #6B7280; }

  .srow { display: flex; align-items: center; gap: 8px; justify-content: center; }
  .btns {
    background: #fff;
    border: 1.5px solid #E5E7EB;
    border-radius: 12px;
    padding: 12px;
    font-size: 15px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    flex: 1;
    transition: border-color 0.2s;
  }
  .btns:hover { border-color: #4F46E5; color: #4F46E5; }

  .afoot { margin-top: 14px; text-align: center; font-size: 13px; color: #6B7280; }
  .lnk { color: #4F46E5; font-weight: 600; cursor: pointer; background: none; border: none; font-size: 13px; font-family: 'Inter', sans-serif; }
  .err { background: #FEE2E2; color: #991B1B; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 500; margin-bottom: 12px; }

  /* ── HOME SCREEN ── */
  .home { background: #F9FAFB; min-height: 100%; padding-bottom: 80px; }

  .hhdr {
    background: linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4F46E5 100%);
    padding: 16px 20px 28px;
  }
  .hrow { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .hgsm { display: flex; flex-direction: column; }
  .hnm { font-size: 20px; font-weight: 800; color: #fff; }
  .dchip {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,0.12);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 11px;
    color: #A5B4FC;
    font-weight: 500;
    margin-top: 4px;
  }
  .hav {
    width: 42px; height: 42px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    border: 2px solid rgba(255,255,255,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 700; color: #fff;
  }

  .plbl { font-size: 12px; color: #A5B4FC; font-weight: 500; margin-bottom: 6px; }
  .ppct { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 10px; }
  .pbar { height: 8px; background: rgba(255,255,255,0.15); border-radius: 4px; overflow: hidden; }
  .pfill { height: 100%; background: #10B981; border-radius: 4px; transition: width 0.5s ease; }

  .hbody { padding: 20px; }
  .sttl { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 12px; }

  .cats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 22px; }
  .cat {
    border-radius: 16px;
    padding: 14px;
    display: flex; align-items: center; gap: 10px;
    cursor: pointer;
    transition: transform 0.15s;
  }
  .cat:active { transform: scale(0.97); }
  .cic { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .cnm { font-size: 13px; font-weight: 600; color: #374151; }
  .cct { font-size: 11px; color: #6B7280; margin-top: 2px; }

  /* ── TASK CARD ── */
  .tc {
    background: #fff;
    border-radius: 16px;
    margin-bottom: 10px;
    display: flex;
    align-items: stretch;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    transition: transform 0.15s, opacity 0.2s;
    animation: slideIn 0.3s ease both;
  }
  .tc.done { opacity: 0.55; }
  .tcstrip { width: 4px; flex-shrink: 0; }
  .tchk {
    width: 22px; height: 22px;
    border-radius: 50%;
    border: 2px solid #D1D5DB;
    margin: auto 12px;
    flex-shrink: 0;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .tchk.on { background: #10B981; border-color: #10B981; }
  .tchk.on::after { content: '✓'; color: #fff; font-size: 12px; font-weight: 700; }

  .tinfo { flex: 1; padding: 12px 0; min-width: 0; }
  .tnm { font-size: 14px; font-weight: 600; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 8px; }
  .tnm.done { text-decoration: line-through; color: #9CA3AF; }
  .tmeta { display: flex; align-items: center; gap: 6px; margin-top: 5px; flex-wrap: wrap; }
  .pri {
    font-size: 10px; font-weight: 600;
    border-radius: 6px;
    padding: 2px 7px;
  }

  .tc-del {
    width: 36px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    color: #EF4444;
    cursor: pointer;
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .tc:hover .tc-del { opacity: 1; }

  /* ── BOTTOM NAV + FAB ── */
  .fab {
    position: absolute;
    bottom: 68px; right: 20px;
    width: 52px; height: 52px;
    background: #4F46E5;
    border-radius: 50%;
    border: none;
    color: #fff;
    font-size: 26px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px rgba(79,70,229,0.45);
    z-index: 50;
    transition: transform 0.15s, background 0.15s;
  }
  .fab:active { transform: scale(0.92); background: #3730A3; }

  .bnav {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 72px;
    background: #fff;
    border-top: 1px solid #E5E7EB;
    display: flex;
    padding: 0 8px;
    z-index: 40;
  }
  .nv {
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 3px;
    cursor: pointer;
    position: relative;
    border: none; background: none;
    padding: 0;
  }
  .nvic { font-size: 20px; line-height: 1; }
  .nvlbl { font-size: 10px; font-weight: 600; color: #9CA3AF; }
  .nv.on .nvlbl { color: #4F46E5; }
  .nvdot {
    position: absolute;
    top: 6px;
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #4F46E5;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .nv.on .nvdot { opacity: 1; }

  /* ── TASKS TAB ── */
  .taskscr { padding: 0 0 20px; background: #F9FAFB; min-height: 100%; }
  .thdr {
    background: linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4F46E5 100%);
    padding: 16px 20px 20px;
  }
  .tttl { font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 14px; }
  .fchips { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
  .fchips::-webkit-scrollbar { display: none; }
  .fchip {
    flex-shrink: 0;
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-family: 'Inter', sans-serif;
    transition: all 0.15s;
  }
  .fchip.on { background: #fff; color: #4F46E5; }
  .fchip.off { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); }
  .tbody { padding: 14px 16px 0; }

  /* ── PROFILE MENU (dentro de HomeScreen) ── */
  .pmenu {
    position: absolute; top: 54px; right: 16px;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    overflow: hidden;
    z-index: 100;
    min-width: 160px;
    animation: fadeIn 0.15s ease;
  }
  .pmi {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    border: none; background: none;
    width: 100%; text-align: left;
    font-family: 'Inter', sans-serif;
  }
  .pmi:hover { background: #F9FAFB; }
  .pmi.red { color: #EF4444; }
  .phr { border: none; border-top: 1px solid #E5E7EB; margin: 0; }

  /* ── CREATE TASK BOTTOM SHEET ── */
  .ov {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 60;
    display: flex; align-items: flex-end;
    animation: fadeIn 0.2s ease;
  }
  .bs {
    width: 100%;
    background: #fff;
    border-radius: 24px 24px 0 0;
    padding: 0 0 28px;
    max-height: 88%;
    overflow-y: auto;
    scrollbar-width: none;
    animation: slideUp 0.3s ease;
  }
  .bs::-webkit-scrollbar { display: none; }
  .bh { padding: 16px 20px 0; display: flex; align-items: center; justify-content: space-between; }
  .bhd { width: 36px; height: 4px; background: #E5E7EB; border-radius: 2px; margin: 0 auto 4px; }
  .bttl { font-size: 18px; font-weight: 700; color: #111827; }
  .bcl { background: none; border: none; font-size: 22px; cursor: pointer; color: #6B7280; line-height: 1; }

  .bbody { padding: 16px 20px 0; }
  .flbl { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; display: block; }
  .finp {
    width: 100%;
    border: 1.5px solid #E5E7EB;
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    color: #111827;
    background: #fff;
    outline: none;
    margin-bottom: 14px;
    transition: border-color 0.2s;
  }
  .finp:focus { border-color: #4F46E5; }

  .crow { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }

  .chip2 {
    padding: 8px 12px;
    border: 1.5px solid #E5E7EB;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    text-align: center;
    background: #fff;
    transition: all 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .chip2.sel { border-color: #4F46E5; background: #EEF2FF; color: #4F46E5; }

  .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }

  .btnsv {
    width: 100%;
    background: #4F46E5;
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 14px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    margin-top: 6px;
    transition: background 0.2s, transform 0.1s;
  }
  .btnsv:active { transform: scale(0.98); background: #3730A3; }
  .btnsv:disabled { background: #A5B4FC; cursor: not-allowed; }

  /* ── SUCCESS SCREEN ── */
  .suc {
    min-height: 100%;
    background: linear-gradient(160deg, #1E1B4B 0%, #312E81 40%, #4F46E5 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 32px 24px;
    text-align: center;
  }
  .suic { font-size: 64px; margin-bottom: 16px; }
  .suh { font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 8px; }
  .susub { font-size: 14px; color: #A5B4FC; margin-bottom: 28px; }

  .sucard {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 18px;
    padding: 18px 20px;
    width: 100%;
    backdrop-filter: blur(10px);
    margin-bottom: 28px;
  }
  .surow { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .surow:last-child { margin-bottom: 0; }
  .sulbl { font-size: 12px; color: #A5B4FC; font-weight: 500; }
  .suval { font-size: 13px; font-weight: 600; color: #fff; }

  .lnksm { background: none; border: none; color: #A5B4FC; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; margin-top: 14px; }

  /* ── ONBOARDING ── */
  .ob {
    min-height: 100%;
    background: #F9FAFB;
    display: flex; flex-direction: column;
    padding-bottom: 24px;
  }
  .ob-hero {
    background: linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4F46E5 100%);
    padding: 44px 24px 28px;
    text-align: center;
  }
  .ob-step { font-size: 11px; font-weight: 600; color: #A5B4FC; margin-bottom: 8px; letter-spacing: 0.08em; text-transform: uppercase; }
  .ob-h1 { font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .ob-sub { font-size: 13px; color: #A5B4FC; }

  .ob-body { flex: 1; padding: 20px 20px 0; }
  .ob-section-title { font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.06em; margin: 18px 0 10px; }

  .ob-city-sel {
    width: 100%;
    border: 1.5px solid #E5E7EB;
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    color: #111827;
    background: #fff;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236B7280' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
  }
  .ob-city-sel:focus { border-color: #4F46E5; }

  .ob-group { margin-bottom: 14px; }
  .ob-group-label { font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 8px; }
  .ob-chips { display: flex; flex-wrap: wrap; gap: 7px; }
  .ob-chip {
    padding: 7px 12px;
    border: 1.5px solid #E5E7EB;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    background: #fff;
    transition: all 0.15s;
    font-family: 'Inter', sans-serif;
    display: flex; align-items: center; gap: 4px;
  }
  .ob-chip.sel { border-color: #4F46E5; background: #EEF2FF; color: #4F46E5; }

  .ob-count {
    text-align: center;
    font-size: 12px;
    color: #6B7280;
    margin-top: 14px;
  }
  .ob-count span { color: #4F46E5; font-weight: 700; }

  .ob-btn {
    width: 100%;
    background: #4F46E5;
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 14px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    margin-top: 18px;
    transition: background 0.2s, transform 0.1s;
  }
  .ob-btn:active { transform: scale(0.98); }
  .ob-btn:disabled { background: #A5B4FC; cursor: not-allowed; }

  .ob-skip {
    display: block;
    text-align: center;
    background: none;
    border: none;
    color: #6B7280;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 10px;
    font-family: 'Inter', sans-serif;
  }

  /* ── DISCOVER SCREEN ── */
  .disc { min-height: 100%; background: #F9FAFB; padding-bottom: 20px; }
  .disc-hdr {
    background: linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4F46E5 100%);
    padding: 16px 20px 20px;
  }
  .disc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .disc-ttl { font-size: 20px; font-weight: 800; color: #fff; }
  .disc-city {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 12px;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.2s;
  }
  .disc-city:hover { background: rgba(255,255,255,0.2); }
  .disc-sub { font-size: 13px; color: #A5B4FC; }

  .disc-body { padding: 14px 16px 0; }

  .ev-card {
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    margin-bottom: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    animation: slideIn 0.3s ease both;
  }
  .ev-img { width: 100%; height: 150px; object-fit: cover; display: block; }
  .ev-img-ph {
    width: 100%; height: 150px;
    background: linear-gradient(135deg, #EEF2FF, #E0E7FF);
    display: flex; align-items: center; justify-content: center;
    font-size: 40px;
  }
  .ev-body { padding: 14px; }
  .ev-tag {
    display: inline-block;
    background: #EEF2FF;
    color: #4F46E5;
    font-size: 10px; font-weight: 700;
    border-radius: 6px;
    padding: 3px 8px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .ev-name { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 8px; line-height: 1.3; }
  .ev-meta { display: flex; flex-direction: column; gap: 4px; }
  .ev-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6B7280; }
  .ev-footer { padding: 12px 14px; border-top: 1px solid #F3F4F6; display: flex; align-items: center; justify-content: space-between; }
  .ev-price { font-size: 13px; font-weight: 700; color: #111827; }
  .ev-btn {
    background: #4F46E5;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.2s;
  }
  .ev-btn:hover { background: #3730A3; }

  .disc-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 60px 24px;
    text-align: center;
  }
  .disc-empty-ic { font-size: 48px; margin-bottom: 14px; }
  .disc-empty-ttl { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 8px; }
  .disc-empty-sub { font-size: 14px; color: #6B7280; margin-bottom: 20px; }
  .disc-empty-btn {
    background: #4F46E5; color: #fff;
    border: none; border-radius: 12px;
    padding: 12px 24px;
    font-size: 14px; font-weight: 700;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
  }

  /* ── PROFILE SCREEN ── */
  .prof { min-height: 100%; background: #F9FAFB; padding-bottom: 28px; }
  .prof-hdr {
    background: linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4F46E5 100%);
    padding: 20px 24px 28px;
    display: flex; flex-direction: column; align-items: center;
  }
  .prof-av-wrap { margin-bottom: 12px; }
  .prof-av {
    width: 68px; height: 68px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    border: 3px solid rgba(255,255,255,0.35);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; font-weight: 800; color: #fff;
  }
  .prof-nm { font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 4px; }
  .prof-em { font-size: 13px; color: #A5B4FC; }

  .prof-body { padding: 18px 20px 0; }
  .prof-card {
    background: #fff;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 14px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .prof-card-title { font-size: 13px; font-weight: 700; color: #374151; margin-bottom: 12px; }

  .prof-sel {
    width: 100%;
    border: 1.5px solid #E5E7EB;
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    color: #111827;
    background: #fff;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236B7280' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
  }
  .prof-sel:focus { border-color: #4F46E5; }

  .prof-int-wrap { display: flex; flex-direction: column; gap: 12px; }
  .prof-int-group {}
  .prof-int-group-lbl { font-size: 11px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 7px; }
  .prof-int-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .prof-chip {
    padding: 6px 11px;
    border: 1.5px solid #E5E7EB;
    border-radius: 20px;
    font-size: 11px; font-weight: 600;
    color: #374151;
    cursor: pointer;
    background: #fff;
    transition: all 0.15s;
    font-family: 'Inter', sans-serif;
    display: flex; align-items: center; gap: 3px;
  }
  .prof-chip.sel { border-color: #4F46E5; background: #EEF2FF; color: #4F46E5; }

  .prof-save {
    width: 100%;
    background: #4F46E5;
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 14px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    margin-top: 6px;
    transition: background 0.2s, transform 0.1s;
  }
  .prof-save:active { transform: scale(0.98); }

  .prof-logout {
    width: 100%;
    background: #fff;
    color: #EF4444;
    border: 1.5px solid #FEE2E2;
    border-radius: 14px;
    padding: 14px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.2s;
  }
  .prof-logout:hover { background: #FEF2F2; }

  .save-toast {
    position: absolute;
    bottom: 90px; left: 50%;
    transform: translateX(-50%);
    background: #10B981;
    color: #fff;
    padding: 10px 22px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 4px 14px rgba(16,185,129,0.4);
    z-index: 200;
    animation: slideIn 0.25s ease;
    white-space: nowrap;
  }

  /* ── SPLASH ── */
  .splash {
    min-height: 100%;
    background: linear-gradient(160deg, #0F0F1A 0%, #1E1B4B 40%, #312E81 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 32px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .splash::before {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .sp-logo {
    width: 90px; height: 90px;
    background: linear-gradient(135deg, #4F46E5, #7C3AED);
    border-radius: 28px;
    display: flex; align-items: center; justify-content: center;
    font-size: 44px;
    margin-bottom: 24px;
    box-shadow: 0 12px 40px rgba(79,70,229,0.5);
    border: 1px solid rgba(255,255,255,0.1);
    animation: slideIn 0.5s ease 0.1s both;
  }
  .sp-name {
    font-size: 34px; font-weight: 800; color: #fff;
    margin-bottom: 8px;
    animation: slideIn 0.5s ease 0.25s both;
  }
  .sp-tag {
    font-size: 14px; color: #A5B4FC;
    animation: slideIn 0.5s ease 0.4s both;
    margin-bottom: 52px;
  }
  .sp-bar-wrap {
    width: 200px; height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    overflow: hidden;
    animation: fadeIn 0.4s ease 0.6s both;
  }
  @keyframes loadBar {
    from { width: 0; }
    to   { width: 100%; }
  }
  .sp-bar {
    height: 100%;
    background: linear-gradient(90deg, #4F46E5, #A5B4FC);
    border-radius: 2px;
    animation: loadBar 2.0s ease forwards;
    animation-delay: 0.7s;
    width: 0;
  }

  
  /* ── CALENDAR SCREEN ── */
  .cal { min-height: 100%; background: #F9FAFB; display: flex; flex-direction: column; padding-bottom: 80px; }

  .cal-hdr {
    background: linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4F46E5 100%);
    padding: 16px 20px 18px;
    flex-shrink: 0;
  }
  .cal-hdr-top { display: flex; align-items: center; justify-content: space-between; }
  .cal-ttl { font-size: 20px; font-weight: 800; color: #fff; }
  .cal-nav { display: flex; align-items: center; gap: 10px; }
  .cal-nav-btn {
    background: rgba(255,255,255,0.15);
    border: none; color: #fff;
    width: 28px; height: 28px;
    border-radius: 8px;
    font-size: 18px; line-height: 1;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .cal-nav-btn:hover { background: rgba(255,255,255,0.25); }
  .cal-month-lbl { font-size: 14px; font-weight: 700; color: #fff; min-width: 130px; text-align: center; }

  .cal-grid-wrap {
    background: #fff;
    margin: 0;
    padding: 12px 12px 8px;
    border-bottom: 1px solid #E5E7EB;
    flex-shrink: 0;
  }
  .cal-dow-row { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 4px; }
  .cal-dow { text-align: center; font-size: 11px; font-weight: 700; color: #9CA3AF; padding: 4px 0; }

  .cal-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
  .cal-day {
    aspect-ratio: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s;
    padding: 2px;
    position: relative;
  }
  .cal-day.empty { cursor: default; }
  .cal-day:not(.empty):hover { background: #EEF2FF; }
  .cal-day.today .cal-day-num {
    background: #4F46E5; color: #fff;
    border-radius: 50%;
    width: 26px; height: 26px;
    display: flex; align-items: center; justify-content: center;
  }
  .cal-day.selected { background: #EEF2FF; }
  .cal-day.selected .cal-day-num { color: #4F46E5; font-weight: 800; }
  .cal-day.today.selected .cal-day-num { background: #4F46E5; color: #fff; }

  .cal-day-num { font-size: 13px; font-weight: 500; color: #374151; line-height: 1; }
  .cal-day.empty .cal-day-num { color: transparent; }

  .cal-dots { display: flex; gap: 2px; margin-top: 3px; }
  .cal-dot { width: 5px; height: 5px; border-radius: 50%; }

  /* Day tasks panel */
  .cal-day-tasks { flex: 1; display: flex; flex-direction: column; }
  .cal-day-tasks-hdr {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px 8px;
  }
  .cal-day-tasks-lbl { font-size: 14px; font-weight: 700; color: #111827; text-transform: capitalize; }
  .cal-day-tasks-count { font-size: 12px; color: #6B7280; font-weight: 500; }
  .cal-day-tasks-body { padding: 0 16px; flex: 1; }

  .cal-empty { display: flex; flex-direction: column; align-items: center; padding: 28px 0; gap: 8px; }
  .cal-empty-ic { font-size: 32px; }
  .cal-empty-txt { font-size: 13px; color: #9CA3AF; font-weight: 500; }
`;

