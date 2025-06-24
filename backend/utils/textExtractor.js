import mammoth from "mammoth";

export const extractTextFromBuffer = async (file) => {
  const fileType = await import("file-type");
  const type = await fileType.fileTypeFromBuffer(file.buffer);

  if (type && type.ext === "docx") {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  if (type && type.ext === "txt") {
    return file.buffer.toString("utf-8");
  }

  throw new Error("Unsupported file type");
};
