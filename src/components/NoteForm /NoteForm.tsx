import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useId } from "react";

interface NoteFormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

const noteValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteFormProps {
  onCancel: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title is to short")
    .max(50, "Title is to longh")
    .required("This field is requered"),
  content: Yup.string().max(500, "Content should not be more then 500 simbols"),
  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Incorect value"
    )
    .required("Tag is requered"),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const fieldId = useId();

  const handleSubmit = async (
    values: NoteFormValues,
    formikHelpers: FormikHelpers<NoteFormValues>
  ) => {
    await new Promise((res) => setTimeout(res, 1000));
    console.log(values);
    formikHelpers.resetForm();
  };

  return (
    <Formik
      initialValues={noteValues}
      onSubmit={handleSubmit}
      validationSchema={NoteSchema}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-title`}>Title</label>
            <Field
              id={`${fieldId}-title`}
              type="text"
              name="title"
              className={css.input}
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-content`}>Content</label>
            <Field
              as="textarea"
              id={`${fieldId}-content`}
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-tag`}>Tag</label>
            <Field
              as="select"
              id={`${fieldId}-tag`}
              name="tag"
              className={css.select}
            >
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
