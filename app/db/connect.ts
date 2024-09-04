import mongoose from "mongoose";
declare global {
  var mongoose: any;
}

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (!CONNECTION_STRING) {
    throw new Error(
      "Please define the DATABASE_CONNECTION_STRING environment variable inside .env.local"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose
      .connect(CONNECTION_STRING, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
