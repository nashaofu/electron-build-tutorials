cd src
$env:CHROMIUM_BUILDTOOLS_PATH = "$(Get-Location)\buildtools"

gn gen out/Testing --args="import(\`"//electron/build/args/testing.gn\`")" --ide=vs2022
ninja -C out/Testing electron
