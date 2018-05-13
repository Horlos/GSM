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
    public class SpeciesServiceTests
    {
        #region GetSpecies

        [TestMethod]
        public void GetSpecies_WithId1_ReturnsNull_IfDbSetIsEmpty()
        {
            var data = new List<Species>
            {
                new Species
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Species>(data);
            var mockContext = new MoqContext<Species>(mockSet, m => m.SpeciesList);

            var service = new SpeciesService(mockContext.Object);
            Assert.AreEqual(1, service.GetSpecies(1).Id);
        }

        [TestMethod]
        public void GetSpecies_WithId1_ReturnsTarget_ElementExists()
        {
            var data = new List<Species>
            {
                new Species
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Species>(data);
            var mockContext = new MoqContext<Species>(mockSet, m => m.SpeciesList);

            var service = new SpeciesService(mockContext.Object);
            Assert.AreEqual(1, service.GetSpecies(1).Id);
        }

        [TestMethod]
        public void GetTarget_WithId2_ReturnsNull_ElementDoesNotExist()
        {
            var data = new List<Species>
            {
                new Species
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Species>(data);
            var mockContext = new MoqContext<Species>(mockSet, m => m.SpeciesList);

            var service = new SpeciesService(mockContext.Object);
            Assert.AreEqual(null, service.GetSpecies(2));
        }

        [TestMethod]
        public void GetSpecies_WithId1_ReturnsFirst_ElementsHaveSameId()
        {
            var data = new List<Species>
            {
                new Species
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                },
                new Species
                {
                    Id = 1,
                    Name = "test2",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Species>(data);
            var mockContext = new MoqContext<Species>(mockSet, m => m.SpeciesList);

            var service = new SpeciesService(mockContext.Object);
            Assert.AreEqual("test1", service.GetSpecies(1).Name);
        }
        #endregion

        #region GetAllSpecies

        [TestMethod]
        public void GetAllSpecies_ReturnsThree_FromSetOfThree()
        {
            var data = new List<Species>
            {
                new Species
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                },
                new Species
                {
                    Id = 2,
                    Name = "test2",
                    IsActive = false
                },
                new Species
                {
                    Id = 3,
                    Name = "test3",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Species>(data);
            mockSet.Setup(x => x.AsNoTracking()).Returns(mockSet.Object);
            var mockContext = new MoqContext<Species>(mockSet, m => m.SpeciesList);

            var service = new SpeciesService(mockContext.Object);
            Assert.AreEqual(3, service.GetAllSpecies().Count());
        }
        #endregion

        #region IsSpeciesExists

        [TestMethod]
        public void IsSpeciesExists_ReturnsFalse_IfDifferentNamesA_And_DifferentIds()
        {
            var data = new List<Species>
            {
                new Species
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Species>(data);
            var mockContext = new MoqContext<Species>(mockSet, m => m.SpeciesList);

            var service = new SpeciesService(mockContext.Object);
            var item = new Species
            {
                Id = 2,
                Name = "test2",
                IsActive = false
            };

            Assert.AreEqual(false, service.IsSpeciesExists(item));
        }

        [TestMethod]
        public void IsSpeciesExists_ReturnsFalse_IfDifferentNames_But_SameIds()
        {
            var data = new List<Species>
            {
                new Species
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Species>(data);
            var mockContext = new MoqContext<Species>(mockSet, m => m.SpeciesList);

            var service = new SpeciesService(mockContext.Object);
            var item = new Species
            {
                Id = 1,
                Name = "test2",
                IsActive = false
            };

            Assert.AreEqual(false, service.IsSpeciesExists(item));
        }

        [TestMethod]
        public void IsSpeciesExists_ReturnsTrue_IfSameNames_But_DifferentIds()
        {
            var data = new List<Species>
            {
                new Species
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Species>(data);
            var mockContext = new MoqContext<Species>(mockSet, m => m.SpeciesList);

            var service = new SpeciesService(mockContext.Object);
            var item = new Species
            {
                Id = 2,
                Name = "test1",
                IsActive = false
            };

            Assert.AreEqual(true, service.IsSpeciesExists(item));
        }

        [TestMethod]
        public void IsSpeciesExists_ReturnsFalse_IfSameNames_And_SameIds()
        {
            var data = new List<Species>
            {
                new Species
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Species>(data);
            var mockContext = new MoqContext<Species>(mockSet, m => m.SpeciesList);

            var service = new SpeciesService(mockContext.Object);
            var item = new Species
            {
                Id = 1,
                Name = "test1",
                IsActive = false
            };

            Assert.AreEqual(false, service.IsSpeciesExists(item));
        }
        #endregion

        #region CreateSpecies

        [TestMethod]
        public void CreateSpecies_AddsSpecies()
        {
            var item = new Species
            {
                Id = 1,
                Name = "test1",
                IsActive = false
            };

            var mockSet = new MoqDbSet<Species>();
            var mockContext = new MoqContext<Species>(mockSet, m => m.SpeciesList);

            var service = new SpeciesService(mockContext.Object);
            service.CreateSpecies(item);

            mockContext.Verify(m => m.SetEntityStateAdded(It.IsAny<Species>()), Times.Once());
            mockContext.Verify(m => m.SaveChanges(), Times.Once());
        }
        #endregion

        #region UpdateSpecies

        [TestMethod]
        public void UpdateSpecies_DoesNotChangeItem_IfItemWithSameNameExists()
        {
            var data = new List<Species>
            {
                new Species
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Species>(data);
            var mockContext = new MoqContext<Species>(mockSet, m => m.SpeciesList);

            var service = new SpeciesService(mockContext.Object);
            var item = new Species
            {
                Id = 2,
                Name = "test1",
                IsActive = true
            };

            service.UpdateSpecies(item);

            mockContext.Verify(m => m.SaveChanges(), Times.Never);
        }

        [TestMethod]
        public void UpdateSpecies_ChangesItem_IfSameId()
        {
            var data = new List<Species>
            {
                new Species
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Species>(data);
            var mockContext = new MoqContext<Species>(mockSet, m => m.SpeciesList);

            var service = new SpeciesService(mockContext.Object);
            var item = new Species
            {
                Id = 1,
                Name = "test1",
                IsActive = true
            };

            service.UpdateSpecies(item);

            mockContext.Verify(m => m.SaveChanges(), Times.Once);
        }
        #endregion

        #region DeleteSpecies

        [TestMethod]
        public void DeleteSpecies_DeletesItem_InAllCases()
        {
            var data = new List<Species>
            {
                new Species
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Species>(data);
            var mockContext = new MoqContext<Species>(mockSet, m => m.SpeciesList);

            var service = new SpeciesService(mockContext.Object);
            var item = new Species
            {
                Id = 1,
                Name = "test1",
                IsActive = true
            };

            service.DeleteSpecies(item);

            mockContext.Verify(m => m.SetEntityStateDeleted(item), Times.Once);
            mockContext.Verify(m => m.SaveChanges(), Times.Once);
        }
        #endregion
    }
}
