namespace API_DOTNET_BANK.Domain.Interface
{
    public interface IAdd<TEntidad>
    {
        TEntidad AddEntity(TEntidad entity);
    }
}
