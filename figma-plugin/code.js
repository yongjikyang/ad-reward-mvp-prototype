const W = 390;
const H = 780;
const GAP = 80;
const blue = '#3182F6';
const blueDark = '#1B64DA';
const blueSoft = '#E8F3FF';
const ink = '#191F28';
const ink2 = '#4E5968';
const ink3 = '#8B95A1';
const line = '#F2F4F6';
const bg = '#F9FAFB';
const gold = '#FFB331';
const goldSoft = '#FFF3DC';
const green = '#02B262';
const greenSoft = '#E5F8EF';
const red = '#F04452';
let regularFont = { family: 'Inter', style: 'Regular' };
let boldFont = { family: 'Inter', style: 'Bold' };

function hex(c) {
  const n = c.replace('#', '');
  return {
    r: parseInt(n.slice(0, 2), 16) / 255,
    g: parseInt(n.slice(2, 4), 16) / 255,
    b: parseInt(n.slice(4, 6), 16) / 255,
  };
}

function solid(color, opacity = 1) {
  return [{ type: 'SOLID', color: hex(color), opacity }];
}

function makeFrame(name, x, background = bg) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(W, H);
  f.x = x;
  f.y = 0;
  f.fills = solid(background);
  f.cornerRadius = 44;
  f.clipsContent = true;
  return f;
}

function rect(parent, name, x, y, w, h, color, radius = 0, opacity = 1) {
  const r = figma.createRectangle();
  r.name = name;
  r.x = x;
  r.y = y;
  r.resize(w, h);
  r.fills = solid(color, opacity);
  r.cornerRadius = radius;
  parent.appendChild(r);
  return r;
}

function text(parent, name, value, x, y, size = 14, color = ink, weight = 'regular', width = null, align = 'LEFT') {
  const t = figma.createText();
  t.name = name;
  t.fontName = weight === 'bold' ? boldFont : regularFont;
  t.characters = value;
  t.fontSize = size;
  t.fills = solid(color);
  t.x = x;
  t.y = y;
  t.textAlignHorizontal = align;
  if (width) t.resize(width, t.height);
  parent.appendChild(t);
  return t;
}

function button(parent, name, label, x, y, w, h, color = blue, labelColor = '#FFFFFF') {
  rect(parent, `${name} bg`, x, y, w, h, color, 16);
  const l = text(parent, `${name} label`, label, x, y + 17, 16, labelColor, 'bold', w, 'CENTER');
  return l;
}

function status(parent, time = '9:41') {
  text(parent, 'Status time', time, 24, 16, 13, ink, 'bold');
  text(parent, 'Status icons', '🔋 📶', 318, 16, 13, ink, 'bold');
}

function appbar(parent, title, extra = '') {
  text(parent, 'App bar title', title, 24, 62, 22, ink, 'bold');
  if (extra) text(parent, 'App bar extra', extra, 292, 68, 12, ink3, 'bold');
}

function tabbar(parent, active) {
  rect(parent, 'Tabbar background', 0, 702, W, 78, '#FFFFFF', 0, 0.96);
  rect(parent, 'Tabbar line', 0, 702, W, 1, line);
  const items = [
    ['미션', '✅', 'home', 44],
    ['마이', '👤', 'my', 174],
    ['환전', '💸', 'exch', 304],
  ];
  for (const [label, icon, key, x] of items) {
    const color = key === active ? blue : ink3;
    text(parent, `${label} icon`, icon, x, 715, 22, color, 'regular', 42, 'CENTER');
    text(parent, `${label} tab`, label, x, 744, 11, color, 'bold', 42, 'CENTER');
  }
}

function stat(parent, x, value, label) {
  rect(parent, `${label} stat`, x, 154, 110, 70, '#FFFFFF', 16);
  rect(parent, `${label} stat border`, x, 154, 110, 70, line, 16, 0.15);
  text(parent, `${label} value`, value, x, 170, 19, ink, 'bold', 110, 'CENTER');
  text(parent, `${label} label`, label, x, 199, 12, ink3, 'bold', 110, 'CENTER');
}

function mission(parent, y, emoji, name, meta, reward, type = 'watch', done = false) {
  rect(parent, `${name} card`, 20, y, 350, 78, done ? '#F4F7F9' : '#FFFFFF', 18);
  rect(parent, `${name} icon bg`, 36, y + 16, 46, 46, type === 'hurdle' ? goldSoft : blueSoft, 14);
  text(parent, `${name} emoji`, emoji, 47, y + 25, 22, ink, 'regular');
  text(parent, `${name} title`, name, 96, y + 18, 15, done ? ink3 : ink, 'bold', 170);
  text(parent, `${name} meta`, meta, 96, y + 43, 12, ink3, 'regular', 170);
  rect(parent, `${name} badge bg`, 286, y + 23, 68, 32, done ? greenSoft : type === 'hurdle' ? goldSoft : blueSoft, 12);
  text(parent, `${name} badge`, done ? '적립됨' : reward, 286, y + 32, 13, done ? green : type === 'hurdle' ? '#D98A00' : blue, 'bold', 68, 'CENTER');
  if (done) {
    rect(parent, `${name} check bg`, 350, y - 6, 24, 24, green, 12);
    text(parent, `${name} check`, '✓', 357, y - 3, 13, '#FFFFFF', 'bold');
  }
}

