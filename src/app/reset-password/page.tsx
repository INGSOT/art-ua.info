import ResetPasswordConfirmModal from "../../components/ResetPasswordConfirmModal";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <ResetPasswordConfirmModal token={params.token ?? null} email={params.email ?? null} />
  );
}
