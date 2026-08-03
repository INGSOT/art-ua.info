import ImpersonateRedirect from "./ImpersonateRedirect";

interface ImpersonatePageProps {
  params: Promise<{ token: string }>;
}

export default async function ImpersonatePage({ params }: ImpersonatePageProps) {
  const { token } = await params;

  return <ImpersonateRedirect token={token} />;
}
