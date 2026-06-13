import { ComponentDetailPage } from "@/components/modules/components/ComponentDetailPage";

type ComponentDetailRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function ComponentDetailRoutePage({ params }: ComponentDetailRouteProps) {
  const { id } = await params;
  return <ComponentDetailPage componentId={id} />;
}
