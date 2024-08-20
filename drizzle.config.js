

/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url:'postgresql://ai-interview_owner:oY74xfqIaJnr@ep-tiny-voice-a589u91s.us-east-2.aws.neon.tech/ai-interview?sslmode=require',
    }
  };