import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "clear marked for deletion files",
  { minutes: 720 },
  internal.files.deleteAllFiles
);

export default crons;