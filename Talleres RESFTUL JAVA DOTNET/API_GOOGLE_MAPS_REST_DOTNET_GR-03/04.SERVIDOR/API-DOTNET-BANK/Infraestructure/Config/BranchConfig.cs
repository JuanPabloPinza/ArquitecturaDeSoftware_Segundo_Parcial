using API_DOTNET_BANK.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API_DOTNET_BANK.Infraestructure.Config
{
    public class BranchConfig : IEntityTypeConfiguration<Branch>
    {
        public void Configure(EntityTypeBuilder<Branch> builder)
        {
            builder.ToTable("branches");
            
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();
            
            builder.Property(b => b.Name)
                .HasColumnName("name")
                .IsRequired()
                .HasMaxLength(100);
            
            builder.Property(b => b.Latitude)
                .HasColumnName("latitude")
                .IsRequired();
            
            builder.Property(b => b.Longitude)
                .HasColumnName("longitude")
                .IsRequired();
            
            builder.Property(b => b.PhoneNumber)
                .HasColumnName("phone_number")
                .IsRequired()
                .HasMaxLength(20);
            
            builder.Property(b => b.Email)
                .HasColumnName("email")
                .IsRequired()
                .HasMaxLength(100);
            
            builder.Property(b => b.IsActive)
                .HasColumnName("is_active")
                .IsRequired();
            
            builder.Property(b => b.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();
            
            builder.Property(b => b.UpdatedAt)
                .HasColumnName("updated_at");
        }
    }
}
