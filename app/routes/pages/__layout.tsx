// app/routes/__layout.tsx
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { getUserSession } from "~/utils/auth.server";
import Layout from "~/components/Layout";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserSession(request);
  console.log("usuario (loader):", user);
  return json({ user });
};

export default function RouteLayout() {
  const data = useLoaderData<typeof loader>();
  // Aquí pasamos los datos al componente Layout sin que éste importe funciones de servidor.
  return (
    <>
      <Layout user={data.user}>
        <Outlet />
      </Layout>
    </>
  );
}
