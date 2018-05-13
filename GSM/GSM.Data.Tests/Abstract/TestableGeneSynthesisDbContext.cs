using System;
using GSM.Data.Models;

namespace GSM.Data.Tests.Abstract
{
    public class TestableGeneSynthesisDbContext : GeneSythesisDBContext
    {
        public override void SetEntityStateAdded<TEntity>(TEntity item)
        {
        }

        public override void SetEntityStateDeleted<TEntity>(TEntity item)
        {
        }

        public override void SetEntityStateModified<TEntity>(TEntity item)
        {
        }

        public override int ExecuteSqlCommand(string sql, params object[] parameters)
        {
            return Int32.MinValue;
        }
    }
}
