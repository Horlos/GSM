using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Linq.Dynamic;
using GSM.API.Controllers;

namespace GSM.Utils
{
    public static class QueryableExtensions
    {
        private const string FilterValueSeparator = "=";

        public static IQueryable<T> Filter<T>(this IQueryable<T> items, string filterQuery)
        {
            if (items == null || string.IsNullOrEmpty(filterQuery))
                return items;

            Expression<Func<T, bool>> expression = null;
            var criterias = GetConstraintCriterias(filterQuery);
            expression = ExpressionHelper.ContainsInLower<T>(criterias);
            if (expression != null)
                return items.Where(expression);

            return items;
        }

        public static IQueryable<TKey> SortBy<TKey, TValue>(this IQueryable<TKey> items, string sortBy,
            SortOrder sortOrder, Expression<Func<TKey, TValue>> defaultKeySelector)
        {
            if (!string.IsNullOrEmpty(sortBy) && items.Any())
            {
                var expression = ExpressionHelper.GetLambdaExpression<TKey>(sortBy);
                if (expression != null)
                {
                    var orderBy = "OrderBy";
                    if (sortOrder == SortOrder.desc)
                        orderBy = "OrderByDescending";

                    var sourceType = typeof(TKey);
                    var returnType = expression.ReturnType;
                    var resultExp = Expression.Call(typeof(Queryable), orderBy,
                        new[] { sourceType, returnType }, items.Expression, Expression.Quote(expression));

                    return items.Provider.CreateQuery<TKey>(resultExp);
                }
            }

            return items.OrderBy(defaultKeySelector);
        }

        public static IQueryable<T> SortAndOrderDynamic<T>(this IQueryable<T> items, string sortBy, SortOrder sortOrder)
        {
            if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortOrder == SortOrder.none)
                    sortOrder = SortOrder.desc;

                items = items.OrderBy(string.Format("{0} {1}", sortBy, sortOrder));
            }

            return items;
        }

        public static IQueryable<T> SortAndOrderDynamic<T, TKey>(this IQueryable<T> items, string sortBy,
            SortOrder sortOrder, Expression<Func<T, TKey>> defaultKeySelector)
        {
            if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortOrder == SortOrder.none)
                    sortOrder = SortOrder.desc;

                return items.OrderBy(string.Format("{0} {1}", sortBy, sortOrder));
            }

            return items.OrderBy(defaultKeySelector);
        }

        private static IEnumerable<ConstraintCriteria> GetConstraintCriterias(string filterQuery)
        {
            if (string.IsNullOrEmpty(filterQuery))
                return null;

            if (filterQuery.Contains(" and "))
                return ParseFilterQuery(filterQuery, ConditionOperator.And);

            if (filterQuery.Contains(" or "))
                return ParseFilterQuery(filterQuery, ConditionOperator.Or);

            return Enumerable.Empty<ConstraintCriteria>();
        }

        private static IEnumerable<ConstraintCriteria> ParseFilterQuery(string filterQuery, ConditionOperator conditionOperator)
        {
            var splitter = string.Empty;
            if (conditionOperator == ConditionOperator.And)
                splitter = " and ";
            else if (conditionOperator == ConditionOperator.Or)
                splitter = " or ";

            if (string.IsNullOrEmpty(splitter))
                return null;

            var constraintCriterias = new List<ConstraintCriteria>();
            var constraints = filterQuery.Split(new[] { splitter }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var constraint in constraints)
            {
                if (!string.IsNullOrEmpty(constraint) && constraint.Contains(FilterValueSeparator))
                {
                    var searchFor = constraint.Split(new[] { FilterValueSeparator }, StringSplitOptions.RemoveEmptyEntries);
                    if (searchFor.Length == 2)
                    {
                        var property = searchFor[0];
                        var value = searchFor[1];
                        if (!string.IsNullOrEmpty(property) && !string.IsNullOrEmpty(value))
                        {
                            constraintCriterias.Add(new ConstraintCriteria
                            {
                                Property = property,
                                Value = value,
                                Operator = conditionOperator
                            });
                        }
                    }
                }
            }

            return constraintCriterias;
        }
    }
}