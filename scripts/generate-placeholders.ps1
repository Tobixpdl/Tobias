Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $projectRoot "public\projects"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$projects = @(
  @{ Slug="burger-house"; Name="BURGER HOUSE"; Kicker="MENÚ DIGITAL"; Bg="#17120F"; Accent="#FF6B35"; Soft="#F5D1A7" },
  @{ Slug="cafe-norte"; Name="CAFÉ NORTE"; Kicker="CAFÉ DE ESPECIALIDAD"; Bg="#26221D"; Accent="#C99A63"; Soft="#F4EBDD" },
  @{ Slug="dulce-atelier"; Name="DULCE ATELIER"; Kicker="PASTELERÍA ARTESANAL"; Bg="#382832"; Accent="#E9A7B9"; Soft="#FFF1F4" },
  @{ Slug="estudio-profesional"; Name="ESTUDIO NORTE"; Kicker="ASESORAMIENTO PROFESIONAL"; Bg="#152437"; Accent="#78A9D1"; Soft="#E9F2F8" },
  @{ Slug="servicio-tecnico"; Name="SERVICIO TECNICO"; Kicker="SOLUCIONES EN EL DÍA"; Bg="#122E2D"; Accent="#2EC4B6"; Soft="#E8F7F4" },
  @{ Slug="comercio-local"; Name="MERCADO LOCAL"; Kicker="PRODUCTOS SELECCIONADOS"; Bg="#302A18"; Accent="#D4AF55"; Soft="#F7F1DF" }
)

function Get-Color([string]$hex) {
  return [System.Drawing.ColorTranslator]::FromHtml($hex)
}

function New-Preview($project, [int]$width, [int]$height, [string]$path, [bool]$mobile) {
  $bitmap = New-Object System.Drawing.Bitmap $width, $height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $bg = Get-Color $project.Bg
  $accent = Get-Color $project.Accent
  $soft = Get-Color $project.Soft
  $graphics.Clear($bg)

  $gradientRect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
  $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush $gradientRect, $bg, ([System.Drawing.Color]::FromArgb(45, $accent)), 35
  $graphics.FillRectangle($gradient, $gradientRect)

  $pad = if ($mobile) { 26 } else { 58 }
  $logoSize = if ($mobile) { 24 } else { 34 }
  $graphics.FillEllipse((New-Object System.Drawing.SolidBrush $accent), $pad, $pad, $logoSize, $logoSize)
  $navBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(125, $soft))
  $graphics.FillRectangle($navBrush, $pad + $logoSize + 14, $pad + 7, $(if ($mobile) { 78 } else { 128 }), 6)

  $kickerFont = New-Object System.Drawing.Font "Segoe UI", $(if ($mobile) { 8 } else { 13 }), ([System.Drawing.FontStyle]::Bold)
  $titleFont = New-Object System.Drawing.Font "Segoe UI", $(if ($mobile) { 25 } else { 52 }), ([System.Drawing.FontStyle]::Bold)
  $bodyFont = New-Object System.Drawing.Font "Segoe UI", $(if ($mobile) { 9 } else { 15 }), ([System.Drawing.FontStyle]::Regular)
  $graphics.DrawString($project.Kicker, $kickerFont, (New-Object System.Drawing.SolidBrush $accent), $pad, $(if ($mobile) { 102 } else { 148 }))
  $titleRect = New-Object System.Drawing.RectangleF $pad, $(if ($mobile) { 126 } else { 180 }), ($width - $pad * 2), $(if ($mobile) { 110 } else { 125 })
  $graphics.DrawString($project.Name, $titleFont, (New-Object System.Drawing.SolidBrush $soft), $titleRect)
  $graphics.DrawString("Una propuesta clara, directa y preparada para celular.", $bodyFont, $navBrush, $pad, $(if ($mobile) { 235 } else { 315 }))

  $buttonY = if ($mobile) { 280 } else { 365 }
  $buttonW = if ($mobile) { 112 } else { 170 }
  $buttonH = if ($mobile) { 34 } else { 46 }
  $graphics.FillRectangle((New-Object System.Drawing.SolidBrush $accent), $pad, $buttonY, $buttonW, $buttonH)
  $buttonFont = New-Object System.Drawing.Font "Segoe UI", $(if ($mobile) { 8 } else { 11 }), ([System.Drawing.FontStyle]::Bold)
  $graphics.DrawString("VER PROPUESTA", $buttonFont, (New-Object System.Drawing.SolidBrush $bg), $pad + 13, $buttonY + $(if ($mobile) { 9 } else { 13 }))

  if ($mobile) {
    $cardY = 350
    for ($index = 0; $index -lt 3; $index++) {
      $y = $cardY + ($index * 82)
      $cardBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(20 + ($index * 10), $soft))
      $graphics.FillRectangle($cardBrush, $pad, $y, $width - ($pad * 2), 66)
      $graphics.FillEllipse((New-Object System.Drawing.SolidBrush $accent), $pad + 12, $y + 13, 38, 38)
      $graphics.FillRectangle($navBrush, $pad + 64, $y + 18, 108, 6)
      $graphics.FillRectangle($navBrush, $pad + 64, $y + 34, 72, 4)
    }
  } else {
    $cardY = 455
    $gap = 18
    $cardW = [int](($width - ($pad * 2) - ($gap * 2)) / 3)
    for ($index = 0; $index -lt 3; $index++) {
      $x = $pad + ($index * ($cardW + $gap))
      $cardBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(20 + ($index * 10), $soft))
      $graphics.FillRectangle($cardBrush, $x, $cardY, $cardW, 108)
      $graphics.FillEllipse((New-Object System.Drawing.SolidBrush $accent), $x + 18, $cardY + 18, 40, 40)
      $graphics.FillRectangle($navBrush, $x + 18, $cardY + 75, $cardW - 36, 5)
      $graphics.FillRectangle($navBrush, $x + 18, $cardY + 89, [int](($cardW - 36) * .65), 4)
    }
  }

  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $gradient.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

foreach ($project in $projects) {
  New-Preview $project 960 600 (Join-Path $outputDir "$($project.Slug)-desktop.png") $false
  New-Preview $project 320 640 (Join-Path $outputDir "$($project.Slug)-mobile.png") $true
}

$favicon = New-Object System.Drawing.Bitmap 64, 64
$iconGraphics = [System.Drawing.Graphics]::FromImage($favicon)
$iconGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$iconGraphics.Clear((Get-Color "#0E1726"))
$iconGraphics.FillRectangle((New-Object System.Drawing.SolidBrush (Get-Color "#FF6B35")), 8, 8, 14, 14)
$iconFont = New-Object System.Drawing.Font "Segoe UI", 30, ([System.Drawing.FontStyle]::Bold)
$iconGraphics.DrawString("T", $iconFont, (New-Object System.Drawing.SolidBrush (Get-Color "#F8FAFC")), 20, 13)
$favicon.Save((Join-Path $projectRoot "public\favicon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$iconGraphics.Dispose()
$favicon.Dispose()
