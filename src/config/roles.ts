type Role = 'user' | 'admin';
type Permission = 'createNote' | 'getNotes' | 'getNote' | 'manageNotes' | 'getUsers' | 'manageUsers';

const allRoles: Record<Role, Permission[]> = {
  user: ['createNote', 'getNotes', 'getNote'],
  admin: ['getUsers', 'manageUsers', 'createNote', 'getNotes', 'getNote', 'manageNotes'],
};

const roles: Role[] = Object.keys(allRoles) as Role[];
const roleRights: Map<Role, Permission[]> = new Map(Object.entries(allRoles) as [Role, Permission[]][]);

export { roles, roleRights, Role, Permission };
