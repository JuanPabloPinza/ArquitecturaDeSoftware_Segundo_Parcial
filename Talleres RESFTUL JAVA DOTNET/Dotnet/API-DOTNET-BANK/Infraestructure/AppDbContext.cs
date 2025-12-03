using API_DOTNET_BANK.Domain.Entities;
using API_DOTNET_BANK.Infraestructure.Config;
using Microsoft.EntityFrameworkCore;

namespace API_DOTNET_BANK.Infraestructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new UserConfig());
        }
    }
}
