using System;
using System.Collections.Generic;
using System.Linq;
using GSM.Data.Models;
using GSM.Data.Services.Interfaces;

namespace GSM.Data.Services
{
    public class AuthorizationService : IAuthorizationService
    {
        private readonly GeneSythesisDBContext _db ;

        public AuthorizationService(GeneSythesisDBContext context)
        {
            _db = context;
        }

        public IEnumerable<Role> GetRoles()
        {
            return _db.Roles.AsNoTracking().ToList();
        }

        public Role GetRole(int roleId)
        {
            return _db.Roles.FirstOrDefault(r => r.Id == roleId);
        }

        public Role GetRoleByName(string roleName)
        {
            return _db.Roles.Where(r => r.Name == roleName)
                .ToList()
                .FirstOrDefault(r => r.Name == roleName);
        }

        public IEnumerable<Permission> GetPermissions()
        {
            return _db.Permissions.AsNoTracking().ToList();
        }

        public IEnumerable<User> GetRoleUsers(Role role)
        {
            return role.RoleUsers.Select(r => r.User);
        }

        public Permission GetPermission(int permissionId)
        {
            return _db.Permissions.FirstOrDefault(p => p.Id == permissionId);
        }

        public void CreateRole(Role role)
        {
            _db.SetEntityStateAdded(role);
            _db.SaveChanges();
        }

        public void UpdateRole(Role role)
        {
            _db.SetEntityStateModified(role);
            _db.DeleteOrphans();
            _db.SaveChanges();
        }

        public void CreateUser (User user)
        {
            _db.SetEntityStateAdded(user);
            _db.SaveChanges();
        }

        public void DeleteRole(Role role)
        {
            var rolePermissions = _db.RolePermissions
                .Where(p => p.RoleId == role.Id)
                .ToList();

            foreach (var permission in rolePermissions)
                _db.SetEntityStateDeleted(permission);

            _db.SetEntityStateDeleted(role);
            _db.SaveChanges();
        }

        public User GetUser(int userId)
        {
            return _db.Users.FirstOrDefault(u => u.Id == userId);
        }

        public User GetUserByName(string userName)
        {
            return _db.Users.Where(u => u.Name == userName)
                .ToList()
                .FirstOrDefault(u => u.Name == userName);
        }

        public bool HasUserPermission(string userName, int permissionId)
        {
            var user = GetUserByName(userName);
            if (user == null)
                return false;

            return user.Roles.Any(r => r.Role.Permissions.Any(p => p.PermissionId == permissionId));
        }

        public bool HasAnyRoles(string userName)
        {
            var user = _db.Users.FirstOrDefault(u => u.Name == userName);
            if(user != null)
                return user.Roles.Any();

            return false;
        }

        public bool IsRoleInUse(int roleId)
        {
            var role = _db.Roles.FirstOrDefault(r => r.Id == roleId);
            if(role != null)
                return role.RoleUsers.Any();

            return false;
        }

        private bool _disposed;
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        private void Dispose(bool disposing)
        {
            if (_disposed) return;

            if (disposing)
                _db.Dispose();

            _disposed = true;
        }
    }
}
