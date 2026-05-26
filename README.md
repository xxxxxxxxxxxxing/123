# SLG+X 现代都市犯罪 · 项目入项简报

一个静态网页，面向新加入项目的伙伴，介绍：
- 题材由来（原始素材验证）
- 当前主力导量素材表现
- 后续工作目标（主航道 90% / 探索道 10%）

## 本地预览

```powershell
python -m http.server 5188
# 浏览器访问 http://127.0.0.1:5188/
```

## 部署（GitHub Pages）

仓库 `Settings` → `Pages` → Source 选 `Deploy from a branch`，分支 `main` / `(root)`，保存即可。
约 1 分钟后访问 `https://<your-username>.github.io/<repo-name>/`。

## 目录

```
.
├── index.html
├── styles.css
├── app.js
└── assets_web/        # 已压缩用于 Web 的视频（720p, H.264 CRF28）
    ├── original/
    ├── current/
    └── explore/
```

原始高清素材（`assets/`）通过 `.gitignore` 排除，不上传到 GitHub。
如需重新压缩，运行 `compress_videos.ps1`（需要 ffmpeg）。
