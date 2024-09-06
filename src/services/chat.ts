"use server";
export async function chat(body: string) {
  try {
    const res = await fetch(process.env.API_URL + "/chat2", {
      body: body,
      method: "POST",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
