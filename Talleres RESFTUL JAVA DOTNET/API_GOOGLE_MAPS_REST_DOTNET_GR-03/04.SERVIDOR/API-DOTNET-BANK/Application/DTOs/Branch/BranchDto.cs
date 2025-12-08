namespace API_DOTNET_BANK.Application.DTOs.Branch
{
    public class BranchDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string PhoneNumber { get; set; } = default!;
        public string Email { get; set; } = default!;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateBranchDto
    {
        public string Name { get; set; } = default!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string PhoneNumber { get; set; } = default!;
        public string Email { get; set; } = default!;
    }

    public class UpdateBranchDto
    {
        public string Name { get; set; } = default!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string PhoneNumber { get; set; } = default!;
        public string Email { get; set; } = default!;
        public bool IsActive { get; set; }
    }
}
