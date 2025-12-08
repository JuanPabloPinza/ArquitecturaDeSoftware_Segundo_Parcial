namespace API_DOTNET_BANK.Domain.Interface
{
    public interface IList<TEntity, in TEntityId>
    {
        int Count { get; }
        List<TEntity> ListEntity();
        TEntity? GetEntityById(TEntityId entityId);
    }
}
