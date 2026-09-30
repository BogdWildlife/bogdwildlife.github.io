/* ASCII loader: WSH reads scripts as ANSI, so the UTF-8 build code lives in build-main.js.
   Run: cscript //nologo src\build.js [data-dir]   (default: src\data) */
var __s = new ActiveXObject("ADODB.Stream"); __s.Type = 2; __s.Charset = "utf-8"; __s.Open();
__s.LoadFromFile(new ActiveXObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) + "\\build-main.js");
var __t = __s.ReadText(); __s.Close();
eval(__t.replace(/^\uFEFF/, ""));
