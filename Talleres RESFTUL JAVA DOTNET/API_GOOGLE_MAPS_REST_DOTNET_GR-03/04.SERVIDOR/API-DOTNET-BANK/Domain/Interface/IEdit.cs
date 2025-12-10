namespace API_DOTNET_BANK.Domain.Interface
{
    public interface IEdit<in TEntity>
    {
        void EditEntity(TEntity entity);
    }
}
