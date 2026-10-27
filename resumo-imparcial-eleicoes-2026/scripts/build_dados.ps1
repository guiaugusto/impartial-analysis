# Gera os JSONs do site a partir dos dados do TSE.
# Uso: powershell -File build_dados.ps1 -Cache <pasta com mun/*.json, cfg.json, tse/, geo/>
# Rode novamente quando o TSE publicar os CSVs por zona do 2o turno (ver Obter-Zonas T2 abaixo).
param([Parameter(Mandatory)][string]$Cache)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$out  = Join-Path $root 'data'
New-Item -ItemType Directory -Force "$out\zonas", "$out\geo" | Out-Null
$utf8 = New-Object Text.UTF8Encoding($false)
function Save($path, $obj) { [IO.File]::WriteAllText($path, ($obj | ConvertTo-Json -Depth 8 -Compress), $utf8) }

$cfg = Get-Content "$Cache\cfg.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$ELE = @{ 1 = '6257'; 2 = '6258' }

function Get-Votos($j) {
  $l = 0; $f = 0
  foreach ($ag in $j.carg[0].agr) { foreach ($p in $ag.par) { foreach ($c in $p.cand) {
    if ($c.n -eq '13') { $l = [int64]$c.vap } elseif ($c.n -eq '22') { $f = [int64]$c.vap } } } }
  $vv = [int64]$j.v.vv
  # [aptos, comparecimento, abstencao, lula, flavio, outros, brancos, nulos, validos]
  ,@([int64]$j.e.te, [int64]$j.e.c, [int64]$j.e.a, $l, $f, ($vv - $l - $f), [int64]$j.v.vb, [int64]$j.v.vn, $vv)
}

$muns = [ordered]@{}; $exterior = @{ 1 = $null; 2 = $null }
$tot = @{ 1 = New-Object 'int64[]' 9; 2 = New-Object 'int64[]' 9 }
$ext = @{ 1 = New-Object 'int64[]' 9; 2 = New-Object 'int64[]' 9 }
$ufTot = @{}
$falhas = New-Object Collections.ArrayList
foreach ($a in $cfg.abr) {
  $uf = $a.cd
  foreach ($m in $a.mu) {
    foreach ($t in 1, 2) {
      $fp = "$Cache\mun\$($ELE[$t])-$uf$($m.cd).json"
      if (-not (Test-Path $fp) -or (Get-Item $fp).Length -lt 300) { [void]$falhas.Add("$t/$uf/$($m.cd)"); continue }
      $v = Get-Votos (Get-Content $fp -Raw -Encoding UTF8 | ConvertFrom-Json)
      if ($uf -eq 'zz') { for ($i = 0; $i -lt 9; $i++) { $ext[$t][$i] += $v[$i] } }
      else {
        $k = $m.cdi
        if (-not $muns.Contains($k)) { $muns[$k] = @{ n = $m.nm; u = $uf.ToUpper(); c = $m.cd; z = @($m.z); t1 = $null; t2 = $null } }
        $muns[$k]["t$t"] = $v
        if (-not $ufTot.ContainsKey($uf)) { $ufTot[$uf] = @{ t1 = New-Object 'int64[]' 9; t2 = New-Object 'int64[]' 9 } }
        for ($i = 0; $i -lt 9; $i++) { $ufTot[$uf]["t$t"][$i] += $v[$i] }
      }
      for ($i = 0; $i -lt 9; $i++) { $tot[$t][$i] += $v[$i] }
    }
  }
}
Save "$out\municipios.json" $muns

# Totais oficiais (arquivos nacionais do TSE) para conferir com a soma dos municipios
$oficial = @{}
foreach ($t in 1, 2) {
  $fp = "$Cache\br$t.json"
  if ((Test-Path $fp) -and (Get-Item $fp).Length -gt 300) {
    $j = Get-Content $fp -Raw -Encoding UTF8 | ConvertFrom-Json
    $outros = @()
    foreach ($ag in $j.carg[0].agr) { foreach ($p in $ag.par) { foreach ($c in $p.cand) {
      $outros += @{ n = $c.n; nome = $c.nmu; votos = [int64]$c.vap; pct = $c.pvap } } } }
    $oficial["t$t"] = @{ geradoEm = "$($j.dg) $($j.hg)"; secoesApuradasPct = $j.s.pst; aptos = [int64]$j.e.te; comparecimento = [int64]$j.e.c; abstencao = [int64]$j.e.a
      validos = [int64]$j.v.vv; brancos = [int64]$j.v.vb; nulos = [int64]$j.v.vn; candidatos = $outros }
  }
}
foreach ($t in 1, 2) {
  # Sem o arquivo nacional do TSE, usa a soma dos municipios (inclui exterior)
  if (-not $oficial.ContainsKey("t$t") -and $falhas.Count -eq 0) {
    $s = $tot[$t]
    $oficial["t$t"] = @{ geradoEm = "soma dos municipios, $(Get-Date -Format 'dd/MM/yyyy HH:mm')"; secoesApuradasPct = '—'; aptos = $s[0]; comparecimento = $s[1]; abstencao = $s[2]
      validos = $s[8]; brancos = $s[6]; nulos = $s[7]; candidatos = @(@{ n = '13'; nome = 'LULA'; votos = $s[3] }, @{ n = '22'; nome = 'FLAVIO BOLSONARO'; votos = $s[4] }) }
  }
}
function Arr($a) { , [object[]]@($a | ForEach-Object { $_ }) }
$ufOut = @{}; foreach ($k in $ufTot.Keys) { $ufOut[$k] = @{ t1 = (Arr $ufTot[$k].t1); t2 = (Arr $ufTot[$k].t2) } }
Save "$out\resumo.json" @{ oficial = $oficial; somaMunicipios = @{ t1 = (Arr $tot[1]); t2 = (Arr $tot[2]) }; exterior = @{ t1 = (Arr $ext[1]); t2 = (Arr $ext[2]) }
  uf = $ufOut; falhas = $falhas; campos = @('aptos', 'comparecimento', 'abstencao', 'lula', 'flavio', 'outros', 'brancos', 'nulos', 'validos'); geradoEm = (Get-Date -Format s) }

