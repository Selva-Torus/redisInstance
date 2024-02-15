"use server";
import redis from "@/lib/redis";
export async function getAllKeys() {
  try {
    // Get all keys
    const keys = await redis.keys("*");

    const keysWithTypes = await Promise.all(
      keys.map(async (key) => {
        const type = await redis.type(key);
        return { key, type };
      })
    );

    // Log the keys
    return keysWithTypes;
  } catch (error) {
    console.error("Error:", error);
  }
}
export async function getData(keys) {
  return await redis.call("JSON.GET", keys);
}

export async function getString(keys) {
  const data = await redis.call("GET", keys);
  return data;
}

export async function deleteData(key) {
  const deletedKey = await redis.del(key);
  return deletedKey;
}

export async function scanData() {
  const keyPattern = "DF:*";
  const [cursor, keys] = await redis.scan(0, "MATCH", keyPattern);
  return keys;
}
