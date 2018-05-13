using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Moq;

namespace GSM.Data.Tests.Abstract
{
    public class MoqDbSet<T> : Mock<DbSet<T>> where T : class 
    {
        public MoqDbSet(IEnumerable<T> table)
        {
            this.As<IQueryable<T>>().Setup(q => q.Provider).Returns(() => table.AsQueryable().Provider);
            this.As<IQueryable<T>>().Setup(q => q.Expression).Returns(() => table.AsQueryable().Expression);
            this.As<IQueryable<T>>().Setup(q => q.ElementType).Returns(() => table.AsQueryable().ElementType);
            this.As<IQueryable<T>>().Setup(q => q.GetEnumerator()).Returns(() => table.AsQueryable().GetEnumerator());
        }

        public MoqDbSet() : this(new List<T>())
        {
            
        }
    }
}