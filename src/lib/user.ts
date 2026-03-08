export function getUser() {
  const stored = localStorage.getItem("spreadsheet-user");

  if (stored) return JSON.parse(stored);

  const colors = ["red", "blue", "green", "purple", "orange"];

  const user = {
    id: Math.random().toString(36).substring(2),
    name: "User-" + Math.floor(Math.random() * 1000),
    color: colors[Math.floor(Math.random() * colors.length)],
  };

  localStorage.setItem("spreadsheet-user", JSON.stringify(user));

  return user;
}