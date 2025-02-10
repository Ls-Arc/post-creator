// app/routes/login.tsx
import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { createUserSession, login } from "~/utils/auth.server";

interface ActionData {
  error?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Datos inválidos" };
  }

  const user = await login(email, password);
  if (!user) {
    return { error: "Credenciales incorrectas" };
  }

  // Crea la sesión y redirige al usuario a la página principal
  return createUserSession(user.id, "/");
};

export default function Login() {
  const actionData = useActionData<ActionData>();

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h1>Iniciar Sesión</h1>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
      <Form method="post">
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Email: <input type="email" name="email" required />
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Contraseña: <input type="password" name="password" required />
          </label>
        </div>
        <button type="submit">Entrar</button>
      </Form>
    </div>
  );
}
