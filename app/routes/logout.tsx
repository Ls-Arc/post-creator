import { ActionFunctionArgs } from "@remix-run/node";
import { logout } from "~/utils/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  return logout(request);
};

export const loader = async () => null;

export default function LogoutPage() {
  return (
    <form method="post">
      <button type="submit">Cerrar sesión</button>
    </form>
  );
}
