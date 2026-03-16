Set-Location $PSScriptRoot
$src = 'poster-placeholder.png'
1..99 | ForEach-Object {
    $name = 'image-{0:D2}.png' -f $_
    Copy-Item $src $name
}
# image-100.png
Copy-Item $src 'image-100.png'
Write-Host 'Created image-01.png through image-100.png'
