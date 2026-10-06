; =====================================================================
; Inno Setup Script: Fast Video Cutter & Merger Studio v3.1.5 PRO Setup
; Builds: Output\FastVideoEditor_v3.1.5_Setup.exe for Windows 10 / 11 (x64)
; =====================================================================

#define MyAppName "Fast Video Cutter & Merger Studio"
#define MyAppVersion "3.1.4"
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
OutputBaseFilename=FastVideoEditor_v3.1.5_Setup
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
ArchitecturesInstallIn64BitMode=x64
PrivilegesRequired=lowest

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "dist\FastVideoEditor\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "run_windows.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "fast_video_editor.py"; DestDir: "{app}"; Flags: ignoreversion; DestName: "fast_video_editor.py"
Source: "setup_wizard.py"; DestDir: "{app}"; Flags: ignoreversion skipifsourcedoesntexist
Source: "README.txt"; DestDir: "{app}"; Flags: ignoreversion isreadme

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
