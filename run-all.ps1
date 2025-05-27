Write-Host "🔐 Walletlar olusturuluyor..." -ForegroundColor Cyan
node scripts/generate-wallets.js

Write-Host "🛡️ Relayer minter olarak ekleniyor..." -ForegroundColor Yellow
node scripts/set-minter.js

Write-Host "🪙 Token dagitimi yapiliyor..." -ForegroundColor Green
node scripts/mint-token-bulk.js

Write-Host "✅ Approve islemleri yapiliyor..." -ForegroundColor Magenta
node scripts/bulk-approve.js

Write-Host "🚀 Meta islemler baslatiliyor..." -ForegroundColor Blue
node scripts/meta-tx-bulk-multisig.js

Write-Host "🎉 Tum adimlar basariyla tamamlandi!" -ForegroundColor White -BackgroundColor DarkGreen
