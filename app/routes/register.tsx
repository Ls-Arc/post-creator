import { Form, useActionData } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { register, createUserSession } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return Response.json(
      { error: "El email ya está registrado" },
      { status: 400 },
    );
  }

  const user = await register(name, email, password);
  return createUserSession(user.id, "/dashboard");
};

export default function RegisterPage() {
  const actionData = useActionData();

  return (
    <div>
      <h1>Registro</h1>
      <Form method="post">
        <input type="text" name="name" placeholder="Nombre" required />
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          required
        />
        <button type="submit">Registrarse</button>
      </Form>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
    </div>
  );
}
