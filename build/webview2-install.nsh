!macro customInstall
  ; 检查 WebView2 是否已安装（通过注册表）
  ReadRegStr $0 HKLM "SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" "pv"
  StrCmp $0 "" 0 webview2_done

  ReadRegStr $0 HKCU "Software\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" "pv"
  StrCmp $0 "" 0 webview2_done

  ReadRegStr $0 HKLM "SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" "pv"
  StrCmp $0 "" 0 webview2_done

  ; WebView2 未安装，使用 PowerShell 下载并静默安装
  DetailPrint "正在检测并安装 WebView2 运行时（首次安装可能需要几秒钟）..."

  ; 下载 WebView2 到临时目录
  NSISdl::download "https://go.microsoft.com/fwlink/p/?LinkId=2124703" "$TEMP\MicrosoftEdgeWebView2RuntimeSetup.exe"
  Pop $1

  ${If} $1 == 0
    DetailPrint "正在安装 WebView2，请稍候..."
    ExecWait '"$TEMP\MicrosoftEdgeWebView2RuntimeSetup.exe" /silent /install'
    Delete "$TEMP\MicrosoftEdgeWebView2RuntimeSetup.exe"
    DetailPrint "WebView2 安装完成"
  ${Else}
    DetailPrint "WebView2 下载失败，应用可能无法正常运行，请手动安装"
    DetailPrint "下载地址: https://developer.microsoft.com/en-us/microsoft-edge/webview2/"
  ${EndIf}

  webview2_done:
!macroend
