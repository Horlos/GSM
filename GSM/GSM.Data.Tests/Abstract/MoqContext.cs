using System;
using System.Data.Entity;
using System.Linq.Expressions;
using Moq;

namespace GSM.Data.Tests.Abstract
{
    public class MoqContext<T> : Mock<TestableGeneSynthesisDbContext> 
        where T : class
    {
        public MoqContext(MoqDbSet<T> mockSet, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T>>> func)
        {
            this.CallBase = true;
            this.Setup(func).Returns(mockSet.Object);
        }
    }

    public class MoqContext<T, T1> : Mock<TestableGeneSynthesisDbContext> 
        where T : class 
        where T1 : class 
    {
        public MoqContext(MoqDbSet<T> mockSet, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T>>> func,
            MoqDbSet<T1> mockSet1, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T1>>> func1)
        {
            this.CallBase = true;
            this.Setup(func).Returns(mockSet.Object);
            this.Setup(func1).Returns(mockSet1.Object);
        }
    }

    public class MoqContext<T, T1, T2> : Mock<TestableGeneSynthesisDbContext>
        where T : class
        where T1 : class
        where T2 : class
    {
        public MoqContext(MoqDbSet<T> mockSet, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T>>> func,
            MoqDbSet<T1> mockSet1, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T1>>> func1,
            MoqDbSet<T2> mockSet2, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T2>>> func2)
        {
            this.CallBase = true;
            this.Setup(func).Returns(mockSet.Object);
            this.Setup(func1).Returns(mockSet1.Object);
            this.Setup(func2).Returns(mockSet2.Object);
        }
    }

    public class MoqContext<T, T1, T2, T3> : Mock<TestableGeneSynthesisDbContext>
        where T : class
        where T1 : class
        where T2 : class
        where T3 : class
    {
        public MoqContext(MoqDbSet<T> mockSet, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T>>> func,
            MoqDbSet<T1> mockSet1, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T1>>> func1,
            MoqDbSet<T2> mockSet2, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T2>>> func2,
            MoqDbSet<T3> mockSet3, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T3>>> func3)
        {
            this.CallBase = true;
            this.Setup(func).Returns(mockSet.Object);
            this.Setup(func1).Returns(mockSet1.Object);
            this.Setup(func2).Returns(mockSet2.Object);
            this.Setup(func3).Returns(mockSet3.Object);
        }
    }

    public class MoqContext<T, T1, T2, T3, T4> : Mock<TestableGeneSynthesisDbContext>
        where T : class
        where T1 : class
        where T2 : class
        where T3 : class
        where T4 : class
    {
        public MoqContext(MoqDbSet<T> mockSet, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T>>> func,
            MoqDbSet<T1> mockSet1, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T1>>> func1,
            MoqDbSet<T2> mockSet2, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T2>>> func2,
            MoqDbSet<T3> mockSet3, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T3>>> func3,
            MoqDbSet<T4> mockSet4, Expression<Func<TestableGeneSynthesisDbContext, DbSet<T4>>> func4)
        {
            this.CallBase = true;
            this.Setup(func).Returns(mockSet.Object);
            this.Setup(func1).Returns(mockSet1.Object);
            this.Setup(func2).Returns(mockSet2.Object);
            this.Setup(func3).Returns(mockSet3.Object);
            this.Setup(func4).Returns(mockSet4.Object);
        }
    }
}