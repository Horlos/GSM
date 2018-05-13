using System;
using GSM.Data.Models;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;
using AutoMapper;
using GSM.API.Models;
using GSM.Data.Services.Interfaces;
using GSM.Infrastructure.Filters;

#if !DEBUG
using System.Web.Security;
#endif

namespace GSM.API.Controllers
{
    [Authorize]
    [HasPermission(Infrastructure.Filters.Permission.ManageRoles)]
    public class AuthorizationController : ApiController
    {
        private readonly IAuthorizationService _authorizationService;

        public AuthorizationController(IAuthorizationService authorizationService)
        {
            _authorizationService = authorizationService;
        }

        [HttpGet]
        [Route("api/authorization/permissions")]
        public IHttpActionResult GetPermissions()
        {
            var model = new List<PermissionViewModel>();
            var permissions = _authorizationService.GetPermissions();
            Mapper.Map(permissions, model);
            return Ok(model);
        }

        [HttpGet]
        [Route("api/authorization/roles/{roleId}/users")]
        public IHttpActionResult GetRoleUsers(int roleId)
        {
            var role = _authorizationService.GetRole(roleId);
            if (role == null)
                return NotFound();

            var model = new List<UserViewModel>();
            var users = _authorizationService.GetRoleUsers(role);
            Mapper.Map(users, model);
            return Ok(model);
        }

        // GET: api/Authorization
        [HttpGet]
        [Route("api/authorization/roles")]
        public IHttpActionResult GetRoles()
        {
            var roles = _authorizationService.GetRoles();
            var model = new List<RoleViewModel>();
            Mapper.Map(roles, model);
            return Ok(model);
        }

        // GET: api/Authorization/5
        [HttpGet]
        [ResponseType(typeof(Role))]
        [Route("api/authorization/roles/{roleName}")]
        public IHttpActionResult GetRole([FromUri] string roleName)
        {
            var role = _authorizationService.GetRoleByName(roleName);
            if (role == null)
                return NotFound();

            var model = new RoleViewModel();
            Mapper.Map(role, model);
            return Ok(model);
        }

        [HttpGet]
        [Route("api/authorization/users/{userName}")]
        public IHttpActionResult GetUser([FromUri] string userName)
        {
            // Check for previously added domain users
            var user = _authorizationService.GetUserByName(userName);
            if (user == null)
            {
                try
                {
                    // Check the domain controller for user
                    if (!IsUserLocated(userName))
                        return NotFound();

                    user = new User { Name = userName };
                }
                catch (Exception)
                {
                    return InternalServerError();
                }
            }

            var model = new UserViewModel();
            Mapper.Map(user, model);
            return Ok(model);
        }

        // POST: api/Authorization
        [HttpPost]
        [ResponseType(typeof(Role))]
        [Route("api/authorization/users")]
        public IHttpActionResult CreateUser([FromBody] UserViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = _authorizationService.GetUserByName(model.Name);
            if (user == null)
            {
                try
                {
                    // Check the domain controller for user
                    if (!IsUserLocated(model.Name))
                        return NotFound();

                    user = Mapper.Map<User>(model);
                    _authorizationService.CreateUser(user);
                }
                catch (Exception)
                {
                    return InternalServerError();
                }
            }

            model.Id = user.Id;
            return Ok(model);
        }

        // POST: api/Authorization
        [HttpPost]
        [ResponseType(typeof(Role))]
        [Route("api/authorization/roles")]
        public IHttpActionResult CreateRole([FromBody] RoleViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var role = _authorizationService.GetRoleByName(model.Name);
            if (role == null)
            {
                role = Mapper.Map<Role>(model);
                _authorizationService.CreateRole(role);
            }
            return Ok(role);
        }

        [HttpPost]
        [Route("api/authorization/roles/{roleId}")]
        public IHttpActionResult UpdateRole([FromUri] int roleId, [FromBody] RoleViewModel model)
        {
            var role = _authorizationService.GetRole(roleId);
            if (role == null)
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Mapper.Map(model, role, opt => opt.BeforeMap((source, dest) =>
            {
                dest.Permissions.Clear();
                dest.RoleUsers.Clear();
            }));
            _authorizationService.UpdateRole(role);
            return Ok();
        }

        // DELETE: api/Authorization/5
        [ResponseType(typeof(Role))]
        [HttpDelete]
        [Route("api/authorization/roles/{id}")]
        public IHttpActionResult DeleteRole(int id)
        {
            var role = _authorizationService.GetRole(id);
            if (role == null)
                return NotFound();

            if (_authorizationService.IsRoleInUse(id))
                return Conflict();

            _authorizationService.DeleteRole(role);
            return Ok();
        }

#if !DEBUG
        private bool IsUserLocated(string userName)
        {
            return Membership.GetUser(userName) != null;
        }
#else
        // TODO: Add checking with Identity if needed.
        private bool IsUserLocated(string userName)
        {
            return true;
        }
#endif

    }
}