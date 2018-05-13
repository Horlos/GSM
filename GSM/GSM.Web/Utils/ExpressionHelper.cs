using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace GSM.Utils
{
    public enum ConditionOperator
    {
        None,
        Or,
        And
    }

    public class ConstraintCriteria
    {
        public string Property { get; set; }
        public string Value { get; set; }
        public ConditionOperator Operator { get; set; }
    }

    public static class ExpressionHelper
    {
        private static readonly MethodInfo StringContainsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
        private static readonly MethodInfo ToStringMethod = typeof(object).GetMethod("ToString");
        private static readonly MethodInfo EqualsMethod = typeof(object).GetMethod("Equals", types: new []{typeof(object)});
        private static readonly MethodInfo StringToLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes);

        public static Expression<Func<T, bool>> ContainsInLower<T>(IEnumerable<ConstraintCriteria> constraintCriterias)
        {
            Expression result = null;
            var parameter = Expression.Parameter(typeof(T));
            foreach (var constraint in constraintCriterias)
            {
                var property = constraint.Property;
                var filterTerm = constraint.Value.ToLower();
                var expression = GetPropertyExpression(parameter, property);
                var propertyType = expression.Type;
                Expression containsExpression = null;
                //if (propertyType == typeof(DateTime) || propertyType == typeof(DateTime?))
                //{
                //    DateTime dateTime;
                //    if (DateTime.TryParseExact(filterTerm, new[] {"mm-dd-yyyy"}, CultureInfo.InvariantCulture,
                //        DateTimeStyles.None, out dateTime))
                //    {
                //        Expression convertedFilter = Expression.Convert(Expression.Constant(dateTime), typeof(DateTime));
                //        Expression converted = Expression.Convert(expression, typeof(DateTime));
                //        containsExpression = Expression.Equal(converted, convertedFilter);
                //    }
                //}
                //else
                //{
                    containsExpression = expression
                        .BuildToStringExpression()
                        .BuildToLowerExpression()
                        .BuildContainsExpression(filterTerm);
                //}
                if (constraint.Operator == ConditionOperator.And)
                    result = result.JoinAndExpression(containsExpression);
                else if (constraint.Operator == ConditionOperator.Or)
                    result = result.JoinOrExpression(containsExpression);
            }

            return result.ToLambda<T, bool>(parameter);
        }

        public static LambdaExpression GetLambdaExpression<TSource>(string property)
        {
            var parameter = Expression.Parameter(typeof(TSource));
            return GetDeepPropertyExpression(parameter, property).ToLambda<TSource>(parameter);
        }

        private static LambdaExpression ToLambda<TSource>(this Expression expression, ParameterExpression parameter)
        {
            if (expression != null)
            {
                var type = expression.Type;
                var funcType = typeof(Func<,>);
                var genericFuncType = funcType.MakeGenericType(typeof(TSource), type);
                return Expression.Lambda(genericFuncType, expression, parameter);
            }
            
            return null;
        }

        private static Expression<Func<TSource, TKey>> ToLambda<TSource, TKey>(this Expression expression, ParameterExpression parameter)
        {
            if (expression != null)
            {
                return Expression.Lambda<Func<TSource, TKey>>(expression, parameter);
            }

            return null;
        }

        private static Expression BuildContainsExpression(this Expression expression, string filterTerm)
        {
            return Expression.Call(expression, StringContainsMethod, Expression.Constant(filterTerm));
        }

        private static Expression BuildToLowerExpression(this Expression expression)
        {
            return Expression.Call(expression, StringToLowerMethod);
        }

        private static Expression BuildToStringExpression(this Expression expression)
        {
            return Expression.Call(expression, ToStringMethod);
        }

        private static Expression CheckToNull(this Expression expression)
        {
            return Expression.NotEqual(expression, Expression.Constant(null, typeof(object)));
        }

        private static Expression JoinAndExpression(this Expression existingExpression, Expression expressionToAdd)
        {
            if (existingExpression == null)
                return expressionToAdd;

            return Expression.AndAlso(existingExpression, expressionToAdd);
        }

        private static Expression JoinOrExpression(this Expression existingExpression, Expression expressionToAdd)
        {
            if (existingExpression == null)
                return expressionToAdd;

            return Expression.OrElse(existingExpression, expressionToAdd);
        }

        private static Expression GetPropertyExpression(Expression parameter, string property)
        {
            return GetPropertyExpressions(parameter, property).FirstOrDefault();
        }


        private static IEnumerable<Expression> GetPropertyExpressions(Expression parameter, params string[] properties)
        {
            var propertyExpressions = properties
                .Where(property => !string.IsNullOrEmpty(property))
                .Select(property => GetDeepPropertyExpression(parameter, property));

            return propertyExpressions;
        }

        // TODO: Check for nested properties of parent has it.
        private static Expression GetDeepPropertyExpression(Expression initialInstance, string property)
        {
            if (string.IsNullOrEmpty(property))
                return null;

            Expression result = initialInstance;
            var type = initialInstance.Type;
            var nestedProperties = property.Split('.');
            foreach (string propertyName in nestedProperties)
            {
                var propertyInfo = type.GetProperty(propertyName);
                if (propertyInfo == null) break;

                result = Expression.Property(result, propertyName);
                type = propertyInfo.PropertyType;
            }

            return result;
        }
    }
}