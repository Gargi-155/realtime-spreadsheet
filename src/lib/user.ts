export function getUser() {
  const stored = localStorage.getItem("spreadsheet-user");

  if (stored) return JSON.parse(stored);

  const name = prompt("Enter your display name") || "Anonymous";

  const colors = ["#ef4444","#3b82f6","#10b981","#8b5cf6","#f97316"];

  const user = {
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name: name,
    color: colors[Math.floor(Math.random() * colors.length)],
  };

  localStorage.setItem("spreadsheet-user", JSON.stringify(user));

  return user;
}