using API_DOTNET_BANK.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API_DOTNET_BANK.Infraestructure.Config
{
    public class UserConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");
            builder.HasKey(u => u.Id);
            
            builder.Property(u => u.FirstName).HasMaxLength(100).IsRequired();
            builder.Property(u => u.LastName).HasMaxLength(100).IsRequired();
            
            builder.Property(u => u.Username).HasMaxLength(50).IsRequired();
            builder.HasIndex(u => u.Username).IsUnique();
            
            builder.Property(u => u.Email).HasMaxLength(100).IsRequired();
            builder.HasIndex(u => u.Email).IsUnique();
            
            builder.Property(u => u.PasswordHash).HasMaxLength(255).IsRequired();
            
            builder.Property(u => u.IsActive).IsRequired().HasDefaultValue(true);
            
            builder.Property(u => u.CreatedAt).HasColumnType("datetime").IsRequired();
            builder.Property(u => u.UpdatedAt).HasColumnType("datetime");
            
            builder.Property(u => u.Role)
                .HasConversion<int>()
                .IsRequired();
        }
    }
}
