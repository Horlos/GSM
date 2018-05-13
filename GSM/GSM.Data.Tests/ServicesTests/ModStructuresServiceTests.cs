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
    public class ModStructuresServiceTests
    {
        #region GetModStructure

        [TestMethod]
        public void GetModStructure_WithId1_ReturnsNull_IfDbSetIsEmpty()
        {
            var data = new List<ModStructure>
            {
                new ModStructure
                {
                    Id = 1,
                    Name = "test1"
                }
            };

            var mockSet = new MoqDbSet<ModStructure>(data);
            var mockContext = new MoqContext<ModStructure>(mockSet, m => m.ModStructures);

            var service = new ModStructuresService(mockContext.Object);
            Assert.AreEqual(1, service.GetModStructure(1).Id);
        }

        [TestMethod]
        public void GetModStructure_WithId1_ReturnsTarget_ElementExists()
        {
            var data = new List<ModStructure>
            {
                new ModStructure
                {
                    Id = 1,
                    Name = "test1"
                }
            };

            var mockSet = new MoqDbSet<ModStructure>(data);
            var mockContext = new MoqContext<ModStructure>(mockSet, m => m.ModStructures);

            var service = new ModStructuresService(mockContext.Object);
            Assert.AreEqual(1, service.GetModStructure(1).Id);
        }

        [TestMethod]
        public void GetTarget_WithId2_ReturnsNull_ElementDoesNotExist()
        {
            var data = new List<ModStructure>
            {
                new ModStructure
                {
                    Id = 1,
                    Name = "test1"
                }
            };

            var mockSet = new MoqDbSet<ModStructure>(data);
            var mockContext = new MoqContext<ModStructure>(mockSet, m => m.ModStructures);

            var service = new ModStructuresService(mockContext.Object);
            Assert.AreEqual(null, service.GetModStructure(2));
        }

        [TestMethod]
        public void GetModStructure_WithId1_ReturnsFirst_ElementsHaveSameId()
        {
            var data = new List<ModStructure>
            {
                new ModStructure
                {
                    Id = 1,
                    Name = "test1"
                },
                new ModStructure
                {
                    Id = 1,
                    Name = "test2"
                }
            };

            var mockSet = new MoqDbSet<ModStructure>(data);
            var mockContext = new MoqContext<ModStructure>(mockSet, m => m.ModStructures);

            var service = new ModStructuresService(mockContext.Object);
            Assert.AreEqual("test1", service.GetModStructure(1).Name);
        }
        #endregion

        #region GetAllModStructures

        [TestMethod]
        public void GetAllModStructures_ReturnsThree_FromSetOfThree()
        {
            var data = new List<ModStructure>
            {
                new ModStructure
                {
                    Id = 1,
                    Name = "test1"
                },
                new ModStructure
                {
                    Id = 2,
                    Name = "test2"
                },
                new ModStructure
                {
                    Id = 3,
                    Name = "test3"
                }
            };

            var mockSet = new MoqDbSet<ModStructure>(data);
            mockSet.Setup(x => x.AsNoTracking()).Returns(mockSet.Object);
            var mockContext = new MoqContext<ModStructure>(mockSet, m => m.ModStructures);

            var service = new ModStructuresService(mockContext.Object);
            Assert.AreEqual(3, service.GetAllModStructures().Count());
        }
        #endregion

        #region IsModStructureExists

        [TestMethod]
        public void IsModStructureExists_ReturnsFalse_IfDifferentNamesA_And_DifferentIds()
        {
            var data = new List<ModStructure>
            {
                new ModStructure
                {
                    Id = 1,
                    Name = "test1"
                }
            };

            var mockSet = new MoqDbSet<ModStructure>(data);
            var mockContext = new MoqContext<ModStructure>(mockSet, m => m.ModStructures);

            var service = new ModStructuresService(mockContext.Object);
            var item = new ModStructure
            {
                Id = 2,
                Name = "test2"
            };

            Assert.AreEqual(false, service.IsModStructureExists(item));
        }

        [TestMethod]
        public void IsModStructureExists_ReturnsFalse_IfDifferentNames_But_SameIds()
        {
            var data = new List<ModStructure>
            {
                new ModStructure
                {
                    Id = 1,
                    Name = "test1"
                }
            };

            var mockSet = new MoqDbSet<ModStructure>(data);
            var mockContext = new MoqContext<ModStructure>(mockSet, m => m.ModStructures);

            var service = new ModStructuresService(mockContext.Object);
            var item = new ModStructure
            {
                Id = 1,
                Name = "test2"
            };

            Assert.AreEqual(false, service.IsModStructureExists(item));
        }

        [TestMethod]
        public void IsModStructureExists_ReturnsTrue_IfSameNames_But_DifferentIds()
        {
            var data = new List<ModStructure>
            {
                new ModStructure
                {
                    Id = 1,
                    Name = "test1"
                }
            };

            var mockSet = new MoqDbSet<ModStructure>(data);
            var mockContext = new MoqContext<ModStructure>(mockSet, m => m.ModStructures);

            var service = new ModStructuresService(mockContext.Object);
            var item = new ModStructure
            {
                Id = 2,
                Name = "test1"
            };

            Assert.AreEqual(true, service.IsModStructureExists(item));
        }

        [TestMethod]
        public void IsModStructureExists_ReturnsFalse_IfSameNames_And_SameIds()
        {
            var data = new List<ModStructure>
            {
                new ModStructure
                {
                    Id = 1,
                    Name = "test1"
                }
            };

            var mockSet = new MoqDbSet<ModStructure>(data);
            var mockContext = new MoqContext<ModStructure>(mockSet, m => m.ModStructures);

            var service = new ModStructuresService(mockContext.Object);
            var item = new ModStructure
            {
                Id = 1,
                Name = "test1"
            };

            Assert.AreEqual(false, service.IsModStructureExists(item));
        }
        #endregion

        #region CreateModStructure

        [TestMethod]
        public void CreateModStructure_AddsModStructure()
        {
            var item = new ModStructure
            {
                Id = 1,
                Name = "test1"
            };

            var mockSet = new MoqDbSet<ModStructure>();
            var mockContext = new MoqContext<ModStructure>(mockSet, m => m.ModStructures);

            var service = new ModStructuresService(mockContext.Object);
            service.CreateModStructure(item);

            mockContext.Verify(m => m.SetEntityStateAdded(It.IsAny<ModStructure>()), Times.Once());
            mockContext.Verify(m => m.SaveChanges(), Times.Once());
        }
        #endregion

        #region UpdateModStructure

        [TestMethod]
        public void UpdateModStructure_DoesNotChangeItem_IfItemWithSameNameExists()
        {
            var data = new List<ModStructure>
            {
                new ModStructure
                {
                    Id = 1,
                    Name = "test1"
                }
            };

            var mockSet = new MoqDbSet<ModStructure>(data);
            var mockContext = new MoqContext<ModStructure>(mockSet, m => m.ModStructures);

            var service = new ModStructuresService(mockContext.Object);
            var item = new ModStructure
            {
                Id = 2,
                Name = "test1"
            };

            service.UpdateModStructure(item);

            mockContext.Verify(m => m.SaveChanges(), Times.Never);
        }

        [TestMethod]
        public void UpdateModStructure_ChangesItem_IfSameId()
        {
            var data = new List<ModStructure>
            {
                new ModStructure
                {
                    Id = 1,
                    Name = "test1"
                }
            };

            var mockSet = new MoqDbSet<ModStructure>(data);
            var mockContext = new MoqContext<ModStructure>(mockSet, m => m.ModStructures);

            var service = new ModStructuresService(mockContext.Object);
            var item = new ModStructure
            {
                Id = 1,
                Name = "test1"
            };

            service.UpdateModStructure(item);

            mockContext.Verify(m => m.SaveChanges(), Times.Once);
        }
        #endregion

        #region DeleteModStructure

        [TestMethod]
        public void DeleteModStructure_DeletesItem()
        {
            var item = new ModStructure
            {
                Id = 1,
                Name = "test1",
                ModStructureAttachments = new List<ModStructureAttachment>(),
                InstrumentModStructures = new List<InstrumentModStructure>()
            };
            var data = new List<ModStructure> {item};

            var mockSet = new MoqDbSet<ModStructure>(data);
            var mockSet1 = new MoqDbSet<ModStructureAttachment>();
            var mockSet2 = new MoqDbSet<InstrumentModStructure>();
            var mockContext = new MoqContext<ModStructure, ModStructureAttachment, InstrumentModStructure>(mockSet, m => m.ModStructures,
                mockSet1, m => m.ModStructureAttachments, mockSet2, m => m.InstrumentModStructures);

            var service = new ModStructuresService(mockContext.Object);
            
            service.DeleteModStructure(item);

            mockContext.Verify(m => m.SetEntityStateDeleted(item), Times.Once);
            mockContext.Verify(m => m.SaveChanges(), Times.AtLeast(1));
        }

        [TestMethod]
        public void DeleteModStructure_DeletesItem_WithAttachement()
        {
            var item = new ModStructure
            {
                Id = 1,
                Name = "test1",
                ModStructureAttachments = new List<ModStructureAttachment>(),
                InstrumentModStructures = new List<InstrumentModStructure>()
            };
            var data = new List<ModStructure> {item};

            var modStructureAttachment = new ModStructureAttachment
            {
                Id = 1,
                FileName = "file1",
                ModStructureId = 1
            };
            var structureAttachments = new List<ModStructureAttachment> {modStructureAttachment};
            item.ModStructureAttachments.Add(modStructureAttachment);

            var mockSet = new MoqDbSet<ModStructure>(data);
            var mockSet1 = new MoqDbSet<ModStructureAttachment>(structureAttachments);
            var mockSet2 = new MoqDbSet<InstrumentModStructure>();
            var mockContext = new MoqContext<ModStructure, ModStructureAttachment, InstrumentModStructure>(
                mockSet, m => m.ModStructures,
                mockSet1, m => m.ModStructureAttachments,
                mockSet2, m => m.InstrumentModStructures);
            
            var service = new ModStructuresService(mockContext.Object);

            service.DeleteModStructure(item);

            mockContext.Verify(m => m.SetEntityStateDeleted(item), Times.Once);
            mockContext.Verify(m => m.SetEntityStateDeleted(modStructureAttachment), Times.Once);
            mockContext.Verify(m => m.SaveChanges(), Times.AtLeast(1));
        }

        [TestMethod]
        public void DeleteModStructure_DeletesItem_WithInstrument()
        {
            var item = new ModStructure
            {
                Id = 1,
                Name = "test1",
                ModStructureAttachments = new List<ModStructureAttachment>(),
                InstrumentModStructures = new List<InstrumentModStructure>()
            };
            var data = new List<ModStructure> { item };

            var instrumentModStructure = new InstrumentModStructure
            {
                ModStructureId = 1,
                InstrumentId = 1
            };
            var instrumentModStructures = new List<InstrumentModStructure> { instrumentModStructure };
            item.InstrumentModStructures.Add(instrumentModStructure);

            var mockSet = new MoqDbSet<ModStructure>(data);
            var mockSet1 = new MoqDbSet<ModStructureAttachment>();
            var mockSet2 = new MoqDbSet<InstrumentModStructure>(instrumentModStructures);
            var mockContext = new MoqContext<ModStructure, ModStructureAttachment, InstrumentModStructure>(mockSet, m => m.ModStructures,
                mockSet1, m => m.ModStructureAttachments, mockSet2, m => m.InstrumentModStructures);

            var service = new ModStructuresService(mockContext.Object);

            service.DeleteModStructure(item);

            mockContext.Verify(m => m.SetEntityStateDeleted(item), Times.Once);
            mockContext.Verify(m => m.SetEntityStateDeleted(instrumentModStructure), Times.Once);
            mockContext.Verify(m => m.SaveChanges(), Times.AtLeast(1));
        }
        #endregion

        #region UpdateAssociations

        [TestMethod]
        public void UpdateAssociations_DoesNotRemoveItem_IfItemIdInList()
        {
            var structureAttachment = new ModStructureAttachment
            {
                Id = 1,
                FileName = "file1",
                ModStructureId = 1
            };
            var structureAttachments = new List<ModStructureAttachment>
            {
                structureAttachment
            };
            
            var mockSet = new MoqDbSet<ModStructureAttachment>(structureAttachments);
            var mockContext = new MoqContext<ModStructureAttachment>(mockSet, m => m.ModStructureAttachments);

            var service = new ModStructuresService(mockContext.Object);
            var attachementsIds = new List<int> {1, 2};

            service.UpdateAssociations(1, attachementsIds);
            mockContext.Verify(m => m.SetEntityStateDeleted(structureAttachment), Times.Never);
        }

        [TestMethod]
        public void UpdateAssociations_RemovesItem_IfItemIdNotInList()
        {
            var structureAttachment = new ModStructureAttachment
            {
                Id = 1,
                FileName = "file1",
                ModStructureId = 1
            };
            var structureAttachments = new List<ModStructureAttachment>{structureAttachment};

            var mockSet = new MoqDbSet<ModStructureAttachment>(structureAttachments);
            var mockContext = new MoqContext<ModStructureAttachment>(mockSet, m => m.ModStructureAttachments);

            var service = new ModStructuresService(mockContext.Object);
            var attachementsIds = new List<int> { 2, 3 };

            service.UpdateAssociations(1, attachementsIds);

            mockContext.Verify(m => m.SetEntityStateDeleted(structureAttachment), Times.Once);
            mockContext.Verify(m => m.SaveChanges(), Times.Once);
        }

        #endregion

        #region UpdateInstrumentModStructures



        #endregion

        #region GetAttachement

        [TestMethod]
        public void GetAttachement_ReturnsItem_IfItemExists()
        {
            var structureAttachment = new ModStructureAttachment
            {
                Id = 1,
                FileName = "file1",
                ModStructureId = 1
            };
            var structureAttachments = new List<ModStructureAttachment> { structureAttachment };

            var mockSet = new MoqDbSet<ModStructureAttachment>(structureAttachments);
            var mockContext = new MoqContext<ModStructureAttachment>(mockSet, m => m.ModStructureAttachments);

            var service = new ModStructuresService(mockContext.Object);

            Assert.AreEqual(1, service.GetAttachement(1).Id);
        }

        [TestMethod]
        public void GetAttachement_ReturnsNull_IfDbSetIsEmpty()
        {
            var mockSet = new MoqDbSet<ModStructureAttachment>();
            var mockContext = new MoqContext<ModStructureAttachment>(mockSet, m => m.ModStructureAttachments);

            var service = new ModStructuresService(mockContext.Object);

            Assert.AreEqual(null, service.GetAttachement(1));
        }

        #endregion

        #region InsertAttachment

        [TestMethod]
        public void InsertAttachment_ExecutesSql()
        {
            var mockSet = new MoqDbSet<ModStructureAttachment>();
            var mockContext = new MoqContext<ModStructureAttachment>(mockSet, m => m.ModStructureAttachments);
            
            var service = new ModStructuresService(mockContext.Object);

            Assert.AreEqual(int.MinValue, service.InsertAttachment(1, "file1", new byte[0]));
        }

        #endregion

        #region GetAttachmentBytes



        #endregion
    }
}
