/**
 * - Type of data that is returned from a submitted form.
 * - Is a map of key-value pairs where the key is the ID of the input field and the value is the value of the input field.
 * - Data are returned when all the fields are valid.
 */
export type SubmitData = Map<string, string | File | null>