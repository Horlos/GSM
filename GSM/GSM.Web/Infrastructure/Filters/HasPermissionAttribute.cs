using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Microsoft.AspNet.Identity;
using GSM.Data.Services.Interfaces;

namespace GSM.Infrastructure.Filters
{
    public class HasPermissionAttribute : AuthorizeAttribute
    {
        private readonly Permission[] _allowedPermissions;

        public HasPermissionAttribute(params Permission[] permissions)
        {
            _allowedPermissions = permissions;
        }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            var userName = httpContext.User.Identity.GetUserName();
            using (var authorizationService = DependencyResolver.Current.GetService<IAuthorizationService>())
            {
                var hasPermissions =
                    _allowedPermissions.Any(p => authorizationService.HasUserPermission(userName, (int)p));
                if (hasPermissions)
                    return true;
            }

            return false;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            if (!filterContext.HttpContext.User.Identity.IsAuthenticated)
            {
                base.HandleUnauthorizedRequest(filterContext);
            }
            else
            {
                filterContext.Result = new RedirectToRouteResult(new
                RouteValueDictionary(new { controller = "Error", action = "AccessDenied" }));
            }
        }
    }
}