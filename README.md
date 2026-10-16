# Отчет по заданиям курса Solana Web3 Development

**Студент:**  Шайкенова Камилла (Информационные системы)

---

## 📁 Структура репозитория
- `week3_rust_cli/` — CLI-программа на Rust (структуры, безопасная арифметика, обработка ошибок).
- `week4_hello_solana/` — Первая Solana Program, скомпилированная и развернутая в Devnet.
- `week5_counter/` — Counter Program на Anchor Framework (инструкции initialize, increment и клиентский скрипт).
- `week6_pda_profile/` — Создание децентрализованного On-Chain профиля пользователя с использованием PDA (Program Derived Address).
---

## 📅 Неделя 3: Rust для Solana-разработчика
Реализована CLI-программа `VaultAccount` с защитой от переполнения (`checked_add`, `checked_sub`) и обработкой ошибок через `Result`.

## 📅 Неделя 4: Первая Solana Program
Смарт-контракт на нативном Rust скомпилирован через `cargo build-sbf` и развернут в сеть Devnet.

## 📅 Неделя 5: Anchor Framework
Разработана программа `week5_counter` на Anchor с функционалом инициализации и увеличения счетчика.

## 📅 Неделя 6: Accounts, PDAs и архитектура программ
Реализована программа `week6_pda_profile` для создания On-Chain профилей, где адрес аккаунта генерируется детерминированно через PDA (`seeds = [b"user_profile", user_pubkey]`).