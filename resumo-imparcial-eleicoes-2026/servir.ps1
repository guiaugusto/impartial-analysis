# Servidor estático simples e rápido (várias conexões em paralelo, gzip, cache). Sem instalar nada.
# Uso: powershell -File servir.ps1 [-Porta 8080]
# No celular (mesma rede Wi-Fi): abra http://<IP-do-PC>:8080  (os IPs aparecem abaixo).
param([int]$Porta = 8080, [string]$Raiz = $PSScriptRoot)
Add-Type -TypeDefinition @'
using System; using System.IO; using System.IO.Compression; using System.Net; using System.Net.Sockets; using System.Text; using System.Threading; using System.Collections.Generic;
public class Servidor {
  static string raiz;
  static readonly Dictionary<string,string> tipos = new Dictionary<string,string>{
    {".html","text/html; charset=utf-8"},{".js","text/javascript; charset=utf-8"},{".css","text/css; charset=utf-8"},
    {".json","application/json; charset=utf-8"},{".svg","image/svg+xml"},{".png","image/png"},{".md","text/plain; charset=utf-8"}};
  static readonly Dictionary<string,byte[]> cacheGz = new Dictionary<string,byte[]>();
  public static void Iniciar(string r, int porta) {
    raiz = Path.GetFullPath(r);
    var l = new TcpListener(IPAddress.Any, porta); l.Start(256);
    while (true) { var c = l.AcceptTcpClient(); ThreadPool.QueueUserWorkItem(_ => Atender(c)); }
  }
  static void Atender(TcpClient c) {
    try {
      c.ReceiveTimeout = 5000; c.SendTimeout = 15000;
      using (c) { var s = c.GetStream();
        while (true) {
          string req = null; var gz = false; var hdrs = new StringBuilder();
          var rd = new StreamReader(s, Encoding.ASCII, false, 4096, true);
          req = rd.ReadLine(); if (req == null) return;
          string h; while ((h = rd.ReadLine()) != null && h != "") { if (h.StartsWith("Accept-Encoding", StringComparison.OrdinalIgnoreCase) && h.Contains("gzip")) gz = true; }
          var partes = req.Split(' '); if (partes.Length < 2) return;
          var caminho = Uri.UnescapeDataString(partes[1].Split('?')[0]); if (caminho == "/") caminho = "/index.html";
          var f = Path.GetFullPath(Path.Combine(raiz, caminho.TrimStart('/').Replace('/', '\\')));
          byte[] corpo; string cab;
          if (f.StartsWith(raiz) && Directory.Exists(f)) {
            if (!caminho.EndsWith("/")) { var rd301 = Encoding.ASCII.GetBytes("HTTP/1.1 301 Moved Permanently\r\nLocation: " + caminho + "/\r\nContent-Length: 0\r\nConnection: close\r\n\r\n"); s.Write(rd301, 0, rd301.Length); s.Flush(); return; }
            f = Path.Combine(f, "index.html");
          }
          if (f.StartsWith(raiz) && File.Exists(f)) {
            var ext = Path.GetExtension(f).ToLower(); string t; if (!tipos.TryGetValue(ext, out t)) t = "application/octet-stream";
            var dados = File.ReadAllBytes(f); var enc = "";
            if (gz && (ext == ".json" || ext == ".js" || ext == ".css" || ext == ".html")) {
              var chave = f + File.GetLastWriteTimeUtc(f).Ticks; byte[] z;
              lock (cacheGz) { if (!cacheGz.TryGetValue(chave, out z)) { using (var ms = new MemoryStream()) { using (var g = new GZipStream(ms, CompressionLevel.Optimal)) g.Write(dados, 0, dados.Length); z = ms.ToArray(); } cacheGz[chave] = z; } }
              dados = z; enc = "Content-Encoding: gzip\r\n";
            }
            corpo = dados; cab = "HTTP/1.1 200 OK\r\nContent-Type: " + t + "\r\n" + enc + "Content-Length: " + corpo.Length + "\r\nCache-Control: no-cache\r\nConnection: close\r\n\r\n";
          } else { corpo = Encoding.UTF8.GetBytes("404"); cab = "HTTP/1.1 404 Not Found\r\nContent-Length: 3\r\nConnection: close\r\n\r\n"; }
          var hb = Encoding.ASCII.GetBytes(cab); s.Write(hb, 0, hb.Length); s.Write(corpo, 0, corpo.Length); s.Flush(); return;
        } }
    } catch { }
  }
}
'@
$ips = [Net.Dns]::GetHostAddresses([Net.Dns]::GetHostName()) | ?{ $_.AddressFamily -eq 'InterNetwork' }
Write-Host "Servindo $Raiz";Write-Host "PC:      http://localhost:$Porta"; $ips | %{ Write-Host "Celular: http://$($_):$Porta" }
Write-Host 'Ctrl+C para parar.'
[Servidor]::Iniciar($Raiz, $Porta)
