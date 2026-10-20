param(
  [Parameter(Mandatory=$true)][string]$Video,
  [Parameter(Mandatory=$true)][string]$Wav,
  [Parameter(Mandatory=$true)][string]$Out,
  [double]$Limit = 0.70
)
# Replace a rendered film's audio with a freshly rendered sound.wav, limit the true peak, then report.
# -c:v copy means the picture is never re-encoded; only the audio is.
ffmpeg -v error -y -i $Video -i $Wav -map 0:v:0 -map 1:a:0 -c:v copy `
  -af "alimiter=limit=$Limit:level=false" -c:a aac -b:a 256k -ar 48000 -shortest $Out
if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed" }
ffmpeg -nostats -hide_banner -i $Out -af "ebur128=peak=true" -f null - 2>&1 |
  Select-String -Pattern "I:|LRA:|Peak:" | Select-Object -Last 3
