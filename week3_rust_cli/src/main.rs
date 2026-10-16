#[derive(Debug)]
struct VaultAccount {
    owner: String,
    balance: u64,
}

impl VaultAccount {
    fn new(owner: String, initial_balance: u64) -> Self {
        Self { owner, balance: initial_balance }
    }

    fn deposit(&mut self, amount: u64) -> Result<u64, &'static str> {
        self.balance = self.balance.checked_add(amount).ok_or("Ошибка: Переполнение!")?;
        Ok(self.balance)
    }

    fn withdraw(&mut self, amount: u64) -> Result<u64, &'static str> {
        if amount > self.balance {
            return Err("Ошибка: Недостаточно средств на балансе!");
        }
        self.balance = self.balance.checked_sub(amount).ok_or("Ошибка вычисления!")?;
        Ok(self.balance)
    }
}

fn main() {
    println!("=== CLI Программа: Имитация Solana Vault (Неделя 3) ===");
    let mut my_vault = VaultAccount::new(String::from("Kamilla"), 1000);
    println!("Создан аккаунт: {:?}", my_vault);

    match my_vault.deposit(500) {
        Ok(new_balance) => println!("Успешный депозит! Новый баланс: {}", new_balance),
        Err(err) => println!("{}", err),
    }

    match my_vault.withdraw(3000) {
        Ok(new_balance) => println!("Успешно снято! Баланс: {}", new_balance),
        Err(err) => println!("Перехвачена ошибка: {}", err),
    }
}