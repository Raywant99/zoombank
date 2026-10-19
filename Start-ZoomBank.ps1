<#
.SYNOPSIS
  ZoomBank: Video-Verified Instant Loan Portal Launcher
  Starts a lightweight local HTTP web server and opens the browser.
#>

$port = 8080
$folder = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if port is already in use, if so pick another
$inUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($inUse) {
    $port = 8085
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  ZoomBank: Video-Verified Instant Loan Portal" -ForegroundColor Green
Write-Host "  Antigravity Multi-Agent Orchestration Enabled" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Serving from : $folder" -ForegroundColor Gray
Write-Host "Local URL    : http://localhost:$port/" -ForegroundColor White
Write-Host "Press Ctrl+C to stop the server.`n" -ForegroundColor DarkGray

# Launch browser
$url = "http://localhost:$port/index.html"
Start-Process $url

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
} catch {
    Write-Host "Notice: HttpListener reservation restricted. Opening static index.html directly in browser..." -ForegroundColor Yellow
    Start-Process "$folder\index.html"
    exit 0
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($localPath) -or $localPath -eq '/') {
            $localPath = "index.html"
        }

        $filePath = Join-Path $folder $localPath
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Simple MIME detection
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = "application/octet-stream"
            switch ($ext) {
                ".html" { $mime = "text/html; charset=utf-8" }
                ".css"  { $mime = "text/css; charset=utf-8" }
                ".js"   { $mime = "application/javascript; charset=utf-8" }
                ".svg"  { $mime = "image/svg+xml" }
                ".png"  { $mime = "image/png" }
                ".jpg"  { $mime = "image/jpeg" }
                ".jpeg" { $mime = "image/jpeg" }
                ".json" { $mime = "application/json" }
            }

            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # Catch connection breaks
    }
}
