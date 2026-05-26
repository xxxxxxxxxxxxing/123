# Batch compress all mp4 under assets/ into assets_web/ (720p, H.264 CRF 28, AAC 96k)
$ErrorActionPreference = 'Stop'
$ffmpeg = 'C:\Users\brucewzhao\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe'

$root = $PSScriptRoot
$srcRoot = Join-Path $root 'assets'
$dstRoot = Join-Path $root 'assets_web'

if (!(Test-Path $srcRoot)) { throw "Source not found: $srcRoot" }

$files = Get-ChildItem -Path $srcRoot -Recurse -File -Filter *.mp4
$total = $files.Count
$i = 0

foreach ($f in $files) {
    $i++
    $rel = $f.FullName.Substring($srcRoot.Length).TrimStart('\','/')
    $dst = Join-Path $dstRoot $rel
    $dstDir = Split-Path $dst -Parent
    if (!(Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir -Force | Out-Null }

    if (Test-Path $dst) {
        Write-Host "[$i/$total] SKIP (exists) $rel" -ForegroundColor DarkGray
        continue
    }

    Write-Host "[$i/$total] Encoding $rel" -ForegroundColor Cyan
    & $ffmpeg -hide_banner -loglevel error -y -i $f.FullName `
        -vf "scale='min(1280,iw)':'-2'" `
        -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p `
        -movflags +faststart `
        -c:a aac -b:a 96k -ac 2 `
        $dst
    if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed on $rel" }

    $origMB = [math]::Round($f.Length / 1MB, 2)
    $newMB  = [math]::Round((Get-Item $dst).Length / 1MB, 2)
    Write-Host ("       {0} MB -> {1} MB" -f $origMB, $newMB) -ForegroundColor Green
}

$totalMB = [math]::Round(((Get-ChildItem -Recurse -File $dstRoot | Measure-Object Length -Sum).Sum / 1MB), 2)
Write-Host "`nDone. assets_web total = $totalMB MB" -ForegroundColor Yellow
