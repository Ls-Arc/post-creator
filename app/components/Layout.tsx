import { Form, Link } from "@remix-run/react";

export type LayoutProps = {
  children: React.ReactNode;
  user: { name: string };
};

export default function Layout({ children, user }: LayoutProps) {
  return (
    <div className="layout">
      <nav>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <span>Hola, {user.name}!</span>
            <Form method="post" action="/logout">
              <button type="submit">Cerrar Sesión</button>
            </Form>
          </>
        ) : (
          <Link to="/login">Iniciar Sesión</Link>
        )}
      </nav>
      {children}
    </div>
  );
}
