# Tạo 100 file video từ 1 file mẫu.
# Cách dùng: Đặt 1 file MP4/WebM (ví dụ sample.mp4) vào thư mục này, rồi chạy:
#   powershell -ExecutionPolicy Bypass -File create-100-videos.ps1

Set-Location $PSScriptRoot

$src = Get-ChildItem -File | Where-Object { $_.Extension -match '\.(mp4|webm|webp)$' -and $_.Name -notmatch '^video-\d' } | Select-Object -First 1
if (-not $src) {
    Write-Host 'Khong tim thay file mau (.mp4 hoac .webm). Dat 1 file vao thu muc nay roi chay lai.'
    exit 1
}
$ext = $src.Extension
1..100 | ForEach-Object {
    $dest = 'video-{0:D2}{1}' -f $_, $ext
    Copy-Item $src.FullName $dest -Force
}
Write-Host "Da tao video-01$ext .. video-100$ext tu $($src.Name)"

