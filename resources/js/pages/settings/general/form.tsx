import HeadingSmall from '@/components/common/heading-small';
import InputError from '@/components/form/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/settings-layout';
import { BreadcrumbItem, GeneralSettings } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import usePermissions from '@/hooks/use-permissions';
import { Spinner } from '@/components/ui/spinner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Настройки',
    href: route('settings.general.edit'),
  },
];

export default function SettingsForm({ app_name, app_description }: GeneralSettings) {
  const { can } = usePermissions();
  const { data, setData, put, processing, errors } = useForm({
    app_name: app_name,
    app_description: app_description,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('settings.general.update'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Настройки" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Глобальные настройки" />

          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="app_name">Название приложения</Label>
              <Input
                id="app_name"
                type="text"
                name="app_name"
                value={data.app_name}
                onChange={(e) => setData('app_name', e.target.value)}
              />
              <InputError message={errors.app_name} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="app_description">Описание</Label>
              <Textarea
                id="app_description"
                name="app_description"
                value={data.app_description}
                onChange={(e) => setData('app_description', e.target.value)}
              />
              <InputError message={errors.app_description} />
            </div>

            {can('settings-edit') && (
              <Button onClick={handleSubmit} disabled={processing}>
                {processing && <Spinner />}
                {processing ? 'Сохранение...' : 'Сохранить'}
              </Button>
            )}
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
