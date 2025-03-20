$totalLines = 0
$totalWords = 0
$totalChars = 0
$fileCount = 0

$results = @()

Get-ChildItem -Path "dist" -Filter "*.html" -Recurse | ForEach-Object {
    $fileContent = Get-Content -Path $_.FullName -Raw
    
    # Extract text content by removing HTML tags
    $textContent = $fileContent -replace "<[^>]*>", " " -replace "\s+", " "
    
    # Calculate metrics
    $lines = ($fileContent | Measure-Object -Line).Lines
    $htmlChars = ($fileContent | Measure-Object -Character).Characters
    $textChars = ($textContent | Measure-Object -Character).Characters
    $words = ($textContent | Measure-Object -Word).Words
    
    # Calculate ratio (text characters / total characters)
    $ratio = [math]::Round(($textChars / $htmlChars) * 100, 2)
    
    # Add to totals
    $totalLines += $lines
    $totalWords += $words
    $totalChars += $htmlChars
    $fileCount++
    
    # Create result object
    $result = [PSCustomObject]@{
        Page = $_.FullName.Replace((Get-Location).Path + "\dist\", "")
        Lines = $lines
        Words = $words
        Characters = $htmlChars
        TextChars = $textChars
        TextToHTMLRatio = "$ratio%"
    }
    
    $results += $result
}

# Calculate overall ratio
$overallRatio = [math]::Round(($results | Measure-Object -Property TextChars -Sum).Sum / ($results | Measure-Object -Property Characters -Sum).Sum * 100, 2)

# Output results
Write-Host "`nIndividual Page Analysis:" -ForegroundColor Cyan
$results | Format-Table -AutoSize

Write-Host "`nOverall Project Analysis:" -ForegroundColor Cyan
Write-Host "Total Pages: $fileCount"
Write-Host "Total Lines: $totalLines"
Write-Host "Total Words: $totalWords"
Write-Host "Total Characters: $totalChars"
Write-Host "Overall Text-to-HTML Ratio: $overallRatio%"
