import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Datepicker } from "@/components/booking/DatePicker";
import { TimePicker } from "@/components/booking/TimePicker";
import { CourtCombobox } from "@/components/booking/CourtCombobox";
import { type Court, type CreateReservationData } from "@/services/courts";
import dayjs from "dayjs";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlayerCombobox } from "./PlayerCombobox";
import { usePersons } from "@/hooks/usePersons";
import { TSCombobox } from "../design-system/TSCombobox";
import type { Person } from "@/services/persons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ReservationFormSchema,
  type ReservationFormData,
  type ReservationInputData,
} from "@/schemas/reservationSchemas";
import { timeToMinutes } from "@/lib/utils";
import { useTranslations } from "next-intl";

export interface ReservationFormProps {
  onSubmit: (data: CreateReservationData) => void;
  onCancel: () => void;
  initialData?: Partial<ReservationInputData>;
  isLoading: boolean;
  action?: "create" | "edit";
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  action = "create",
}) => {
  const t = useTranslations("Booking");
  const translateError = (message?: string) =>
    message ? t(message as Parameters<typeof t>[0]) : undefined;

  const getDefaultValues = () => {
    const type = initialData?.type ?? "MATCH";
    const defaultValues = {
      court: initialData?.court || null,
      date: initialData?.date || dayjs(),
      startTime: initialData?.startTime || "09:00",
      endTime: initialData?.endTime || "10:00",
      description: initialData?.description,
      players: initialData?.players || [],
    };

    return type === "MATCH"
      ? {
          ...defaultValues,
          type: "MATCH" as const,
          coach: null,
        }
      : {
          ...defaultValues,
          type: "LESSON" as const,
          coach: (initialData as any)?.coach || null,
        };
  };

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    setValue,
    watch,
  } = useForm<ReservationInputData, unknown, ReservationFormData>({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(ReservationFormSchema),
  });

  const { persons: coaches, isLoading: isLoadingCoaches } = usePersons("COACH");

  const calculateDuration = (startTime: string, endTime: string): number => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    return endMinutes - startMinutes;
  };

  const processForm = async (data: ReservationFormData) => {
    const startDateTime = data.date
      .hour(parseInt(data.startTime.split(":")[0]))
      .minute(parseInt(data.startTime.split(":")[1]))
      .second(0)
      .millisecond(0);

    const reservationData: CreateReservationData = {
      courtId: data.court.id,
      start: startDateTime,
      durationMinutes: calculateDuration(data.startTime, data.endTime),
      description: data.description,
      playerIds: data.players.map((player) => player.id),
      coachId: data.coach?.id || null,
      type: data.type,
    };
    onSubmit(reservationData);
  };

  return (
    <form onSubmit={handleSubmit(processForm)} className="space-y-4">
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>{t("type")}</FieldLabel>
            <Select
              value={field.value}
              onValueChange={(val) => {
                if (val === "MATCH") {
                  setValue("coach", null);
                }
                field.onChange(val);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("type")}</SelectLabel>
                  <SelectItem value="MATCH">{t("match")}</SelectItem>
                  <SelectItem value="LESSON">{t("lesson")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />

      <Controller
        name="court"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>{t("court")}</FieldLabel>
            <CourtCombobox
              value={field.value}
              onValueChange={(court: Court | null) => field.onChange(court)}
            />
            <FieldError>{translateError(errors.court?.message)}</FieldError>
          </Field>
        )}
      />
      <div className="flex gap-4">
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Field className="flex-2">
              <FieldLabel>{t("date")}</FieldLabel>
              <Datepicker
                date={field.value}
                onDateChange={(date) => field.onChange(date || dayjs())}
              />
              <FieldError>{translateError(errors.date?.message)}</FieldError>
            </Field>
          )}
        />

        <Controller
          name="startTime"
          control={control}
          render={({ field }) => (
            <Field className="flex-1">
              <TimePicker
                label={t("start")}
                value={field.value}
                onChange={(time) => field.onChange(time)}
              />
              <FieldError>
                {translateError(errors.startTime?.message)}
              </FieldError>
            </Field>
          )}
        />

        <Controller
          name="endTime"
          control={control}
          render={({ field }) => (
            <Field className="flex-1">
              <TimePicker
                label={t("end")}
                value={field.value}
                onChange={(time) => field.onChange(time)}
              />
              <FieldError>{translateError(errors.endTime?.message)}</FieldError>
            </Field>
          )}
        />
      </div>

      <Controller
        name="players"
        control={control}
        render={({ field }) => {
          return (
            <PlayerCombobox
              value={field.value}
              onValueChange={(players: Person[]) => field.onChange(players)}
            />
          );
        }}
      />

      {watch("type") === "LESSON" && (
        <Controller
          name="coach"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>{t("coachField")}</FieldLabel>
              <TSCombobox
                items={coaches}
                value={field.value || null}
                onValueChange={(coach: Person | null) => field.onChange(coach)}
                placeholder={
                  isLoadingCoaches ? t("loadingCoaches") : t("selectCoach")
                }
                itemToStringLabel={(coach) => coach.name}
                itemToStringValue={(coach) => coach.id.toString()}
                isItemEqualToValue={(coach, anotherCoach) =>
                  coach.id === anotherCoach.id
                }
                emptyMessage={t("noCoaches")}
              />
              <FieldError>{translateError(errors.coach?.message)}</FieldError>
            </Field>
          )}
        />
      )}

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="description">{t("description")}</FieldLabel>{" "}
            <Input {...field} />
            <FieldError>
              {translateError(errors.description?.message)}
            </FieldError>
          </Field>
        )}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isLoading || !isValid}>
          {t(action === "create" ? "create" : "edit")}
        </Button>
      </div>
    </form>
  );
};
