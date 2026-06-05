import { saveUser } from "../../services/UsersService.js";

export async function Users_SaveUser({ model }) {
  const res = await saveUser(model);
  if (!res.ok) throw new Error("Save failed");
  return res;
}
