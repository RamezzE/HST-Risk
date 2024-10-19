import { get_admin_by_name } from "../api/admin_functions";

export const GetAssignedWar = async (name) => {
  const response = await get_admin_by_name(name);

  if (response.errorMsg) return { success: false, errorMsg: response.errorMsg };

  if (!response.admin.war) return { success: false, errorMsg: "No war assigned" };

  return { success: true, war: response.admin.war };
};
