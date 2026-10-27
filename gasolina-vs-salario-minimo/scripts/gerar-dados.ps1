# Gera data/dados.json a partir das planilhas públicas da ANP (gasolina comum, revenda).
# - Brasil: série SEMANAL desde 2013, média das semanas de cada mês (semana contada pelo dia 4 após a data inicial).
# - Municípios: séries MENSAIS por município (2013 a 2026), preço médio de revenda em centavos (0 = sem pesquisa).
# Uso: powershell -File scripts/gerar-dados.ps1 [-Pasta <pasta de cache dos .xlsx>] [-FimMes 2026-10]
param([string]$Pasta = (Join-Path $env:TEMP "anp_gasolina"), [string]$FimMes = "2026-10")
$ErrorActionPreference = 'Stop'
$ler = Join-Path $PSScriptRoot "ler-xlsx.ps1"
$saida = Join-Path (Split-Path $PSScriptRoot -Parent) "data\dados.json"
New-Item -ItemType Directory -Force $Pasta | Out-Null
$base = "https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos/precos-revenda-e-de-distribuicao-combustiveis/shlp"
$arquivos = [ordered]@{
  "semanal-brasil-desde-2013"        = "$base/semanal/semanal-brasil-desde-2013.xlsx"
  "mensal-municipios-2013-a-2015"    = "$base/mensal/mensal-municipios-2013-a-2015.xlsx"
  "mensal-municipios-2016-a-2018"    = "$base/mensal/mensal-municipios-2016-a-2018.xlsx"
  "mensal-municipios-2019-a-2021"    = "$base/mensal/mensal-municipios-2019-a-2021.xlsx"
  "mensal-municipios-jan2022-2025"   = "$base/mensal/mensal-municipios-jan2022-2025.xlsx"
  "mensal-municipios-desde-jan2026"  = "$base/mensal/mensal-municipios-desde-jan2026.xlsx"
}
foreach ($nome in $arquivos.Keys) {
  $x = Join-Path $Pasta "$nome.xlsx"
  if (-not (Test-Path $x)) { Write-Host "Baixando $nome"; Invoke-WebRequest $arquivos[$nome] -OutFile $x }
}
# extrai só as linhas de gasolina comum, em paralelo
$jobs = foreach ($nome in $arquivos.Keys) {
  $tsv = Join-Path $Pasta "$nome.gas.tsv"
  if (-not (Test-Path $tsv)) {
    Start-Job -ArgumentList $ler, (Join-Path $Pasta "$nome.xlsx"), $tsv -ScriptBlock {
      param($ler, $x, $o) & $ler -Arquivo $x -Saida $o -Filtro "GASOLINA COMUM"
    }
  }
}
if ($jobs) { $jobs | Wait-Job | Out-Null; $jobs | Receive-Job | Out-Null }

$inv = [Globalization.CultureInfo]::InvariantCulture
$ini = [datetime]'1899-12-30'
$fy, $fm = $FimMes.Split('-'); $n = ([int]$fy - 2013) * 12 + [int]$fm
function Campos($linha) {
  $m = @{}
  foreach ($c in ($linha -split "`t")) { $i = $c.IndexOf('='); if ($i -gt 0) { $m[$c.Substring(0, $i)] = $c.Substring($i + 1) } }
  $m
}
# Brasil (semanal: A=data inicial, C=produto, F=preço médio de revenda)
$soma = New-Object 'double[]' $n; $qtd = New-Object 'int[]' $n
foreach ($linha in [IO.File]::ReadLines((Join-Path $Pasta "semanal-brasil-desde-2013.gas.tsv"))) {
  $m = Campos $linha
  if ($m['C'] -ne 'GASOLINA COMUM') { continue }
  $d = 0.0; $p = 0.0
  if (-not [double]::TryParse($m['A'], 'Float', $inv, [ref]$d)) { continue }
  if (-not [double]::TryParse($m['F'], 'Float', $inv, [ref]$p)) { continue }
  $dt = $ini.AddDays($d).AddDays(3)
  $i = ($dt.Year - 2013) * 12 + $dt.Month - 1
  if ($i -ge 0 -and $i -lt $n) { $soma[$i] += $p; $qtd[$i]++ }
}
$brasil = for ($i = 0; $i -lt $n; $i++) { if ($qtd[$i]) { ($soma[$i] / $qtd[$i]).ToString('0.000', $inv) } else { 'null' } }

# Salário mínimo nacional vigente em cada mês (valores dos decretos anuais; conferir no DIEESE)
$sal = @{2013=678;2014=724;2015=788;2016=880;2017=937;2018=954;2019=998;2020=1045;2021=1100;2022=1212;2023=1320;2024=1412;2025=1518;2026=1621}
$salario = for ($i = 0; $i -lt $n; $i++) {
  $y = 2013 + [math]::Floor($i / 12); $mes = $i % 12 + 1
  $v = $sal[[int]$y]
  if ($y -eq 2020 -and $mes -eq 1) { $v = 1039 }
  if ($y -eq 2023 -and $mes -lt 5) { $v = 1302 }
  $v
}

# Municípios (mensal: A=mês, B=produto, D=estado, E=município, F=postos pesquisados, H=preço médio de revenda)
$dados = @{}; $postos = @{}
foreach ($f in (Get-ChildItem (Join-Path $Pasta "mensal-municipios-*.gas.tsv"))) {
  foreach ($linha in [IO.File]::ReadLines($f.FullName)) {
    $m = Campos $linha
    if ($m['B'] -ne 'GASOLINA COMUM') { continue }
    $d = 0.0; $p = 0.0
    if (-not [double]::TryParse($m['A'], 'Float', $inv, [ref]$d)) { continue }
    if (-not [double]::TryParse($m['H'], 'Float', $inv, [ref]$p)) { continue }
    $dt = $ini.AddDays($d)
    $i = ($dt.Year - 2013) * 12 + $dt.Month - 1
    if ($i -lt 0 -or $i -ge $n) { continue }
    $k = $m['D'] + '|' + $m['E']
    if (-not $dados.ContainsKey($k)) { $dados[$k] = New-Object 'int[]' $n; $postos[$k] = New-Object 'System.Collections.Generic.List[int]' }
    $dados[$k][$i] = [int][math]::Round($p * 100)
    $np = 0; if ([int]::TryParse($m['F'], [ref]$np)) { $postos[$k].Add($np) }
  }
}
$munis = foreach ($k in ($dados.Keys | Sort-Object)) {
  $arr = $dados[$k]
  if (($arr | Where-Object { $_ -gt 0 }).Count -lt 12) { continue }   # descarta municípios com menos de 12 meses
  $est, $nome = $k.Split('|', 2)
  $pm = 0; if ($postos[$k].Count) { $pm = [int][math]::Round(($postos[$k] | Measure-Object -Average).Average) }
  '{"nome":"' + $nome.Replace('"', '') + '","estado":"' + $est + '","postos":' + $pm + ',"p":[' + ($arr -join ',') + ']}'
}
$json = '{"inicio":"2013-01","brasil":[' + ($brasil -join ',') + '],"salarioMinimo":[' + ($salario -join ',') + '],"municipios":[' + ($munis -join ",`n") + ']}'
New-Item -ItemType Directory -Force (Split-Path $saida) | Out-Null
[IO.File]::WriteAllText($saida, $json, (New-Object Text.UTF8Encoding($false)))
Write-Host ("OK: {0} meses, {1} municípios, {2:N0} bytes -> {3}" -f $n, @($munis).Count, (Get-Item $saida).Length, $saida)
