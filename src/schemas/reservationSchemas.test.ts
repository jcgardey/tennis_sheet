import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import { ReservationFormSchema } from "./reservationSchemas";

describe("ReservationFormSchema", () => {
  it("reports translation keys as validation messages", () => {
    const result = ReservationFormSchema.safeParse({
      type: "MATCH",
      court: null,
      date: dayjs("2025-06-01"),
      startTime: "09:00",
      endTime: "10:00",
      description: "Match",
      players: [],
      coach: null,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("courtRequired");
    }
  });
});
