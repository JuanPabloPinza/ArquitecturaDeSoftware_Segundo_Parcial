using API_DOTNET_BANK.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API_DOTNET_BANK.Infraestructure.Config
{
    public class AccountConfig : IEntityTypeConfiguration<Account>
    {
        public void Configure(EntityTypeBuilder<Account> builder)
        {
            builder.ToTable("accounts");
            
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();
            
            builder.Property(a => a.AccountNumber)
                .HasColumnName("account_number")
                .IsRequired()
                .HasMaxLength(20);
            
            builder.HasIndex(a => a.AccountNumber)
                .IsUnique();
            
            builder.Property(a => a.AccountType)
                .HasColumnName("account_type")
                .IsRequired();
            
            builder.Property(a => a.Balance)
                .HasColumnName("balance")
                .HasColumnType("decimal(18,2)")
                .IsRequired();
            
            builder.Property(a => a.IsActive)
                .HasColumnName("is_active")
                .IsRequired();
            
            builder.Property(a => a.UserId)
                .HasColumnName("user_id")
                .IsRequired();
            
            builder.Property(a => a.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();
            
            builder.Property(a => a.UpdatedAt)
                .HasColumnName("updated_at");
            
            builder.HasOne(a => a.User)
                .WithMany(u => u.Accounts)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
