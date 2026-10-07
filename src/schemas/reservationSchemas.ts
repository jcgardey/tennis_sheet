import { timeToMinutes } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import { z } from "zod";

// Validation messages are translation keys from the 'Booking' namespace.
// They are translated where the errors are rendered.
const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const personSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
});

const baseReservationSchema = z.object({
  court: z
    .object({ id: z.number(), name: z.string() })
    .nullable()
    .refine((value) => value !== null, { message: "courtRequired" }),
  date: z.custom<Dayjs>((value) => dayjs.isDayjs(value), "dateRequired"),
  startTime: z.string().regex(TIME_REGEX, "startTimeInvalid"),
  endTime: z.string().regex(TIME_REGEX, "endTimeInvalid"),
  description: z.string().max(100, "descriptionTooLong").optional(),
  players: z.array(personSchema),
});

const matchSchema = baseReservationSchema
  .extend({
    type: z.literal("MATCH"),
    coach: z.null(),
  })
  .refine(
    (data) => data.players.length > 0 || Boolean(data.description?.trim()),
    {
      message: "matchDescriptionRequired",
      path: ["description"],
    },
  );

const lessonSchema = baseReservationSchema
  .extend({
    type: z.literal("LESSON"),
    coach: personSchema,
  })
  .refine((data) => data.players.length > 0, {
    message: "lessonPlayerRequired",
    path: ["players"],
  });

export const ReservationFormSchema = z
  .discriminatedUnion("type", [matchSchema, lessonSchema])
  .refine(
    (data) => timeToMinutes(data.endTime) > timeToMinutes(data.startTime),
    {
      message: "endAfterStart",
      path: ["endTime"],
    },
  );

export type ReservationFormData = z.infer<typeof ReservationFormSchema>;
export type ReservationInputData = z.input<typeof ReservationFormSchema>;
