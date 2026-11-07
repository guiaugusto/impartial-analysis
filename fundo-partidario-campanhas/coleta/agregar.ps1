<#
.SYNOPSIS
  Agrega os CSVs brutos do TSE (em dados-brutos/) em JSONs pequenos em data/.
.DESCRIPTION
  LISTA PERMITIDA (whitelist): só estas colunas são lidas para a saída.
    Candidatos, receitas: SQ_PRESTADOR_CONTAS, SG_PARTIDO, DS_CARGO, SG_UF, NM_CANDIDATO, NR_CANDIDATO,
                          ST_TURNO, DS_FONTE_RECEITA, VR_RECEITA
    Candidatos, despesas pagas: SQ_PRESTADOR_CONTAS, ST_TURNO, DS_FONTE_DESPESA, DS_ORIGEM_DESPESA (só para separar repasse de gasto próprio), VR_PAGTO_DESPESA
    Órgãos, receitas: SQ_PRESTADOR_CONTAS, SG_PARTIDO, DS_ESFERA_PARTIDARIA, DS_FONTE_RECEITA, DS_ORIGEM_RECEITA, VR_RECEITA
    Órgãos, despesas pagas: SQ_PRESTADOR_CONTAS, DS_FONTE_DESPESA, DS_ORIGEM_DESPESA (só para separar repasse de gasto próprio), VR_PAGTO_DESPESA
  Nunca são lidas nem gravadas: CPF/CNPJ de candidato, vice, doador ou fornecedor, nomes de doador/fornecedor,
  documentos, recibos, gênero e cor/raça.
  Os brutos ficam em dados-brutos/ (ignorado pelo Git). Só data/*.json vai para o repositório.
.EXAMPLE
  powershell -File coleta/agregar.ps1 -Anos 2018,2022
#>
param([string]$Anos = '2018,2022')
$ErrorActionPreference = 'Stop'
$listaAnos = $Anos -split '[,; ]+' | Where-Object { $_ } | ForEach-Object { [int]$_ }

$codigo = @'
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;

public static class Agregador
{
    static readonly Encoding Latin1 = Encoding.GetEncoding("iso-8859-1");
    static readonly CultureInfo Inv = CultureInfo.InvariantCulture;
    const string SemId = "(não identificado)";
    public static long FalhasValor = 0;

    class Csv
    {
        TextReader r; char[] buf = new char[1 << 16]; int pos, len;
        StringBuilder sb = new StringBuilder();
        public Csv(TextReader reader) { r = reader; }
        int Fill() { len = r.Read(buf, 0, buf.Length); pos = 0; return len; }
        int Next() { if (pos >= len && Fill() <= 0) return -1; return buf[pos++]; }
        int Peek() { if (pos >= len && Fill() <= 0) return -1; return buf[pos]; }
        public bool Row(List<string> f)
        {
            f.Clear(); sb.Length = 0;
            int c = Next(); if (c < 0) return false;
            bool q = false;
            while (true)
            {
                if (c < 0) { f.Add(sb.ToString()); return true; }
                if (q) { if (c == '"') { if (Peek() == '"') { Next(); sb.Append('"'); } else q = false; } else sb.Append((char)c); }
                else if (c == '"') q = true;
                else if (c == ';') { f.Add(sb.ToString()); sb.Length = 0; }
                else if (c == '\n') { f.Add(sb.ToString()); return true; }
                else if (c != '\r') sb.Append((char)c);
                c = Next();
            }
        }
    }

    class Acc { public decimal V; public HashSet<string> P = new HashSet<string>(); }
    class Cand { public string Partido, Cargo, Uf, Nome, Numero; }
    class Org { public string Partido, Esfera; }

    static decimal Dec(string s)
    {
        decimal d; if (string.IsNullOrEmpty(s)) return 0;
        if (decimal.TryParse(s.Replace(',', '.'), NumberStyles.Number | NumberStyles.AllowLeadingSign, Inv, out d)) return d;
        FalhasValor++; return 0;
    }
    static string Fonte(string s)
    {
        if (s == null) return "sem";
        if (s.IndexOf("Especial", StringComparison.OrdinalIgnoreCase) >= 0) return "fefc";
        if (s.IndexOf("Partid", StringComparison.OrdinalIgnoreCase) >= 0) return "fp";
        if (s.IndexOf("Outros", StringComparison.OrdinalIgnoreCase) >= 0) return "outros";
        return "sem";
    }
    static string Q(string s)
    {
        var sb = new StringBuilder("\"");
        foreach (char c in s ?? "")
        {
            if (c == '"' || c == '\\') sb.Append('\\').Append(c);
            else if (c < 32) sb.Append(' ');
            else sb.Append(c);
        }
        return sb.Append('"').ToString();
    }
    // Alguns candidatos digitam e-mail ou telefone no campo de nome: nesses casos o nome é omitido.
    static string NomeSeguro(string s)
    {
        if (string.IsNullOrEmpty(s)) return "(nome omitido)";
        if (s.IndexOf('@') >= 0 || s.IndexOf("HTTP", StringComparison.OrdinalIgnoreCase) >= 0 || s.IndexOf("WWW", StringComparison.OrdinalIgnoreCase) >= 0) return "(nome omitido)";
        int seq = 0;
        foreach (char ch in s) { seq = char.IsDigit(ch) ? seq + 1 : 0; if (seq >= 6) return "(nome omitido)"; }
        return s;
    }
    static string N(decimal v) { return Math.Round(v, 2).ToString("0.00", Inv); }
    static string Slug(string s)
    {
        string d = s.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (char c in d) { if (CharUnicodeInfo.GetUnicodeCategory(c) == UnicodeCategory.NonSpacingMark) continue; if (char.IsLetterOrDigit(c)) sb.Append(char.ToUpperInvariant(c)); }
        return sb.ToString();
    }

    static void Linhas(ZipArchive za, string nome, string[] cols, Action<string[]> fn)
    {
        var e = za.GetEntry(nome); if (e == null) throw new Exception("Entrada não encontrada no zip: " + nome);
        using (var sr = new StreamReader(e.Open(), Latin1, false, 1 << 16))
        {
            var csv = new Csv(sr); var f = new List<string>();
            if (!csv.Row(f)) return;
            var idx = new int[cols.Length];
            for (int i = 0; i < cols.Length; i++) { idx[i] = f.IndexOf(cols[i]); if (idx[i] < 0) throw new Exception("Coluna ausente em " + nome + ": " + cols[i]); }
            int max = idx.Max(); var v = new string[cols.Length];
            while (csv.Row(f)) { if (f.Count <= max) continue; for (int i = 0; i < idx.Length; i++) v[i] = f[idx[i]]; fn(v); }
        }
    }
    static void Soma(Dictionary<string, Acc> d, string k, decimal v, string prest)
    {
        Acc a; if (!d.TryGetValue(k, out a)) { a = new Acc(); d[k] = a; }
        a.V += v; if (prest != null) a.P.Add(prest);
    }

    public static string Candidatos(string zip, int ano, string saida)
    {
        FalhasValor = 0;
        var mapa = new Dictionary<string, Cand>();
        var rec = new Dictionary<string, Acc>();
        var desp = new Dictionary<string, Acc>();
        var porCand = new Dictionary<string, decimal[]>();
        var candDe = new Dictionary<string, Cand>();
        long nDesp = 0; decimal totalPago = 0, semId = 0;
        using (var za = ZipFile.OpenRead(zip))
        {
            Linhas(za, "receitas_candidatos_" + ano + "_BRASIL.csv",
                new[] { "SQ_PRESTADOR_CONTAS", "SG_PARTIDO", "DS_CARGO", "SG_UF", "NM_CANDIDATO", "NR_CANDIDATO", "ST_TURNO", "DS_FONTE_RECEITA", "VR_RECEITA" },
                v =>
                {
                    if (!mapa.ContainsKey(v[0])) mapa[v[0]] = new Cand { Partido = v[1], Cargo = v[2], Uf = v[3], Nome = v[4], Numero = v[5] };
                    Soma(rec, v[1] + "\t" + v[6] + "\t" + Fonte(v[7]), Dec(v[8]), v[0]);
                });
            Linhas(za, "despesas_pagas_candidatos_" + ano + "_BRASIL.csv",
                new[] { "SQ_PRESTADOR_CONTAS", "ST_TURNO", "DS_FONTE_DESPESA", "VR_PAGTO_DESPESA", "DS_ORIGEM_DESPESA" },
                v =>
                {
                    nDesp++; decimal val = Dec(v[3]); string fo = Fonte(v[2]); totalPago += val;
                    string tipo = v[4].StartsWith("Doações financeiras", StringComparison.OrdinalIgnoreCase) ? "repasse" : "proprio";
                    Cand c; string partido = SemId, cargo = SemId;
                    if (mapa.TryGetValue(v[0], out c)) { partido = c.Partido; cargo = c.Cargo; } else semId += val;
                    Soma(desp, partido + "\t" + cargo + "\t" + v[1] + "\t" + fo + "\t" + tipo, val, v[0]);
                    if (c != null)
                    {
                        string k = v[0] + "\t" + v[1]; decimal[] arr;
                        if (!porCand.TryGetValue(k, out arr)) { arr = new decimal[5]; porCand[k] = arr; candDe[k] = c; }
                        if (tipo == "repasse") arr[4] += val;
                        else arr[fo == "fefc" ? 0 : fo == "fp" ? 1 : fo == "outros" ? 2 : 3] += val;
                    }
                });
        }
        Directory.CreateDirectory(saida);
        var u8 = new UTF8Encoding(false);
        var sbj = new StringBuilder();
        sbj.Append("{\"ano\":" + ano + ",\"meta\":{\"linhas_despesas_pagas\":" + nDesp + ",\"valor_pago_total\":" + N(totalPago) +
                   ",\"valor_pago_sem_partido\":" + N(semId) + ",\"candidaturas_com_receita\":" + mapa.Count + ",\"falhas_leitura_valor\":" + FalhasValor + "},");
        sbj.Append("\"despesas\":[");
        sbj.Append(string.Join(",", desp.OrderBy(x => x.Key, StringComparer.Ordinal).Select(x => { var p = x.Key.Split('\t'); return "{\"partido\":" + Q(p[0]) + ",\"cargo\":" + Q(p[1]) + ",\"turno\":" + Q(p[2]) + ",\"fonte\":" + Q(p[3]) + ",\"tipo\":" + Q(p[4]) + ",\"pago\":" + N(x.Value.V) + ",\"candidaturas\":" + x.Value.P.Count + "}"; })));
        sbj.Append("],\"receitas\":[");
        sbj.Append(string.Join(",", rec.OrderBy(x => x.Key, StringComparer.Ordinal).Select(x => { var p = x.Key.Split('\t'); return "{\"partido\":" + Q(p[0]) + ",\"turno\":" + Q(p[1]) + ",\"fonte\":" + Q(p[2]) + ",\"recebido\":" + N(x.Value.V) + ",\"candidaturas\":" + x.Value.P.Count + "}"; })));
        sbj.Append("]}");
        File.WriteAllText(Path.Combine(saida, "candidatos-" + ano + ".json"), sbj.ToString(), u8);

        var dirC = Path.Combine(saida, "candidatos", ano.ToString()); Directory.CreateDirectory(dirC);
        foreach (var f in Directory.GetFiles(dirC, "*.json")) File.Delete(f);
        int arquivos = 0;
        foreach (var g in porCand.GroupBy(x => candDe[x.Key].Partido))
        {
            string slug = Slug(g.Key); if (slug.Length == 0) continue;
            var itens = g.Where(x => x.Value.Sum() > 0).OrderByDescending(x => x.Value[0] + x.Value[1]).Select(x =>
            {
                var c = candDe[x.Key]; string turno = x.Key.Split('\t')[1];
                return "{\"nome\":" + Q(NomeSeguro(c.Nome)) + ",\"numero\":" + Q(c.Numero) + ",\"cargo\":" + Q(c.Cargo) + ",\"uf\":" + Q(c.Uf) + ",\"turno\":" + Q(turno) +
                       ",\"fefc\":" + N(x.Value[0]) + ",\"fp\":" + N(x.Value[1]) + ",\"outros\":" + N(x.Value[2]) + ",\"sem\":" + N(x.Value[3]) + ",\"repasses\":" + N(x.Value[4]) + "}";
            });
            File.WriteAllText(Path.Combine(dirC, slug + ".json"), "[" + string.Join(",", itens) + "]", u8); arquivos++;
        }
        return "candidatos " + ano + ": " + nDesp + " despesas, " + mapa.Count + " candidaturas, " + arquivos + " arquivos de partido, sem partido=" + N(semId) + ", falhas=" + FalhasValor;
    }

    public static string Orgaos(string zip, int ano, string saida)
    {
        FalhasValor = 0;
        var mapa = new Dictionary<string, Org>();
        var rec = new Dictionary<string, Acc>();
        var desp = new Dictionary<string, Acc>();
        long nDesp = 0; decimal totalPago = 0, semId = 0;
        using (var za = ZipFile.OpenRead(zip))
        {
            Linhas(za, "receitas_orgaos_partidarios_" + ano + "_BRASIL.csv",
                new[] { "SQ_PRESTADOR_CONTAS", "SG_PARTIDO", "DS_ESFERA_PARTIDARIA", "DS_FONTE_RECEITA", "DS_ORIGEM_RECEITA", "VR_RECEITA" },
                v =>
                {
                    if (!mapa.ContainsKey(v[0])) mapa[v[0]] = new Org { Partido = v[1], Esfera = v[2] };
                    string origem = (v[4] == "#NULO" || v[4] == "") ? "Sem origem informada" : v[4];
                    Soma(rec, v[1] + "\t" + v[2] + "\t" + Fonte(v[3]) + "\t" + origem, Dec(v[5]), null);
                });
            Linhas(za, "despesas_pagas_orgaos_partidarios_" + ano + "_BRASIL.csv",
                new[] { "SQ_PRESTADOR_CONTAS", "DS_FONTE_DESPESA", "VR_PAGTO_DESPESA", "DS_ORIGEM_DESPESA" },
                v =>
                {
                    nDesp++; decimal val = Dec(v[2]); totalPago += val;
                    Org o; string partido = SemId, esfera = SemId;
                    if (mapa.TryGetValue(v[0], out o)) { partido = o.Partido; esfera = o.Esfera; } else semId += val;
                    string tipo = v[3].StartsWith("Doações financeiras", StringComparison.OrdinalIgnoreCase) ? "repasse" : "proprio";
                    Soma(desp, partido + "\t" + esfera + "\t" + Fonte(v[1]) + "\t" + tipo, val, null);
                });
        }
        Directory.CreateDirectory(saida);
        var sb = new StringBuilder();
        sb.Append("{\"ano\":" + ano + ",\"meta\":{\"linhas_despesas_pagas\":" + nDesp + ",\"valor_pago_total\":" + N(totalPago) +
                  ",\"valor_pago_sem_partido\":" + N(semId) + ",\"orgaos_com_receita\":" + mapa.Count + ",\"falhas_leitura_valor\":" + FalhasValor + "},");
        sb.Append("\"receitas\":[");
        sb.Append(string.Join(",", rec.OrderBy(x => x.Key, StringComparer.Ordinal).Select(x => { var p = x.Key.Split('\t'); return "{\"partido\":" + Q(p[0]) + ",\"esfera\":" + Q(p[1]) + ",\"fonte\":" + Q(p[2]) + ",\"origem\":" + Q(p[3]) + ",\"recebido\":" + N(x.Value.V) + "}"; })));
        sb.Append("],\"despesas\":[");
        sb.Append(string.Join(",", desp.OrderBy(x => x.Key, StringComparer.Ordinal).Select(x => { var p = x.Key.Split('\t'); return "{\"partido\":" + Q(p[0]) + ",\"esfera\":" + Q(p[1]) + ",\"fonte\":" + Q(p[2]) + ",\"tipo\":" + Q(p[3]) + ",\"pago\":" + N(x.Value.V) + "}"; })));
        sb.Append("]}");
        File.WriteAllText(Path.Combine(saida, "orgaos-" + ano + ".json"), sb.ToString(), new UTF8Encoding(false));
        return "orgaos " + ano + ": " + nDesp + " despesas, " + mapa.Count + " órgãos, sem partido=" + N(semId) + ", falhas=" + FalhasValor;
    }
}
'@

Add-Type -TypeDefinition $codigo -Language CSharp -ReferencedAssemblies 'System.IO.Compression', 'System.IO.Compression.FileSystem', 'System.Core'

$raizProjeto = Split-Path $PSScriptRoot -Parent
$brutos = Join-Path $raizProjeto 'dados-brutos'
$saida = Join-Path $raizProjeto 'data'
foreach ($ano in $listaAnos) {
    foreach ($tipo in 'orgaos_partidarios', 'candidatos') {
        $zip = Join-Path $brutos "prestacao_de_contas_eleitorais_${tipo}_$ano.zip"
        if (-not (Test-Path $zip)) { throw "Faltando $zip. Rode coleta/baixar.ps1 (com aprovação) antes." }
    }
    $t = Get-Date
    [Agregador]::Orgaos((Join-Path $brutos "prestacao_de_contas_eleitorais_orgaos_partidarios_$ano.zip"), $ano, $saida)
    [Agregador]::Candidatos((Join-Path $brutos "prestacao_de_contas_eleitorais_candidatos_$ano.zip"), $ano, $saida)
    "{0} concluído em {1:N0} s" -f $ano, ((Get-Date) - $t).TotalSeconds
}
