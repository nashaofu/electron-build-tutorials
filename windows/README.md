# Windows 构建步骤

1. 克隆`depot_tools`到本地

   ```sh
   git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
   ```

2. 添加`depot_tools`到`path`，并且位置必须在 python 的`path`前面
   > 依次打开 Control Panel → System and Security → System → Advanced system settings，然后修改环境变量
3. 添加环境变量`DEPOT_TOOLS_WIN_TOOLCHAIN=0`
4. 设置 git 缓存, 使用 git 缓存来加速后续对 gclient 的调用，避免执行中断后需要全量拉取代码（构建源码非常大），为此，设置 `GIT_CACHE_PATH` 环境变量，`GIT_CACHE_PATH`指定为一个目录即可。
5. 拉取源代码

   ```sh
   mkdir electron
   cd electron

   gclient config --name "src/electron" --unmanaged https://github.com/electron/electron
   gclient sync --with_branch_heads --with_tags
   ```

6. 构建，可以使用`命令提示符`与`powershell`进行构建

   - 命令提示符

   ```sh
    cd src
    set CHROMIUM_BUILDTOOLS_PATH=%cd%\buildtools

    gn gen out/Testing --args="import(\"//electron/build/args/testing.gn\")"
    ninja -C out/Testing electron
   ```

   - powershell

   ```sh
   cd src
   $env:CHROMIUM_BUILDTOOLS_PATH = "$(Get-Location)\buildtools"

   gn gen out/Testing --args="import(\`"//electron/build/args/testing.gn\`")"
   ninja -C out/Testing electron
   ```

7. 运行打包后的文件

   ```sh
   ./out/Testing/electron.exe
   ```
