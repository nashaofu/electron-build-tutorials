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

   如需要拉取指定分支或 tag，只需修改`gclient config`命令即可

   ```sh
   # 拉取指定分支
   gclient config --name "src/electron" --unmanaged https://github.com/electron/electron@branch-name
   # 拉取指定tag
   gclient config --name "src/electron" --unmanaged https://github.com/electron/electron@tag-name
   ```

6. 构建，可以使用`CMD`与`powershell`进行构建

   - CMD

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

   - 生成 vs 项目

   ```sh
   cd src
   $env:CHROMIUM_BUILDTOOLS_PATH = "$(Get-Location)\buildtools"

   gn gen out/Testing --args="import(\`"//electron/build/args/testing.gn\`")" --ide=vs2017
   ```

7. 运行如下命令，即可启动 electron 默认应用的界面

   ```sh
   ./out/Testing/electron.exe
   ```

## 断点调试

如果需要断点调试，需要修改`src/electron/build/args/testing.gn`文件中`symbol_level=2`，这样才能在调试器中展示出变量等内容。

```diff
import("all.gn")
is_debug = false
is_component_build = false
is_component_ffmpeg = true
is_official_build = false
dcheck_always_on = true
- symbol_level = 1
+ symbol_level = 2

# This may be guarded behind is_chrome_branded alongside
# proprietary_codecs https://webrtc-review.googlesource.com/c/src/+/36321,
# explicitly override here to build OpenH264 encoder/FFmpeg decoder.
# The initialization of the decoder depends on whether ffmpeg has
# been built with H.264 support.
rtc_use_h264 = proprietary_codecs
```

以 vscode 举例，在 electron 根目录下(.gclient 所在目录)，添加`.vscode/launch.json`。然后就可以断点调试了。

```json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "electron",
      "type": "cppvsdbg",
      "request": "launch",
      "program": "${workspaceFolder}\\src\\out\\Testing\\electron.exe",
      "args": ["../electron_project"],
      "stopAtEntry": false,
      "cwd": "${workspaceFolder}",
      "environment": [
        { "name": "ELECTRON_ENABLE_LOGGING", "value": "true" },
        { "name": "ELECTRON_ENABLE_STACK_DUMPING", "value": "true" },
        { "name": "ELECTRON_RUN_AS_NODE", "value": "" }
      ],
      "console": "internalConsole",
      "sourceFileMap": {
        "o:\\": "${workspaceFolder}/src"
      }
    }
  ]
}
```

调试时，通常需要构造 electron 的执行逻辑，只需要在`launch.json`中的 args 字段添加调试的 electron 项目即可，具体可参考 electron 文档

## 附件

- [init.ps1](init.ps1) 拉取 electron 源码
- [build.ps1](build.ps1) 编译 Testing 代码
- [launch.json](launch.json) 断点调试配置
- [launch.json](launch.json) 断点调试配置
