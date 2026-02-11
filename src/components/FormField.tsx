import React, { type JSX } from "react";
import { Field, FieldContent, FieldLabel, fieldVariants } from "./ui/field";
import type { VariantProps } from "class-variance-authority";

type FormFieldProps = {
  label: string | JSX.Element;
  children?: React.ReactNode;
};

export default function FormField({
  label,
  children,
  orientation = "responsive",
}: FormFieldProps & VariantProps<typeof fieldVariants>) {
  return (
    <Field orientation={orientation} className="min-w-0">
      <FieldContent>
        <FieldLabel className="font-bold">{label}</FieldLabel>
      </FieldContent>
      {children}
    </Field>
  );
}
