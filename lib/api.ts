export async function apiFetch(
  endpoint: string,
  options?: RequestInit
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    options
  );

  if (!response.ok) {
    throw new Error("API Error");
  }

  return response.json();
}