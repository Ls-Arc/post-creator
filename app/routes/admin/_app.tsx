import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { getAllPages } from "../../utils/pages.server"; // Asegúrate de que esta función devuelva los posts públicos
import { getUserSession } from "~/utils/auth.server"; // Función que obtiene la sesión del usuario

interface LoaderData {
  posts: Array<{ id: number; title: string }>;
  user: { id: number; name: string; role: string } | null;
}

export const loader: LoaderFunction = async ({ request }) => {
  const posts = await getAllPages();
  const user = await getUserSession(request);
  return json<LoaderData>({ posts, user });
};

export default function AppLayout() {
  const { posts, user } = useLoaderData<LoaderData>();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "250px",
          padding: "1rem",
          borderRight: "1px solid #ccc",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2>Lista de Posts</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <a href={`/posts/${post.id}`}>{post.title}</a>
            </li>
          ))}
        </ul>
        {user && user.role === "ADMIN" && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Opciones Admin</h3>
            <ul>
              <li>
                <a href="/admin/create">Crear Post</a>
              </li>
              <li>
                <a href="/admin/edit">Editar Post</a>
              </li>
              <li>
                <a href="/admin/delete">Eliminar Post</a>
              </li>
            </ul>
          </div>
        )}
      </aside>
      <main style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
