export function formatRole(role) {
  if (role === "DOCTOR") {
    return "Doctor";
  }

  if (role === "PATIENT") {
    return "Patient";
  }

  return role || "";
}
