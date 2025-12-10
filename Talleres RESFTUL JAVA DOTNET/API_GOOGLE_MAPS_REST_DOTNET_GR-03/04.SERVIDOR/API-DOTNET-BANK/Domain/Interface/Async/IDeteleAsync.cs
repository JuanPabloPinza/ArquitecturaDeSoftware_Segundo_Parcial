namespace API_DOTNET_BANK.Domain.Interface.Async
{

    public interface IDeleteAsync<TEntityId>
    {
        Task DeleteAsync(TEntityId entityId);
    }
}
