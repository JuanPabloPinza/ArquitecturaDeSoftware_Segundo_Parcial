using API_DOTNET_BANK.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API_DOTNET_BANK.Infraestructure.Config
{
    public class TransactionConfig : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.ToTable("transactions");
            
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();
            
            builder.Property(t => t.TransactionType)
                .HasColumnName("transaction_type")
                .IsRequired();
            
            builder.Property(t => t.Amount)
                .HasColumnName("amount")
                .HasColumnType("decimal(18,2)")
                .IsRequired();
            
            builder.Property(t => t.Description)
                .HasColumnName("description")
                .HasMaxLength(255);
            
            builder.Property(t => t.AccountId)
                .HasColumnName("account_id")
                .IsRequired();
            
            builder.Property(t => t.DestinationAccountId)
                .HasColumnName("destination_account_id");
            
            builder.Property(t => t.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();
            
            builder.HasOne(t => t.Account)
                .WithMany(a => a.Transactions)
                .HasForeignKey(t => t.AccountId)
                .OnDelete(DeleteBehavior.Cascade);
            
            builder.HasOne(t => t.DestinationAccount)
                .WithMany()
                .HasForeignKey(t => t.DestinationAccountId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
