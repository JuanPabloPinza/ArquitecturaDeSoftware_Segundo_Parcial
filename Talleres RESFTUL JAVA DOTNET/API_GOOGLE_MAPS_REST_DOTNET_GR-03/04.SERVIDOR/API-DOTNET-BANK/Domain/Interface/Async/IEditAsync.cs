namespace API_DOTNET_BANK.Domain.Interface.Async
{
    public interface IEditAsync<TEntity>
    {
        Task UpdateAsync(TEntity entity);
    }
}
