<#
.SYNOPSIS
  Baixa, devagar, os dados abertos de prestação de contas do TSE para ..\dados-brutos\.
.DESCRIPTION
  Sem -Confirmar só mostra nome, URL e tamanho e não baixa nada.
  Para no primeiro erro HTTP (429, 403, 5xx), com pausa antes do download e retomada de arquivo parcial.
  A pasta dados-brutos está no .gitignore. NUNCA commitar esses arquivos.
.EXAMPLE
  powershell -File coleta/baixar.ps1 -Ano 2022 -Tipo orgaos_partidarios
  powershell -File coleta/baixar.ps1 -Ano 2022 -Tipo orgaos_partidarios -Confirmar
#>
param(
    [Parameter(Mandatory = $true)][int]$Ano,
    [Parameter(Mandatory = $true)][ValidateSet('candidatos', 'orgaos_partidarios')][string]$Tipo,
    [switch]$Confirmar
)
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$base = 'https://cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas'
$nome = if ($Tipo -eq 'candidatos') { "prestacao_de_contas_eleitorais_candidatos_$Ano.zip" } else { "prestacao_de_contas_eleitorais_orgaos_partidarios_$Ano.zip" }
$url = "$base/$nome"
$ua = 'analises-imparciais/1.0 (projeto educacional; dados abertos)'
$pausaS = 3

try {
    $head = Invoke-WebRequest -Uri $url -Method Head -UserAgent $ua -UseBasicParsing
    $tam = [int64]($head.Headers['Content-Length'] | Select-Object -First 1)
}
catch {
    Write-Host "Erro em $url : $($_.Exception.Message). Parando (sem nova tentativa)."; exit 1
}
Write-Host ("{0}: {1:N1} MB`n  fonte: {2}" -f $nome, ($tam / 1MB), $url)
if (-not $Confirmar) { Write-Host 'Nada baixado (use -Confirmar depois de o usuário aprovar).'; exit 0 }

$destino = Join-Path (Split-Path $PSScriptRoot -Parent) 'dados-brutos'
New-Item -ItemType Directory -Force -Path $destino | Out-Null
$alvo = Join-Path $destino $nome
$ja = if (Test-Path $alvo) { (Get-Item $alvo).Length } else { 0 }
if ($tam -gt 0 -and $ja -ge $tam) { Write-Host 'Já baixado.'; exit 0 }

Start-Sleep -Seconds $pausaS
$req = [Net.HttpWebRequest]::Create($url)
$req.UserAgent = $ua
if ($ja -gt 0) { $req.AddRange([int64]$ja) }
try { $resp = $req.GetResponse() }
catch { Write-Host "Erro ao baixar: $($_.Exception.Message). Parando; arquivo parcial mantido."; exit 1 }
$modo = if ($ja -gt 0 -and [int]$resp.StatusCode -eq 206) { [IO.FileMode]::Append } else { [IO.FileMode]::Create }
$fs = [IO.File]::Open($alvo, $modo, [IO.FileAccess]::Write)
try { $resp.GetResponseStream().CopyTo($fs) } finally { $fs.Close(); $resp.Close() }
Write-Host "Salvo em $alvo"
