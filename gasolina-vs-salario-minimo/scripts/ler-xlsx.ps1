# Lê a primeira planilha de um .xlsx em fluxo (sem Excel) e grava as linhas como TSV "coluna=valor".
# Uso: ler-xlsx.ps1 -Arquivo x.xlsx -Saida x.tsv [-Filtro "GASOLINA COMUM"]
# Com -Filtro, mantém só as linhas que contêm o texto (mais as 20 primeiras, que têm o cabeçalho).
param([string]$Arquivo, [string]$Saida = "", [string]$Filtro = "")
Add-Type -AssemblyName System.IO.Compression.FileSystem
$z = [IO.Compression.ZipFile]::OpenRead($Arquivo)
$sr = New-Object IO.StreamReader($z.GetEntry("xl/sharedStrings.xml").Open())
[xml]$ss = $sr.ReadToEnd(); $sr.Close()
$strs = @($ss.sst.si | ForEach-Object { $_.InnerText })
$rd = [Xml.XmlReader]::Create($z.GetEntry("xl/worksheets/sheet1.xml").Open())
$w = $null
if ($Saida) { $w = New-Object IO.StreamWriter($Saida, $false, (New-Object Text.UTF8Encoding($false))) }
$n = 0; $cols = @{}; $tipo = ''; $ref = ''
while ($rd.Read()) {
  if ($rd.NodeType -eq [Xml.XmlNodeType]::Element) {
    if ($rd.LocalName -eq 'row') { $cols = @{} }
    elseif ($rd.LocalName -eq 'c') { $tipo = $rd.GetAttribute('t'); $ref = ($rd.GetAttribute('r') -replace '\d+', '') }
    elseif ($rd.LocalName -eq 'v') {
      [void]$rd.Read(); $v = $rd.Value
      if ($tipo -eq 's') { $v = $strs[[int]$v] }
      $cols[$ref] = $v
    }
  } elseif ($rd.NodeType -eq [Xml.XmlNodeType]::EndElement -and $rd.LocalName -eq 'row') {
    $linha = (($cols.Keys | Sort-Object { $_.Length * 100 + [int][char]$_[$_.Length - 1] } | ForEach-Object { "$_=" + $cols[$_] }) -join "`t")
    if (-not $Filtro -or $n -lt 20 -or $linha -like "*$Filtro*") {
      if ($w) { $w.WriteLine($linha) } else { $linha }
    }
    $n++
  }
}
if ($w) { $w.Close() }
$rd.Close(); $z.Dispose()