function historyRow(parent, y, title, date, amount, plus = true) {
  text(parent, `${title} title`, title, 38, y + 14, 14, ink, 'bold', 205);
  text(parent, `${title} date`, date, 38, y + 36, 12, ink3, 'regular', 205);
  text(parent, `${title} amount`, amount, 270, y + 23, 14, plus ? blue : red, 'bold', 80, 'RIGHT');
}

function loginFrame(x) {
  const f = makeFrame('01 Login - 토스 시작', x, '#FFFFFF');
  status(f, '9:41');
  rect(f, 'Blue soft gradient base', 0, 390, W, 390, blueSoft);
  text(f, 'Coin illustration', '🪙', 32, 255, 72, ink);
  text(f, 'Hero title 1', '광고 보고', 32, 360, 30, ink, 'bold');
  text(f, 'Hero title 2', '토스 포인트 받기', 32, 400, 30, blue, 'bold');
  text(f, 'Hero body', '하루 10개의 광고 미션을 완료하고\n포인트를 토스머니로 바꿔보세요.', 32, 465, 15, ink2, 'regular', 300);
  button(f, 'Toss login', '토스로 3초만에 시작하기', 24, 670, 342, 56, blue);
  text(f, 'Login note', '토스 로그인만 지원해요 · 별도 가입 없음', 24, 742, 12, ink3, 'regular', 342, 'CENTER');
  return f;
}

function homeFrame(x) {
  const f = makeFrame('02 Home - 오늘의 미션', x);
  status(f, '9:41');
  appbar(f, '오늘의 미션', '6월 16일 15:55');
  rect(f, 'Point card', 20, 98, 350, 140, blue, 20);
  rect(f, 'Point card dark overlay', 20, 98, 350, 140, blueDark, 20, 0.28);
  rect(f, 'Point card shine 1', 250, 55, 180, 180, '#FFFFFF', 90, 0.12);
  rect(f, 'Point card shine 2', -30, 195, 110, 110, '#FFFFFF', 55, 0.08);
  text(f, 'Point label', '내 포인트', 42, 122, 13, '#FFFFFF', 'bold');
  text(f, 'Point value', '120P', 42, 146, 34, '#FFFFFF', 'bold');
  rect(f, 'Point sub bg', 42, 195, 190, 30, '#FFFFFF', 15, 0.16);
  text(f, 'Point sub', '오늘 4개 더 보면 +60P', 54, 203, 13, '#FFFFFF', 'bold');
  text(f, 'Mission title', '광고 미션', 24, 264, 16, ink, 'bold');
  text(f, 'Mission count', '6 / 10', 318, 267, 13, blue, 'bold');
  rect(f, 'Progress track', 24, 294, 342, 8, '#E9EDF1', 99);
  rect(f, 'Progress fill', 24, 294, 205, 8, blue, 99);
  mission(f, 322, '🛒', '초록마트 여름 특가전', '영상 시청 · 5초', '적립됨', 'watch', true);
  mission(f, 410, '👟', '달림 러닝화 신상 출시', '영상 시청 · 5초', '적립됨', 'watch', true);
  mission(f, 498, '💳', '알뜰카드 발급 이벤트', '시청 + 방문 미션 · 5초', '+20P', 'hurdle');
  mission(f, 586, '🏝️', '여름 휴가 특가 항공권', '시청 + 방문 미션 · 5초', '+20P', 'hurdle');
  tabbar(f, 'home');
  return f;
}

function adFrame(x) {
  const f = makeFrame('03 Ad Overlay - 시청/허들 미션', x, '#0B0F1A');
  text(f, 'Ad brand', '💳', 163, 190, 64, '#FFFFFF');
  text(f, 'Ad title', '알뜰카드 발급 이벤트', 70, 282, 21, '#FFFFFF', 'bold', 250, 'CENTER');
  text(f, 'Ad copy', '방문하고 혜택 확인하기', 70, 320, 14, '#9DB0CC', 'regular', 250, 'CENTER');
  rect(f, 'Timer ring bg', 158, 374, 74, 74, '#27324A', 37);
  rect(f, 'Timer ring inner', 164, 380, 62, 62, '#0B0F1A', 31);
  text(f, 'Timer number', '✓', 158, 395, 22, '#FFFFFF', 'bold', 74, 'CENTER');
  text(f, 'Ad note', '허들 미션: 페이지를 방문해야 적립돼요', 24, 606, 13, '#7C8DA6', 'regular', 342, 'CENTER');
  button(f, 'Visit CTA', '이벤트 페이지 방문하고 +20P', 24, 638, 342, 56, gold, '#3D2A00');
  text(f, 'Close CTA', '그만 볼래요 (적립 안 됨)', 24, 716, 14, '#7C8DA6', 'bold', 342, 'CENTER');
  return f;
}

