
$map = @{
    'Ã§' = 'ç'; 'Ã£' = 'ã'; 'Ã©' = 'é'; 'Ã³' = 'ó'; 'Ã­' = 'í'; 'Ãª' = 'ê'; 'Ã¡' = 'á'; 'Ã´' = 'ô'; 'Ã ' = 'à'; 'Ãº' = 'ú'; 'Ãš' = 'Ú'; 'Ã€' = 'À'; 'Ã¢' = 'â';
    'â€”' = '—'; 'â†’' = '→'; 'â€œ' = '“'; 'â€' = '”'; 'â€˜' = '‘'; 'â€™' = '’'; 'â€¢' = '•'; 'â€¦' = '…'
}

$files = Get-ChildItem -Path "c:\Users\acer\Desktop\The Store Lab" -Filter "*.html" -Recurse | Where-Object { $_.FullName -notmatch "(\.gemini|node_modules)" }

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $changed = $false
    foreach ($key in $map.Keys) {
        if ($content.Contains($key)) {
            $content = $content.Replace($key, $map[$key])
            $changed = $true
        }
    }
    
    # Extra cleanup
    $oldMenu = "  <!-- Mobile Menu -->`n    <!-- Mobile Menu -->"
    if ($content.Contains($oldMenu)) {
        $content = $content.Replace($oldMenu, "  <!-- Mobile Menu -->")
        $changed = $true
    }
    
    if ($changed) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Output "Fixed: $($file.FullName)"
    }
}
