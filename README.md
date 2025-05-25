# ⚡ Meta-Transaction Sistemi

Bu proje, Ethereum blockchain üzerinde gas ücretini kullanıcı yerine üçüncü bir tarafın (relayer) ödediği **Meta-Transaction** sistemini temel almaktadır. Kullanıcılar ETH sahibi olmadan ERC-20 token transferi veya `approve` işlemlerini gerçekleştirebilir.

## 🎯 Projenin Amacı

- Kullanıcıların cüzdanlarında ETH bulundurmadan işlem yapabilmesi
- Gas ücretlerinin bir başka taraf (relayer) tarafından ödenebilmesi
- Kullanıcı deneyimini iyileştirmek ve dApp onboarding süreçlerini kolaylaştırmak
- Toplu (bulk) işlemlerin tek bir işlemle ve tek bir gas maliyetiyle gerçekleştirilmesi

## 🛠️ Kullanılan Teknolojiler

- Solidity (0.8.x)
- Hardhat
- Ethers.js
- Sepolia Testnet
- MetaMask / Alchemy / GitHub

## ⚙️ Kontratlar

### 🔹 `MetaTx.sol`

`MetaTx` kontratı, kullanıcıların ERC-20 token işlemlerini imzalamalarını ve bu işlemlerin bir relayer tarafından zincire gönderilmesini sağlar.

Desteklenen işlemler:
- `executeMetaTransaction`: Kullanıcı adına token transferi
- `executeApproval`: Kullanıcı adına token onayı (`approve`)
- `getDigest`, `getMessageHash`: İmza doğrulama hash hesaplamaları

## 🔄 Meta-Transaction Akışı

1. Kullanıcı, transfer veya approve işlemini **off-chain** olarak imzalar.
2. Relayer, bu imzayı alarak işlemi blockchain'e gönderir ve **gas ücretini öder**.
3. Akıllı kontrat, imzanın doğruluğunu kontrol eder ve işlemi zincire yazar.
4. İşlem başarılı şekilde gerçekleştirilir ve ilgili event emit edilir.

## 📦 Özellikler

- ✔️ Gasless transfer ve approve desteği
- ✔️ EIP-2771 mantığında imzalı işlem modeli
- ✔️ Relayer yapısı
- ✔️ Toplu işlem (bulk transfer) desteği
- ✔️ Sepolia üzerinde test edildi

## 📁 Dosya Yapısı

```bash
├── contracts/
│   ├── MetaTx.sol           # Meta-transaction kontratı
│   └── TestUSDC.sol         # ERC20 test tokenı
├── scripts/
│   ├── meta-tx-single.js    # Tekli işlem örneği
│   ├── meta-tx-bulk.js      # Toplu işlem örneği
│   ├── approve.js           # Meta-approve işlemi
│   └── deploy.js            # Kontrat deploy scripti
├── test/
│   └── Lock.js              # Test dosyası
├── hardhat.config.js        # Hardhat yapılandırması
└── README.md
