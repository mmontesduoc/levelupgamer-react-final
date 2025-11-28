export async function getCategories() {
  const res = await fetch("http://localhost:8080/api/categories");
  if (!res.ok) throw new Error("Error al obtener categorías");
  return res.json();
}
