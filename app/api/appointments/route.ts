import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Keep database credentials out of the browser; the Edge Function owns the final insert.
const CREATE_APPOINTMENT_URL =
  process.env.SUPABASE_CREATE_APPOINTMENT_URL ||
  "https://nabtkzlxqselqbcifona.supabase.co/functions/v1/create-appointment";

type AppointmentPayload = {
  arrivalTime?: unknown;
  name?: unknown;
  phone?: unknown;
  pet?: unknown;
  service?: unknown;
  note?: unknown;
};

function readRequiredText(payload: AppointmentPayload, key: keyof AppointmentPayload) {
  const value = payload[key];
  return typeof value === "string" ? value.trim() : "";
}

async function readAppointmentPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as AppointmentPayload;
  }

  const formData = await request.formData();
  return {
    arrivalTime: formData.get("arrivalTime"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    pet: formData.get("pet"),
    service: formData.get("service"),
    note: formData.get("note"),
  };
}

export async function POST(request: Request) {
  let payload: AppointmentPayload;

  try {
    payload = await readAppointmentPayload(request);
  } catch {
    return NextResponse.json({ message: "预约信息格式不正确。" }, { status: 400 });
  }

  const arrivalTimeText = readRequiredText(payload, "arrivalTime");
  const customerName = readRequiredText(payload, "name");
  const phone = readRequiredText(payload, "phone");
  const petType = readRequiredText(payload, "pet");
  const serviceType = readRequiredText(payload, "service");
  const note = typeof payload.note === "string" ? payload.note.trim() : "";
  const arrivalTime = new Date(arrivalTimeText);

  if (!arrivalTimeText || Number.isNaN(arrivalTime.getTime())) {
    return NextResponse.json({ message: "请选择正确的到店时间。" }, { status: 400 });
  }

  if (!customerName || !phone || !petType || !serviceType) {
    return NextResponse.json({ message: "请填写完整的预约信息。" }, { status: 400 });
  }

  try {
    const response = await fetch(CREATE_APPOINTMENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        arrivalTime: arrivalTime.toISOString(),
        name: customerName,
        phone,
        pet: petType,
        service: serviceType,
        note,
      }),
    });
    const result = (await response.json().catch(() => null)) as {
      appointmentId?: string;
      message?: string;
    } | null;

    if (!response.ok) {
      console.error("Failed to create appointment through Supabase function", {
        status: response.status,
        message: result?.message,
      });
      return NextResponse.json(
        { message: result?.message || "预约提交失败，请稍后再试或直接电话联系门店。" },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        appointmentId: result?.appointmentId,
        message: result?.message || "预约已收到。宠瑾安会尽快回电确认。",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to call Supabase appointment function", error);
    return NextResponse.json({ message: "预约提交失败，请稍后再试或直接电话联系门店。" }, { status: 500 });
  }
}
