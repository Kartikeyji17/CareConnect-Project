export function getRoleFromEmail(email: string): "user" | "hospital" | "admin" {
  if (!email) return "user";

  const domain = email.split("@")[1].toLowerCase();

  if (domain === "careconnect.org") return "admin";
  if (domain.includes("hospital") || domain.includes("fortis") || domain.includes("apollo")) {
    return "hospital";
  }

  return "user"; // default
}
