export const checkPermissionsRoute = (route) => {
  const requestPath = {
    index: 'read',
    show: 'read',
    read: 'read',
    search: 'read',
    create: 'write',
    edit: 'update',
    update: 'update',
    deactivate: 'update',
    remove: 'remove',
    delete: 'delete'
  };

  const permission = Object.keys(requestPath)
    .map((permission) => {
      if (route.split('/').includes(permission)) {
        return requestPath[permission];
      }
    })
    .filter((permission) => permission);

  return permission[0];
};
