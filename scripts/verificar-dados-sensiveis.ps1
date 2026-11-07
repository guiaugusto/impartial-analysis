<#
.SYNOPSIS
  Verifica se pastas de projeto contêm dados que não deveriam ser publicados.
.DESCRIPTION
  Procura arquivos brutos, arquivos grandes, CPF/CNPJ/e-mail/telefone no conteúdo
  e chaves JSON com nomes de dado pessoal. Não altera nenhum arquivo.
  Sai com código 1 se achar qualquer problema, 2 em erro de uso.
.EXAMPLE
  powershell -File scripts/verificar-dados-sensiveis.ps1 fundo-partidario-campanhas
#>
param([Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)][string[]]$Pastas)

$ErrorActionPreference = 'Stop'
$limiteBytes = 5MB
$extProibidas = '.zip', '.csv', '.parquet', '.xlsx', '.xls', '.sqlite', '.db', '.7z', '.rar', '.gz'
$extTexto = '.json', '.js', '.html', '.css', '.md', '.txt', '.yml', '.yaml', '.svg'
$ignorarDirs = '.git', 'node_modules', '__pycache__', '.venv', 'dados-brutos'
$chavesProibidas = @(
    'cpf', 'cnpj', 'nr_cpf', 'nr_cnpj', 'cpf_cnpj', 'titulo_eleitor', 'nr_titulo_eleitor',
    'email', 'ds_email', 'telefone', 'nr_telefone', 'endereco', 'ds_endereco', 'data_nascimento',
    'dt_nascimento', 'nm_doador', 'nm_fornecedor', 'doador', 'fornecedor', 'nr_conta', 'agencia',
    'nr_agencia', 'pix', 'chave_pix', 'nr_documento', 'cpf_cnpj_fornecedor', 'cpf_cnpj_doador')
$emailsOk = 'noreply@anthropic.com', 'noreply@github.com'

$reCpf = '(?<!\d)\d{3}\.\d{3}\.\d{3}-\d{2}(?!\d)'
$reCnpj = '(?<!\d)\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}(?!\d)'
$reEmail = '[\w.+-]+@[\w-]+\.[\w.-]+'
$reTel = '(?<!\d)\(?\d{2}\)?\s?9?\d{4}-\d{4}(?!\d)'
$reDoc = '(?i)"[^"]{0,40}(cpf|cnpj|titulo)[^"]{0,20}"\s*:\s*"?\d{11,14}"?'

$problemas = New-Object System.Collections.Generic.List[string]

$cacheAcento = @{}
function Remove-Acento([string]$s) {
    if ($cacheAcento.ContainsKey($s)) { return $cacheAcento[$s] }
    $n = $s.Normalize([Text.NormalizationForm]::FormD)
    $sb = New-Object Text.StringBuilder
    foreach ($c in $n.ToCharArray()) { if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($c) -ne 'NonSpacingMark') { [void]$sb.Append($c) } }
    $r = $sb.ToString().ToLower()
    $cacheAcento[$s] = $r
    return $r
}

function Test-Chaves($obj, [string]$caminho, [string]$rel) {
    if ($null -eq $obj) { return }
    if ($obj -is [System.Management.Automation.PSCustomObject]) {
        foreach ($p in $obj.PSObject.Properties) {
            if ($chavesProibidas -contains (Remove-Acento $p.Name)) {
                $problemas.Add("${rel}: chave proibida '$($p.Name)' em $caminho/")
            }
            Test-Chaves $p.Value "$caminho/$($p.Name)" $rel
        }
    }
    elseif ($obj -is [System.Array]) {
        $i = 0
        foreach ($v in $obj) { if ($i -ge 2000) { break }; Test-Chaves $v "$caminho[$i]" $rel; $i++ }
    }
}

foreach ($pasta in $Pastas) {
    if (-not (Test-Path -LiteralPath $pasta -PathType Container)) { Write-Host "pasta não encontrada: $pasta"; exit 2 }
    $raiz = (Resolve-Path -LiteralPath $pasta).Path
    Get-ChildItem -LiteralPath $raiz -Recurse -File -Force | ForEach-Object {
        $arq = $_
        $partes = $arq.FullName.Substring($raiz.Length).Split([char[]]'\/', [StringSplitOptions]::RemoveEmptyEntries)
        if ($partes | Where-Object { $ignorarDirs -contains $_ }) { return }
        $rel = "$pasta/" + ($partes -join '/')
        $ext = $arq.Extension.ToLower()
        if ($extProibidas -contains $ext) { $problemas.Add("${rel}: tipo de arquivo bruto/proibido ($ext)"); return }
        if ($arq.Length -gt $limiteBytes) { $problemas.Add(("{0}: arquivo grande ({1:N1} MB)" -f $rel, ($arq.Length / 1MB))) }
        if (($extTexto -notcontains $ext) -or $arq.Length -gt 50MB) { return }
        $texto = [IO.File]::ReadAllText($arq.FullName, [Text.Encoding]::UTF8)
        if ($texto -match $reCpf) { $problemas.Add("${rel}: padrão de CPF encontrado") }
        if ($texto -match $reCnpj) { $problemas.Add("${rel}: padrão de CNPJ encontrado") }
        if ($ext -ne '.md' -and $texto -match $reTel) { $problemas.Add("${rel}: padrão de telefone encontrado") }
        foreach ($m in [regex]::Matches($texto, $reEmail)) {
            if ($emailsOk -notcontains $m.Value.ToLower()) { $problemas.Add("${rel}: e-mail encontrado ($($m.Value.Substring(0,3))***)"); break }
        }
        if ($texto -match $reDoc) { $problemas.Add("${rel}: número de 11-14 dígitos em campo de documento") }
        if ($ext -eq '.json') {
            try { Test-Chaves ($texto | ConvertFrom-Json) '' $rel } catch { $problemas.Add("${rel}: JSON inválido") }
        }
    }
}

if ($problemas.Count -gt 0) {
    Write-Host 'PROBLEMAS ENCONTRADOS (nada deve ser commitado até corrigir):'
    $problemas | Select-Object -Unique | ForEach-Object { Write-Host " - $_" }
    exit 1
}
Write-Host 'OK: nenhum dado sensível ou arquivo bruto encontrado.'
exit 0
