use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod week6_pda_profile {
    use super::*;

    // Инструкция создания децентрализованного On-Chain профиля
    pub fn create_profile(ctx: Context<CreateProfile>, name: String, bio: String) -> Result<()> {
        require!(name.len() <= 32, ProfileError::NameTooLong);
        require!(bio.len() <= 200, ProfileError::BioTooLong);

        let profile = &mut ctx.accounts.profile;
        profile.authority = ctx.accounts.user.key();
        profile.name = name;
        profile.bio = bio;

        msg!("Профиль для {} успешно создан!", profile.name);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    // PDA рассчитывается от зерна "user_profile" и ключа юзера
    #[account(
        init,
        payer = user,
        space = 8 + 32 + (4 + 32) + (4 + 200),
        seeds = [b"user_profile", user.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct UserProfile {
    pub authority: Pubkey, // Владелец профиля
    pub name: String,      // Имя (до 32 символов)
    pub bio: String,       // О себе (до 200 символов)
}

#[error_code]
pub enum ProfileError {
    #[msg("Имя слишком длинное! Максимум 32 символа.")]
    NameTooLong,
    #[msg("Описание слишком длинное! Максимум 200 символов.")]
    BioTooLong,
}