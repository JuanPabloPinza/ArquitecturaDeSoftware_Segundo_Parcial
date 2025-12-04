namespace API_DOTNET_BANK.Domain.Interface
{
    public interface IDelete<in TEntityId>
    {
        void Delete(TEntityId entityId);
    }
}
