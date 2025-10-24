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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SharedData } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

export default function UserChangeProfileModal({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const { auth } = usePage<SharedData>().props;

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <Form action={route('user.profile.update')} method="put" onSuccess={() => setOpen(false)}>
          {({ processing, errors }) => (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle>Изменение данных профиля</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Имя</Label>
                  <Input id="name-1" name="name" defaultValue={auth.user.name} autoFocus />
                  <InputError message={errors.name} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email-1">Email</Label>
                  <Input id="email-1" type="email" name="email" defaultValue={auth.user.email} />
                  <InputError message={errors.email} />
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
      </DialogContent>
    </Dialog>
  );
}
