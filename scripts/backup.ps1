# Backup script for Resolver.tech (Windows PowerShell)
# Usage: .\scripts\backup.ps1

$ErrorActionPreference = "Stop"

$BackupDir = ".\backups"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

Write-Host "💾 Creating backup..." -ForegroundColor Cyan

# Create backup directory if it doesn't exist
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# Database backup
Write-Host "📦 Backing up database..." -ForegroundColor Yellow
docker-compose exec -T postgres pg_dump -U resolver_user resolver_db | Out-File -FilePath "$BackupDir\db_$Timestamp.sql" -Encoding utf8

# Compress backup
Compress-Archive -Path "$BackupDir\db_$Timestamp.sql" -DestinationPath "$BackupDir\db_$Timestamp.zip" -Force
Remove-Item "$BackupDir\db_$Timestamp.sql"

Write-Host "✅ Backup created: $BackupDir\db_$Timestamp.zip" -ForegroundColor Green

# Keep only last 7 backups
Get-ChildItem -Path $BackupDir -Filter "*.zip" | 
    Sort-Object CreationTime -Descending | 
    Select-Object -Skip 7 | 
    Remove-Item -Force

Write-Host "🧹 Old backups cleaned up (keeping last 7)" -ForegroundColor Yellow
