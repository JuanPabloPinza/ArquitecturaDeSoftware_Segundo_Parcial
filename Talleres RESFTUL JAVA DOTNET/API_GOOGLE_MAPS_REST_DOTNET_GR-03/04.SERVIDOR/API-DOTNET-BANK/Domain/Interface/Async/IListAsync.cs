namespace API_DOTNET_BANK.Domain.Interface.Async
{
    public interface IListAsync<TEntity, in TEntityId>
    {
        Task<int> CountAsync();
        Task<List<TEntity>> ListEntityAsync();
        Task<TEntity?> GetEntityByIdAsync(TEntityId entityId);
    }
}
