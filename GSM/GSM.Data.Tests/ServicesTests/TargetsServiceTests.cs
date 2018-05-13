using System.Collections.Generic;
using System.Linq;
using GSM.Data.Tests.Abstract;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using GSM.Data.Models;
using GSM.Data.Services;

namespace GSM.Data.Tests.ServicesTests
{
    [TestClass]
    public class TargetsServiceTests
    {
        #region GetTarget

        [TestMethod]
        public void GetTarget_WithId1_ReturnsNull_IfDbSetIsEmpty()
        {
            var data = new List<Target>
            {
                new Target
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Target>(data);
            var mockContext = new MoqContext<Target>(mockSet, m => m.Targets);

            var service = new TargetsService(mockContext.Object);
            Assert.AreEqual(1, service.GetTarget(1).Id);
        }

        [TestMethod]
        public void GetTarget_WithId1_ReturnsTarget_ElementExists()
        {
            var data = new List<Target>
            {
                new Target
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Target>(data);
            var mockContext = new MoqContext<Target>(mockSet, m => m.Targets);

            var service = new TargetsService(mockContext.Object);
            Assert.AreEqual(1, service.GetTarget(1).Id);
        }

        [TestMethod]
        public void GetTarget_WithId2_ReturnsNull_ElementDoesNotExist()
        {
            var data = new List<Target>
            {
                new Target
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Target>(data);
            var mockContext = new MoqContext<Target>(mockSet, m => m.Targets);

            var service = new TargetsService(mockContext.Object);
            Assert.AreEqual(null, service.GetTarget(2));
        }

        [TestMethod]
        public void GetTarget_WithId1_ReturnsFirst_ElementsHaveSameId()
        {
            var data = new List<Target>
            {
                new Target
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                },
                new Target
                {
                    Id = 1,
                    Name = "test2",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Target>(data);
            var mockContext = new MoqContext<Target>(mockSet, m => m.Targets);

            var service = new TargetsService(mockContext.Object);
            Assert.AreEqual("test1", service.GetTarget(1).Name);
        }
        #endregion

        #region GetAllTargets

        [TestMethod]
        public void GetAllTargets_ReturnsThree_FromSetOfThree()
        {
            var data = new List<Target>
            {
                new Target
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                },
                new Target
                {
                    Id = 2,
                    Name = "test2",
                    IsActive = false
                },
                new Target
                {
                    Id = 3,
                    Name = "test3",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Target>(data);
            mockSet.Setup(x => x.AsNoTracking()).Returns(mockSet.Object);
            var mockContext = new MoqContext<Target>(mockSet, m => m.Targets);

            var service = new TargetsService(mockContext.Object);
            var targets = service.GetAllTargets();
            Assert.AreEqual(3, targets.Count());
        }
        #endregion

        #region IsTargetExists

        [TestMethod]
        public void IsTargetExists_ReturnsFalse_IfDifferentNamesA_And_DifferentIds()
        {
            var data = new List<Target>
            {
                new Target
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Target>(data);
            var mockContext = new MoqContext<Target>(mockSet, m => m.Targets);

            var service = new TargetsService(mockContext.Object);
            var item = new Target
            {
                Id = 2,
                Name = "test2",
                IsActive = false
            };

            Assert.AreEqual(false, service.IsTargetExists(item));
        }

        [TestMethod]
        public void IsTargetExists_ReturnsFalse_IfDifferentNames_But_SameIds()
        {
            var data = new List<Target>
            {
                new Target
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Target>(data);
            var mockContext = new MoqContext<Target>(mockSet, m => m.Targets);

            var service = new TargetsService(mockContext.Object);
            var item = new Target
            {
                Id = 1,
                Name = "test2",
                IsActive = false
            };

            Assert.AreEqual(false, service.IsTargetExists(item));
        }

        [TestMethod]
        public void IsTargetExists_ReturnsTrue_IfSameNames_But_DifferentIds()
        {
            var data = new List<Target>
            {
                new Target
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Target>(data);
            var mockContext = new MoqContext<Target>(mockSet, m => m.Targets);

            var service = new TargetsService(mockContext.Object);
            var item = new Target
            {
                Id = 2,
                Name = "test1",
                IsActive = false
            };

            Assert.AreEqual(true, service.IsTargetExists(item));
        }

        [TestMethod]
        public void IsTargetExists_ReturnsFalse_IfSameNames_And_SameIds()
        {
            var data = new List<Target>
            {
                new Target
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Target>(data);
            var mockContext = new MoqContext<Target>(mockSet, m => m.Targets);

            var service = new TargetsService(mockContext.Object);
            var item = new Target
            {
                Id = 1,
                Name = "test1",
                IsActive = false
            };

            Assert.AreEqual(false, service.IsTargetExists(item));
        }
        #endregion

        #region CreateTarget

        [TestMethod]
        public void CreateTarget_AddsTarget()
        {
            var item = new Target
            {
                Id = 1,
                Name = "test1",
                IsActive = false
            };

            var mockSet = new MoqDbSet<Target>();
            var mockContext = new MoqContext<Target>(mockSet, m => m.Targets);

            var service = new TargetsService(mockContext.Object);
            service.CreateTarget(item);

            mockContext.Verify(m => m.SetEntityStateAdded(It.IsAny<Target>()), Times.Once());
            mockContext.Verify(m => m.SaveChanges(), Times.Once());
        }
        #endregion

        #region UpdateTarget

        [TestMethod]
        public void UpdateTarget_DoesNotChangeItem_IfItemWithSameNameExists()
        {
            var data = new List<Target>
            {
                new Target
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Target>(data);
            var mockContext = new MoqContext<Target>(mockSet, m => m.Targets);

            var service = new TargetsService(mockContext.Object);
            var item = new Target
            {
                Id = 2,
                Name = "test1",
                IsActive = true
            };

            service.UpdateTarget(item);

            mockContext.Verify(m => m.SaveChanges(), Times.Never);
        }

        [TestMethod]
        public void UpdateTarget_ChangesItem_IfSameId()
        {
            var data = new List<Target>
            {
                new Target
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Target>(data);
            var mockContext = new MoqContext<Target>(mockSet, m => m.Targets);

            var service = new TargetsService(mockContext.Object);
            var item = new Target
            {
                Id = 1,
                Name = "test1",
                IsActive = true
            };

            service.UpdateTarget(item);

            mockContext.Verify(m => m.SaveChanges(), Times.Once);
        }
        #endregion

        #region DeleteTarget

        [TestMethod]
        public void DeleteTarget_DeletesItem_InAllCases()
        {
            var data = new List<Target>
            {
                new Target
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Target>(data);
            var mockContext = new MoqContext<Target>(mockSet, m => m.Targets);

            var service = new TargetsService(mockContext.Object);
            var item = new Target
            {
                Id = 1,
                Name = "test1",
                IsActive = true
            };

            service.DeleteTarget(item);

            mockContext.Verify(m => m.SetEntityStateDeleted(item), Times.Once);
            mockContext.Verify(m => m.SaveChanges(), Times.Once);
        }
        #endregion
    }
}
