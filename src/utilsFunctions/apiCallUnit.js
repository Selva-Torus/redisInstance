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

export async function getData(key, keyType) {
  switch (keyType) {
    case "string":
      return await redis.get(key);
    case "hash":
      return await redis.hgetall(key);
    case "list":
      return await redis.lrange(key, 0, -1);
    case "set":
      return await redis.smembers(key);
    case "zset":
      return await redis.zrange(key, 0, -1, "WITHSCORES");
    case "stream":
      return await redis.xrange(key, "-", "+");
    case "ReJSON-RL":
      const res = await redis.call("JSON.GET", key);
      return JSON.parse(res);
    default:
      return "";
  }
}

export async function postData(post) {
  const { key, value, jsonContent, valueType, restValues } = post;
  switch (valueType) {
    case "string":
      return await redis.call("SET", key, value);
    case "json":
      return await redis.call("JSON.SET", key, "$", jsonContent);
    case "hash":
      let resultArray = [];
      for (let i = 1; i <= Object.keys(restValues).length; i++) {
        const key = `key${i}`;
        const valueKey = `value${i}`;

        if (key in restValues && valueKey in restValues) {
          resultArray.push(restValues[key], restValues[valueKey]);
        }
      }
      return await redis.hmset(key, ...resultArray);
    case "list":
      const array = Object.values(restValues);
      return await redis.rpush(key, ...array);
    case "set":
      const arr_set = Object.values(restValues);
      return await redis.sadd(key, ...arr_set);
    case "sorted-set":
      let arr = [];
      for (let index = 0; index < Object.keys(restValues).length; index++) {
        arr.push(index + 1, Object.values(restValues)[index]);
      }
      return await redis.zadd(key, ...arr);
    case "stream":
      let resArray = [];
      for (let i = 1; i <= Object.keys(restValues).length; i++) {
        const key = `key${i}`;
        const valueKey = `value${i}`;

        if (key in restValues && valueKey in restValues) {
          resArray.push(restValues[key], restValues[valueKey]);
        }
      }
      return await redis.xadd(key, "*", ...resArray);
    default:
      return "error occured";
  }
}

export async function getString(keys) {
  console.log(keys);
  const data = await redis.call("GET", keys);
  console.log(data);
  return data;
}

export async function deleteData(key) {
  const deletedKey = await redis.del(key);
  return deletedKey;
}

// export async function deleteAllData() {
//   const deletedKey = await redis.flushdb();
//   return 'ellathayum delete panniten daaaaa'
// }
