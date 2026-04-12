import {
  WORK_OG_CONTENT_TYPE,
  WORK_OG_SIZE,
  createWorkOpengraphImage,
} from "@/lib/create-work-opengraph-image";

export const size = WORK_OG_SIZE;
export const contentType = WORK_OG_CONTENT_TYPE;

export default createWorkOpengraphImage("quotes");
