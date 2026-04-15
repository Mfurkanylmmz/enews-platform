import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/lib/server/admin-auth";
import { getSupabaseAdminClient, getSupabaseNewsBucket } from "@/lib/server/supabase-admin";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

function sanitizeFileName(input: string) {
  return input
    .toLocaleLowerCase("tr-TR")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Sadece resim dosyası yüklenebilir." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "Maksimum dosya boyutu 8MB." }, { status: 400 });
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const baseName = sanitizeFileName(file.name.replace(/\.[^.]+$/, "")) || "image";
  const fileName = `${Date.now()}-${randomUUID()}-${baseName}.${ext}`;
  const filePath = `articles/${fileName}`;

  const supabase = getSupabaseAdminClient();
  const bucket = getSupabaseNewsBucket();
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, bytes, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    return NextResponse.json({ error: `Yükleme başarısız: ${uploadError.message}` }, { status: 500 });
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return NextResponse.json({
    data: {
      url: data.publicUrl,
      path: filePath,
    },
  });
}
