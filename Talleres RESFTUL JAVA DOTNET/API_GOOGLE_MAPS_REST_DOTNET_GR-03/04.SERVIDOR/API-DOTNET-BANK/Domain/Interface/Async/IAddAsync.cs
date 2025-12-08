namespace API_DOTNET_BANK.Domain.Interface.Async
{
    public interface IAddAsync<TEntity>
    {
        Task<TEntity> AddEntityAsync(TEntity entity);
    }
}