function myFrame(x) {
  const f = makeFrame('04 My Page - 포인트/초대/내역', x);
  status(f, '9:41');
  appbar(f, '마이페이지');
  rect(f, 'Profile card', 20, 98, 350, 70, '#FFFFFF', 20);
  rect(f, 'Avatar bg', 40, 116, 52, 52, blueSoft, 26);
  text(f, 'Avatar', '🙂', 53, 128, 26, ink);
  text(f, 'Profile name', '토스 사용자', 106, 120, 16, ink, 'bold');
  text(f, 'Profile id', 'toss-login · 데모 계정', 106, 146, 13, ink3);
  stat(f, 20, '120P', '보유 포인트');
  stat(f, 140, '6개', '오늘 본 광고');
  stat(f, 260, '1명', '초대한 친구');
  rect(f, 'Invite card', 20, 238, 350, 76, gold, 20);
  rect(f, 'Invite card overlay', 20, 238, 350, 76, '#FF8A3D', 20, 0.22);
  text(f, 'Invite title', '친구 초대하고 +10P', 38, 256, 16, '#FFFFFF', 'bold');
  text(f, 'Invite desc', '초대 링크 공유 (데모: 탭하면 적립)', 38, 282, 13, '#FFFFFF', 'regular');
  text(f, 'Invite arrow', '›', 336, 260, 28, '#FFFFFF', 'bold');
  text(f, 'History title', '적립 · 사용 내역', 24, 342, 16, ink, 'bold');
  rect(f, 'History card', 20, 372, 350, 210, '#FFFFFF', 20);
  historyRow(f, 372, '초록마트 여름 특가전 · 광고 시청', '6월 16일 15:55', '+10P');
  rect(f, 'History line 1', 20, 442, 350, 1, line);
  historyRow(f, 442, '알뜰카드 발급 이벤트 · 방문 미션', '6월 16일 15:52', '+20P');
  rect(f, 'History line 2', 20, 512, 350, 1, line);
  historyRow(f, 512, '친구 초대 보상', '6월 16일 15:40', '+10P');
  tabbar(f, 'my');
  return f;
}

function exchangeFrame(x) {
  const f = makeFrame('05 Exchange - 토스머니 환전', x);
  status(f, '9:41');
  appbar(f, '환전하기');
  rect(f, 'Exchange hero', 20, 98, 350, 228, '#FFFFFF', 20);
  text(f, 'Pig', '🐷', 169, 122, 52, ink);
  text(f, 'Current point', '1,120P', 20, 190, 30, ink, 'bold', 350, 'CENTER');
  text(f, 'Current won', '= 약 112원', 20, 232, 14, ink3, 'bold', 350, 'CENTER');
  rect(f, 'Gauge track', 46, 272, 298, 12, '#E9EDF1', 99);
  rect(f, 'Gauge fill', 46, 272, 298, 12, gold, 99);
  text(f, 'Gauge left', '0P', 46, 292, 12, ink3, 'bold');
  text(f, 'Gauge center', '환전 가능! 🎉', 144, 292, 12, ink3, 'bold');
  text(f, 'Gauge right', '1,000P', 300, 292, 12, ink3, 'bold');
  button(f, 'Exchange CTA', '1,000P → 토스머니 100원 받기', 20, 340, 350, 56, blue);
  text(f, 'Exchange rule', '1,000P 단위로만 환전할 수 있어요 · 1P = 0.1원\n환전한 토스머니는 토스 앱 잔액으로 들어가요 (데모)', 24, 412, 12, ink3, 'regular', 342, 'CENTER');
  text(f, 'Exchange history title', '환전 내역', 24, 480, 16, ink, 'bold');
  rect(f, 'Exchange history card', 20, 510, 350, 86, '#FFFFFF', 20);
  historyRow(f, 510, '토스머니 100원 환전', '6월 16일 15:58 · 완료', '-1,000P', false);
  tabbar(f, 'exch');
  return f;
}

async function loadFonts() {
  try {
    regularFont = { family: 'Pretendard', style: 'Regular' };
    boldFont = { family: 'Pretendard', style: 'Bold' };
    await figma.loadFontAsync(regularFont);
    await figma.loadFontAsync(boldFont);
  } catch (e) {
    regularFont = { family: 'Inter', style: 'Regular' };
    boldFont = { family: 'Inter', style: 'Bold' };
    await figma.loadFontAsync(regularFont);
    await figma.loadFontAsync(boldFont);
  }
}

async function main() {
  await loadFonts();
  const frames = [loginFrame(0), homeFrame(W + GAP), adFrame((W + GAP) * 2), myFrame((W + GAP) * 3), exchangeFrame((W + GAP) * 4)];
  figma.currentPage.selection = frames;
  figma.viewport.scrollAndZoomIntoView(frames);
  figma.notify('광고보고돈벌기 MVP 화면 5개를 편집 가능한 Figma 레이어로 생성했습니다.');
  figma.closePlugin();
}

main();
