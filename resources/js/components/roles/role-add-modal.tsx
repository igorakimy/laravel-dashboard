import InputError from '@/components/form/input-error';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Form } from '@inertiajs/react';
import { useState } from 'react';

interface PermissionOption {
  label: string;
  value: string;
}

interface RoleAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: PermissionOption[];
}

export default function RoleAddModal({ isOpen, onClose, permissions }: RoleAddModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex">
          <DialogTitle>Добавление роли</DialogTitle>
          <DialogDescription>Добавить новую роль пользователя</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col">
          <Form action={route('roles.store')} method="post" onSuccess={() => onClose()}>
            {({ processing, errors }) => (
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Название</Label>
                    <Input id="name-1" name="name" autoFocus />
                    <InputError message={errors.name} />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="display-name-1">Отображаемое название</Label>
                    <Input id="display-name-1" type="text" name="display_name" />
                    <InputError message={errors.display_name} />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="permissions">Разрешения</Label>
                    <MultiSelect
                      id="permissions"
                      options={permissions}
                      onValueChange={setSelectedPermissions}
                      defaultValue={selectedPermissions}
                      placeholder="Выберите разрешения"
                      selectAllText="Выбрать все"
                      searchOptionsText="Поиск..."
                      clearButtonText="Очистить"
                      closeButtonText="Закрыть"
                      animationConfig={{
                        badgeAnimation: 'none',
                        popoverAnimation: 'none',
                        optionHoverAnimation: 'none',
                      }}
                      emptyIndicator={<span>Нет результатов.</span>}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Отмена</Button>
                  </DialogClose>
                  <Button type="submit" disabled={processing}>
                    Сохранить
                  </Button>
                </DialogFooter>
              </div>
            )}
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
