import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';

interface ErrorPageProps {
  status: number;
}

export default function ErrorPage({ status }: ErrorPageProps) {
  const title: string | undefined = {
    503: 'Сервис недоступен',
    500: 'Ошибка сервера',
    404: 'Страница не найдена',
    403: 'Доступ запрещён',
  }[status];

  const description: string | undefined = {
    503: 'Мы проводим технические работы. Пожалуйста, зайдите позже.',
    500: 'Ой, что-то пошло не так на наших серверах.',
    404: 'К сожалению, страница, которую вы ищете, не найдена.',
    403: 'Извините, вам запрещен доступ к этой странице.',
  }[status];

  return (
    <>
      <Head title={title} />

      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="text-7xl font-bold">{status}</h1>
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-400">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
        <Link href={route('home')}>
          <Button className="mt-6">На главную</Button>
        </Link>
      </div>
    </>
  );
}
