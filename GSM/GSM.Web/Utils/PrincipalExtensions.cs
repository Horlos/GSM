using System.Security.Principal;
using System.Web.Mvc;
using GSM.Data.Services.Interfaces;
using GSM.Infrastructure.Filters;

namespace GSM.Utils
{
    public static class PrincipalExtensions
    {
        public static bool HasPermissions(this IPrincipal user, Permission permission)
        {
            if (user == null)
                return false;

            var userName = user.Identity.Name;
            using (var authService = DependencyResolver.Current.GetService<IAuthorizationService>())
            {
                return authService.HasUserPermission(userName, (int) permission);
            }
        }
    }
}