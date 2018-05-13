using System;
using System.Collections.Generic;
using GSM.Data.Models;

namespace GSM.Data.Services.Interfaces
{
    public interface IAuthorizationService : IDisposable
    {
        IEnumerable<Role> GetRoles();
        Role GetRole(int roleId);
        Role GetRoleByName(string roleName);
        IEnumerable<Permission> GetPermissions();
        IEnumerable<User> GetRoleUsers(Role role);
        Permission GetPermission(int permissionId);
        void CreateRole(Role role);
        void UpdateRole(Role role);
        void CreateUser(User user);
        void DeleteRole(Role role);
        User GetUser(int userId);
        User GetUserByName(string userName);
        bool HasUserPermission(string userName, int permissionId);
        bool HasAnyRoles(string userName);
        bool IsRoleInUse(int roleId);
    }
}
