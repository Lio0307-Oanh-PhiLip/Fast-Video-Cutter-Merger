; =====================================================================
; Inno Setup Script: Fast Video Cutter & Merger Studio v3.2.2 PRO Setup
; Builds: Output\FastVideoEditor_v3.2.2_Setup.exe for Windows 10 / 11 (x64)
; =====================================================================

#define MyAppName "Fast Video Cutter & Merger Studio"
#define MyAppVersion "3.2.2"
#define MyAppPublisher "Lossless Video Tools"
#define MyAppExeName "FastVideoEditor.exe"

[Setup]
AppId={{D3F9B7E1-83A4-4E8B-B74F-935C7A2E9F01}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\FastVideoEditor
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
OutputDir=Output
OutputBaseFilename=FastVideoEditor_v3.2.2_Setup
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=lowest
SetupIconFile=icon.ico
UninstallDisplayIcon={app}\icon.ico

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; 1. Cac file ma nguon va launcher luon co san (Khong bao gio bao loi thieu file)
Source: "fast_video_editor.py"; DestDir: "{app}"; Flags: ignoreversion
Source: "run_windows.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "setup_wizard.py"; DestDir: "{app}"; Flags: ignoreversion skipifsourcedoesntexist
Source: "icon.ico"; DestDir: "{app}"; Flags: ignoreversion skipifsourcedoesntexist
Source: "icon.png"; DestDir: "{app}"; Flags: ignoreversion skipifsourcedoesntexist
Source: "fast-video-editor.png"; DestDir: "{app}"; Flags: ignoreversion skipifsourcedoesntexist
Source: "requirements.txt"; DestDir: "{app}"; Flags: ignoreversion skipifsourcedoesntexist
Source: "README.txt"; DestDir: "{app}"; Flags: ignoreversion skipifsourcedoesntexist
Source: "README.md"; DestDir: "{app}"; Flags: ignoreversion skipifsourcedoesntexist

; 2. Cac file bien dich tu PyInstaller (neu co se dong goi, neu chua thi bo qua nho skipifsourcedoesntexist)
Source: "dist\FastVideoEditor\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs skipifsourcedoesntexist
Source: "FastVideoEditor.exe"; DestDir: "{app}"; Flags: ignoreversion skipifsourcedoesntexist

[Icons]
; Tao bieu tuong shortcut: Uu tien FastVideoEditor.exe neu co, neu khong se tro vao run_windows.bat
Name: "{group}\{#MyAppName}"; Filename: "{app}\FastVideoEditor.exe"; Check: FileExists(ExpandConstant('{app}\FastVideoEditor.exe')); IconFilename: "{app}\icon.ico"
Name: "{group}\{#MyAppName}"; Filename: "{app}\run_windows.bat"; Check: not FileExists(ExpandConstant('{app}\FastVideoEditor.exe')); IconFilename: "{app}\icon.ico"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\FastVideoEditor.exe"; Tasks: desktopicon; Check: FileExists(ExpandConstant('{app}\FastVideoEditor.exe')); IconFilename: "{app}\icon.ico"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\run_windows.bat"; Tasks: desktopicon; Check: not FileExists(ExpandConstant('{app}\FastVideoEditor.exe')); IconFilename: "{app}\icon.ico"

[Run]
; Khoi chay sau khi cai dat xong
Filename: "{app}\FastVideoEditor.exe"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent; Check: FileExists(ExpandConstant('{app}\FastVideoEditor.exe'))
Filename: "{app}\run_windows.bat"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent; Check: not FileExists(ExpandConstant('{app}\FastVideoEditor.exe'))
