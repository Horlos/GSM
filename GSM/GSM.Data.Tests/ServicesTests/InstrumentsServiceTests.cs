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
    public class InstrumentsServiceTests
    {
        #region GetInstrument

        [TestMethod]
        public void GetInstrument_WithId1_ReturnsNull_IfDbSetIsEmpty()
        {
            var mockSet = new MoqDbSet<Instrument>();
            var mockContext = new MoqContext<Instrument>(mockSet, m => m.Instruments);

            var service = new InstrumentsService(mockContext.Object);

            Assert.AreEqual(null, service.GetInstrument(1));
        }

        [TestMethod]
        public void GetInstrument_WithId1_ReturnsTarget_ElementExists()
        {
            var data = new List<Instrument>
            {
                new Instrument
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Instrument>(data);
            var mockContext = new MoqContext<Instrument>(mockSet, m => m.Instruments);

            var service = new InstrumentsService(mockContext.Object);
            Assert.AreEqual(1, service.GetInstrument(1).Id);
        }

        [TestMethod]
        public void GetTarget_WithId2_ReturnsNull_ElementDoesNotExist()
        {
            var data = new List<Instrument>
            {
                new Instrument
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Instrument>(data);
            var mockContext = new MoqContext<Instrument>(mockSet, m => m.Instruments);

            var service = new InstrumentsService(mockContext.Object);
            Assert.AreEqual(null, service.GetInstrument(2));
        }

        [TestMethod]
        public void GetInstrument_WithId1_ReturnsFirst_ElementsHaveSameId()
        {
            var data = new List<Instrument>
            {
                new Instrument
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                },
                new Instrument
                {
                    Id = 1,
                    Name = "test2",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Instrument>(data);
            var mockContext = new MoqContext<Instrument>(mockSet, m => m.Instruments);

            var service = new InstrumentsService(mockContext.Object);
            Assert.AreEqual("test1", service.GetInstrument(1).Name);
        }
        #endregion

        #region GetAllInstruments

        [TestMethod]
        public void GetAllInstruments_ReturnsThree_FromSetOfThree()
        {
            var data = new List<Instrument>
            {
                new Instrument
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                },
                new Instrument
                {
                    Id = 2,
                    Name = "test2",
                    IsActive = false
                },
                new Instrument
                {
                    Id = 3,
                    Name = "test3",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Instrument>(data);
            mockSet.Setup(x => x.AsNoTracking()).Returns(mockSet.Object);
            var mockContext = new MoqContext<Instrument>(mockSet, m => m.Instruments);

            var service = new InstrumentsService(mockContext.Object);
            var instruments = service.GetAllInstruments();
            Assert.AreEqual(3, instruments.Count());
        }
        #endregion

        #region IsInstrumentExists

        [TestMethod]
        public void IsInstrumentExists_ReturnsFalse_IfDifferentNamesA_And_DifferentIds()
        {
            var data = new List<Instrument>
            {
                new Instrument
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Instrument>(data);
            var mockContext = new MoqContext<Instrument>(mockSet, m => m.Instruments);

            var service = new InstrumentsService(mockContext.Object);
            var item = new Instrument
            {
                Id = 2,
                Name = "test2",
                IsActive = false
            };

            Assert.AreEqual(false, service.IsInstrumentExists(item));
        }

        [TestMethod]
        public void IsInstrumentExists_ReturnsFalse_IfDifferentNames_But_SameIds()
        {
            var data = new List<Instrument>
            {
                new Instrument
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Instrument>(data);
            var mockContext = new MoqContext<Instrument>(mockSet, m => m.Instruments);

            var service = new InstrumentsService(mockContext.Object);
            var item = new Instrument
            {
                Id = 1,
                Name = "test2",
                IsActive = false
            };

            Assert.AreEqual(false, service.IsInstrumentExists(item));
        }

        [TestMethod]
        public void IsInstrumentExists_ReturnsTrue_IfSameNames_But_DifferentIds()
        {
            var data = new List<Instrument>
            {
                new Instrument
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Instrument>(data);
            var mockContext = new MoqContext<Instrument>(mockSet, m => m.Instruments);

            var service = new InstrumentsService(mockContext.Object);
            var item = new Instrument
            {
                Id = 2,
                Name = "test1",
                IsActive = false
            };

            Assert.AreEqual(true, service.IsInstrumentExists(item));
        }

        [TestMethod]
        public void IsInstrumentExists_ReturnsFalse_IfSameNames_And_SameIds()
        {
            var data = new List<Instrument>
            {
                new Instrument
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Instrument>(data);
            var mockContext = new MoqContext<Instrument>(mockSet, m => m.Instruments);

            var service = new InstrumentsService(mockContext.Object);
            var item = new Instrument
            {
                Id = 1,
                Name = "test1",
                IsActive = false
            };

            Assert.AreEqual(false, service.IsInstrumentExists(item));
        }
        #endregion

        #region CreateInstrument

        [TestMethod]
        public void CreateInstrument_AddsInstrument()
        {
            var item = new Instrument
            {
                Id = 1,
                Name = "test1",
                IsActive = false
            };

            var mockSet = new MoqDbSet<Instrument>();
            var mockContext = new MoqContext<Instrument>(mockSet, m => m.Instruments);

            var service = new InstrumentsService(mockContext.Object);
            service.CreateInstrument(item);

            mockContext.Verify(m => m.SetEntityStateAdded(It.IsAny<Instrument>()), Times.Once());
            mockContext.Verify(m => m.SaveChanges(), Times.Once());
        }
        #endregion

        #region UpdateInstrument

        [TestMethod]
        public void UpdateInstrument_DoesNotChangeItem_IfItemWithSameNameExists()
        {
            var data = new List<Instrument>
            {
                new Instrument
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Instrument>(data);
            var mockContext = new MoqContext<Instrument>(mockSet, m => m.Instruments);

            var service = new InstrumentsService(mockContext.Object);
            var item = new Instrument
            {
                Id = 2,
                Name = "test1",
                IsActive = true
            };

            service.UpdateInstrument(item);

            mockContext.Verify(m => m.SaveChanges(), Times.Never);
        }

        [TestMethod]
        public void UpdateInstrument_ChangesItem_IfSameId()
        {
            var data = new List<Instrument>
            {
                new Instrument
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Instrument>(data);
            var mockContext = new MoqContext<Instrument>(mockSet, m => m.Instruments);

            var service = new InstrumentsService(mockContext.Object);
            var item = new Instrument
            {
                Id = 1,
                Name = "test1",
                IsActive = true
            };

            service.UpdateInstrument(item);

            mockContext.Verify(m => m.SaveChanges(), Times.Once);
        }
        #endregion

        #region DeleteInstrument

        [TestMethod]
        public void DeleteInstrument_DeletesItem_InAllCases()
        {
            var data = new List<Instrument>
            {
                new Instrument
                {
                    Id = 1,
                    Name = "test1",
                    IsActive = false
                }
            };

            var mockSet = new MoqDbSet<Instrument>(data);
            var mockContext = new MoqContext<Instrument>(mockSet, m => m.Instruments);

            var service = new InstrumentsService(mockContext.Object);
            var item = new Instrument
            {
                Id = 1,
                Name = "test1",
                IsActive = true
            };

            service.DeleteInstrument(item);

            mockContext.Verify(m => m.SetEntityStateDeleted(item), Times.Once);
            mockContext.Verify(m => m.SaveChanges(), Times.Once);
        }
        #endregion
    }
}