using System.Security.Cryptography;
using System.Text;

namespace API_DOTNET_BANK.Application.Utils
{
    public static class PasswordHasher
    {
        public static string HashPassword(string plainText)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(plainText);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        public static bool VerifyPassword(string plainText, string hashedPassword)
        {
            var hash = HashPassword(plainText);
            return hash == hashedPassword;
        }
    }
}
