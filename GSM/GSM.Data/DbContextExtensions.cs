using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Data.Entity.Core.Metadata.Edm;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Linq;

namespace GSM.Data
{
    public static class DbContextExtensions
    {
        private static readonly ConcurrentDictionary<EntityType, ReadOnlyDictionary<string, NavigationProperty>>
            NavPropMappings = new ConcurrentDictionary<EntityType, ReadOnlyDictionary<string, NavigationProperty>>();

        public static int ExpectedRowsCount(this DbContext source)
        {
            return source.ChangeTracker.Entries().Count(e => e.State == EntityState.Added
                                                             || e.State == EntityState.Modified
                                                             || e.State == EntityState.Deleted);
        }

        public static void DeleteOrphans(this DbContext source)
        {
            var objectContextAdapter = source as IObjectContextAdapter;
            if (objectContextAdapter != null)
            {
                var context = objectContextAdapter.ObjectContext;
                var entries = context.ObjectStateManager.GetObjectStateEntries(EntityState.Modified);
                DeleteOrphans(context, entries);
            }
        }

        private static void DeleteOrphans(ObjectContext context, IEnumerable<ObjectStateEntry> entries)
        {
            var metadataWorkspace = context.MetadataWorkspace;
            foreach (var entry in entries)
            {
                var entityType = GetEntityType(metadataWorkspace, entry);
                if (entityType == null)
                    continue;

                var navPropMap = NavPropMappings.GetOrAdd(entityType, CreateNavigationPropertyMap);
                var props = entry.GetModifiedProperties().ToArray();
                foreach (var prop in props)
                {
                    NavigationProperty navProp;
                    if (!navPropMap.TryGetValue(prop, out navProp))
                        continue;

                    var related = entry.RelationshipManager.GetRelatedEnd(navProp.RelationshipType.FullName,
                        navProp.ToEndMember.Name);
                    var enumerator = related.GetEnumerator();
                    if (enumerator.MoveNext() && enumerator.Current != null)
                        continue;

                    entry.Delete();
                    break;
                }
            }
        }

        private static EntityType GetEntityType(MetadataWorkspace metadataWorkspace, ObjectStateEntry entry)
        {
            var type = ObjectContext.GetObjectType(entry.Entity.GetType());
            var entityNamespace = entry.EntitySet.ElementType.NamespaceName;
            EdmType edmType;
            if (metadataWorkspace.TryGetType(type.Name, entityNamespace, DataSpace.CSpace, out edmType))
                return edmType as EntityType;

            return null;
        }

        private static ReadOnlyDictionary<string, NavigationProperty> CreateNavigationPropertyMap(EntityType type)
        {
            var result = type.NavigationProperties
                .Where(v => v.FromEndMember.RelationshipMultiplicity == RelationshipMultiplicity.Many)
                .Where(
                    v =>
                        v.ToEndMember.RelationshipMultiplicity == RelationshipMultiplicity.One ||
                        (v.ToEndMember.RelationshipMultiplicity == RelationshipMultiplicity.ZeroOrOne &&
                         v.FromEndMember.GetEntityType() == v.ToEndMember.GetEntityType()))
                .Select(
                    v =>
                        new { NavigationProperty = v, DependentProperties = v.GetDependentProperties().Take(2).ToArray() })
                .Where(v => v.DependentProperties.Length == 1)
                .ToDictionary(v => v.DependentProperties[0].Name, v => v.NavigationProperty);

            return new ReadOnlyDictionary<string, NavigationProperty>(result);
        }
    }
}
