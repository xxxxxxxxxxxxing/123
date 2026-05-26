/* ===== 数据 ===== */
// 原始素材测试数据（题材验证阶段）
const ORIGIN_VIDEOS = [
  {
    name: "GTA3",
    src: "assets_web/original/GTA3.mp4",
    metrics: { CTR: "7.51%", CPC: "16.00" },
    highlight: "ctr-top"
  },
  {
    name: "黑帮老大模拟器2",
    src: "assets_web/original/黑帮老大模拟器2.mp4",
    metrics: { CTR: "5.63%", CPC: "19.65" }
  },
  {
    name: "GTA2",
    src: "assets_web/original/GTA2.mp4",
    metrics: { CTR: "3.31%", CPC: "25.00" }
  },
  {
    name: "警区换皮4",
    src: "assets_web/original/警区换皮4.mp4",
    metrics: { CTR: "2.45%", CPC: "27.00" }
  }
];

// 探索方向素材（10% 探索道）
const EXPLORE_VIDEOS = [
  {
    name: "V-剪辑-赛博朋克场景",
    src: "assets_web/explore/V-剪辑-赛博朋克场景.mp4",
    tag: { text: "Test1" },
    metrics: { CTR: "5.66%", CPC: "0.18" },
    highlight: "ctr-top"
  },
  {
    name: "V-剪辑-第三视角追车&射击",
    src: "assets_web/explore/V-剪辑-第三视角追车&射击.mp4",
    tag: { text: "Test1" },
    metrics: { CTR: "2.88%", CPC: "0.26" }
  },
  {
    name: "VE-像素现代生活",
    src: "assets_web/explore/像素现代生活.mp4",
    tag: { text: "Test1" },
    metrics: { CTR: "3.00%", CPC: "0.28" }
  }
];

// 当前主力导量素材
const CURRENT_VIDEOS = [
  {
    name: "【新增】-自制-GTA逃犯+逃跑战斗",
    src: "assets_web/current/high_relevance/【新增】-自制-GTA逃犯+逃跑战斗.mp4",
    tag: { text: "高相关", cls: "hot" },
    metrics: { "CPM($)": "21.34", CTR: "4.34%", CVR: "25.63%", CPI: "1.92" },
    cpiBest: true
  },
  {
    name: "实录-潜入",
    src: "assets_web/current/high_relevance/实录-潜入.mp4",
    tag: { text: "高相关", cls: "hot" },
    metrics: { "CPM($)": "25", CTR: "4.29%", CVR: "29.36%", CPI: "1.98" }
  },
  {
    name: "GTA2",
    src: "assets_web/current/differentiated/GTA2.mp4",
    tag: { text: "差异化" },
    metrics: { "CPM($)": "17.9", CTR: "5.05%", CVR: "16.52%", CPI: "2.15" }
  },
  {
    name: "GTA-E舞女的爱",
    src: "assets_web/current/differentiated/GTA-E舞女的爱.mp4",
    tag: { text: "差异化" },
    metrics: { "CPM($)": "18.4", CTR: "3.41%", CVR: "22.18%", CPI: "2.43" }
  },
  {
    name: "黑帮老大模拟器2",
    src: "assets_web/current/differentiated/黑帮老大模拟器2.mp4",
    tag: { text: "差异化" },
    metrics: { "CPM($)": "19.64", CTR: "4.83%", CVR: "18.14%", CPI: "2.24" }
  }
];

/* ===== 工具函数 ===== */
// 数值上色：CTR / CVR 越高越好；CPC / CPI 越低越好
function classifyMetric(key, valStr) {
  const v = parseFloat(valStr);
  if (isNaN(v)) return "";
  if (key === "CTR") {
    if (v >= 5) return "hot";
    if (v >= 4) return "warm";
    return "";
  }
  if (key === "CVR") {
    if (v >= 29) return "good";
    if (v >= 22) return "warm";
    return "";
  }
  if (key === "CPI") {
    if (v <= 2) return "good";
    if (v <= 2.2) return "warm";
    return "";
  }
  if (key === "CPC") {
    // 兼容两种量级：百分比记法（如 16, 25）与美金记法（如 0.18, 0.28）
    if (v < 1) {
      if (v <= 0.20) return "good";
      if (v <= 0.26) return "warm";
      return "";
    }
    if (v <= 18) return "good";
    if (v <= 22) return "warm";
    return "";
  }
  return "";
}

function buildMetrics(metrics, colsClass) {
  const items = Object.entries(metrics).map(([k, v]) => {
    const cls = classifyMetric(k, v);
    return `
      <div class="metric">
        <div class="k">${k}</div>
        <div class="v ${cls}">${v}</div>
      </div>`;
  }).join("");
  return `<div class="metrics ${colsClass}">${items}</div>`;
}

function buildVideoCard(item, mode) {
  const cols = mode === "current" ? "cols-4" : "";
  const pill = item.tag
    ? `<span class="pill ${item.tag.cls || ""}">${item.tag.text}</span>`
    : "";
  const star = item.highlight === "ctr-top"
    ? `<span class="pill hot">CTR 最高</span>` : "";
  const best = item.cpiBest
    ? `<span class="pill hot">CPI 最优</span>` : "";
  const safeSrc = encodeURI(item.src);
  const safeName = item.name.replace(/"/g, "&quot;");
  return `
    <div class="video-card">
      <div class="video-thumb" data-src="${safeSrc}" data-name="${safeName}">
        <video src="${safeSrc}" muted preload="metadata" playsinline></video>
        <div class="play-overlay"><div class="play-btn"></div></div>
      </div>
      <div class="video-info">
        <div class="video-name">
          <span>${item.name}</span>
          ${pill}${star}${best}
        </div>
        ${buildMetrics(item.metrics, cols)}
      </div>
    </div>
  `;
}

/* ===== 渲染 ===== */
document.getElementById("originGrid").innerHTML =
  ORIGIN_VIDEOS.map(v => buildVideoCard(v, "origin")).join("");
document.getElementById("currentGrid").innerHTML =
  CURRENT_VIDEOS.map(v => buildVideoCard(v, "current")).join("");
document.getElementById("exploreGrid").innerHTML =
  EXPLORE_VIDEOS.map(v => buildVideoCard(v, "explore")).join("");

/* ===== 视频弹窗 ===== */
const modal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");
const modalTitle = document.getElementById("modalTitle");

function openModal(src, name) {
  modalVideo.src = src;
  modalTitle.textContent = name;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  modalVideo.play().catch(() => {});
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
}

// 点击缩略图打开
document.querySelectorAll(".video-thumb").forEach(el => {
  el.addEventListener("click", () => {
    openModal(el.dataset.src, el.dataset.name);
  });
});

// 关闭
document.querySelectorAll("[data-close]").forEach(el => {
  el.addEventListener("click", closeModal);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

/* ===== 进度条入场动画 ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll(".bar-fill");
      fills.forEach(f => {
        const w = f.style.width;
        f.style.width = "0%";
        requestAnimationFrame(() => {
          setTimeout(() => { f.style.width = w; }, 80);
        });
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll(".goal-grid").forEach(el => observer.observe(el));