# Totais por UF: arquivos oficiais de UF quando baixados; senao, soma dos municipios ja baixados (marcado parcial)
$ufs = [ordered]@{}
foreach ($a in $cfg.abr) {
  $uf = $a.cd; if ($uf -eq 'zz') { continue }
  $o = @{ t1 = $null; t2 = $null; p1 = $false; p2 = $false }
  foreach ($t in 1, 2) {
    $fp = "$Cache\uf\$($ELE[$t])-$uf.json"
    if ((Test-Path $fp) -and (Get-Item $fp).Length -gt 300) { $o["t$t"] = Get-Votos (Get-Content $fp -Raw -Encoding UTF8 | ConvertFrom-Json) }
    elseif ($ufTot.ContainsKey($uf)) { $o["t$t"] = Arr $ufTot[$uf]["t$t"]; $o["p$t"] = $true }
  }
  $ufs[$uf.ToUpper()] = $o
}
Save "$out\ufs.json" $ufs

# Zonas do 1o turno (CSV aberto do TSE). Para o 2o turno, quando o TSE publicar, repetir com NR_TURNO=2.
function Ler-Csv($path) { Import-Csv $path -Delimiter ';' -Encoding Default }
$det = Ler-Csv "$Cache\tse\detalhe_votacao_munzona_2026_BR.csv" | ?{ $_.CD_CARGO -eq '1' }
$cand = Ler-Csv "$Cache\tse\votacao_candidato_munzona_2026_BR.csv" | ?{ $_.CD_CARGO -eq '1' }
$porZona = @{}
foreach ($t in 1, 2) {
  $d = $det | ?{ $_.NR_TURNO -eq "$t" }
  if (-not $d) { continue }
  $cv = @{}; $cand | ?{ $_.NR_TURNO -eq "$t" } | %{ $cv["$($_.CD_MUNICIPIO)/$($_.NR_ZONA)/$($_.NR_CANDIDATO)"] = [int64]$_.QT_VOTOS_NOMINAIS_VALIDOS }
  foreach ($r in $d) {
    $mk = "$($r.SG_UF)/$($r.CD_MUNICIPIO.PadLeft(5,'0'))"
    if (-not $porZona.ContainsKey($mk)) { $porZona[$mk] = @{} }
    $zk = [string][int]$r.NR_ZONA
    if (-not $porZona[$mk].ContainsKey($zk)) { $porZona[$mk][$zk] = @{ t1 = $null; t2 = $null } }
    $l = $cv["$($r.CD_MUNICIPIO)/$($r.NR_ZONA)/13"]; $f = $cv["$($r.CD_MUNICIPIO)/$($r.NR_ZONA)/22"]
    $vv = [int64]$r.QT_TOTAL_VOTOS_VALIDOS
    $porZona[$mk][$zk]["t$t"] = @([int64]$r.QT_APTOS, [int64]$r.QT_COMPARECIMENTO, [int64]$r.QT_ABSTENCOES, $l, $f, ($vv - $l - $f), [int64]$r.QT_VOTOS_BRANCOS, [int64]$r.QT_TOTAL_VOTOS_NULOS, $vv)
  }
}
$porUf = @{}
foreach ($mk in $porZona.Keys) { $uf, $cm = $mk.Split('/'); if (-not $porUf[$uf]) { $porUf[$uf] = [ordered]@{} }; $porUf[$uf][$cm] = $porZona[$mk] }
foreach ($uf in $porUf.Keys) { Save "$out\zonas\$($uf.ToLower()).json" $porUf[$uf] }
Write-Host "municipios: $($muns.Count); falhas: $($falhas.Count)"
