import { Permission, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function usePermissions() {
  const { permissions, isAdmin } = usePage<SharedData>().props.auth;

  const findPermission = (permission: string) => {
    return permissions.find((el) => el.name === permission);
  };

  const can = (value: string): boolean => {
    if (isAdmin) {
      return true;
    }

    let _return = false;

    if (!Array.isArray(permissions)) {
      return false;
    }

    if (value.includes('|')) {
      value.split('|').forEach((item) => {
        if (permissions.includes(findPermission(item.trim()) as Permission)) {
          _return = true;
        }
      });
    } else if (value.includes('&')) {
      if (value.trim() === '&') return false;
      _return = true;
      value.split('&').forEach((item) => {
        if (!permissions.includes(findPermission(item.trim()) as Permission)) {
          _return = false;
        }
      });
    } else {
      _return = permissions.includes(findPermission(value.trim()) as Permission);
    }

    return _return;
  };

  return { permissions, can };
}
