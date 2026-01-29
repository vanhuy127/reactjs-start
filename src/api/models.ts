import { z } from 'zod';
// 1. Tạo hàm tạo Schema cho Response cơ bản
export const createBaseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message_code: z.string().nullable(),
    messages: z.array(
      z.object({
        field: z.string(),
        error_code: z.string(),
      }),
    ),
    data: dataSchema,
  });

// 2. Tạo hàm tạo Schema cho dữ liệu phân trang
export const createPaginatedDataSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      size: z.number(),
      totalPages: z.number(),
    }),
  });

/**
 * Auth
 */

export const signInPayloadSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const signInSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER']),
  userName: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const refreshTokenSchema = z.object({
  accessToken: z.string(),
});

// signInResponseSchema
export const signInResponseSchema = createBaseResponseSchema(signInSchema);
export const refreshTokenResponseSchema = createBaseResponseSchema(refreshTokenSchema);

export type SignInPayload = z.infer<typeof signInPayloadSchema>;
export type SignInResponse = z.infer<typeof signInResponseSchema>;

/**
 * User
 */

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
});

export const currentUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.enum(['ADMIN', 'USER']),
  userName: z.string(),
});

export const currentUserResponseSchema = createBaseResponseSchema(currentUserSchema);

export const createUserPayloadSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const changePasswordPayloadSchema = z.object({
  password: z.string(),
});

export const userResponseSchema = z.object({
  user: userSchema,
});

export const confirmEmailResponseSchema = z.boolean();

export const resetPasswordPayloadSchema = z.object({
  email: z.string(),
});

export const resetPasswordResponseSchema = z.boolean();

export const userEmailAvailabilityResponseSchema = z.boolean();

export type User = z.infer<typeof userSchema>;
export type CreateUserPayload = z.infer<typeof createUserPayloadSchema>;
export type ChangePasswordPayload = z.infer<typeof changePasswordPayloadSchema>;
export type ResetPasswordPayload = z.infer<typeof resetPasswordPayloadSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserEmailAvailabilityResponse = z.infer<typeof userEmailAvailabilityResponseSchema>;

/**
 * Bookshelf
 */

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  isInList: z.boolean(),
  finished: z.boolean(),
  rating: z.number(),
  note: z.string(),
});

export const bookResponseSchema = z.object({
  book: bookSchema,
});

export const booksResponseSchema = createBaseResponseSchema(z.array(bookSchema));

export const readingListSchema = z.object({
  userId: z.string(),
  bookId: z.string(),
  finished: z.boolean(),
  rating: z.number(),
  note: z.string(),
});

export const readingListResponseSchema = readingListSchema;

export const addToReadingListPayloadSchema = z.object({
  userId: z.string(),
  bookId: z.string(),
});

export const removeFromReadingListPayloadSchema = z.object({
  userId: z.string(),
  bookId: z.string(),
});

export const markBookPayloadSchema = z.object({
  userId: z.string(),
  bookId: z.string(),
  finished: z.boolean(),
});

export const setRatingPayloadSchema = z.object({
  userId: z.string(),
  bookId: z.string(),
  rating: z.number(),
});

export const setNotePayloadSchema = z.object({
  userId: z.string(),
  bookId: z.string(),
  note: z.string(),
});

export type Book = z.infer<typeof bookSchema>;
export type BookResponse = z.infer<typeof bookResponseSchema>;
export type BooksResponse = z.infer<typeof booksResponseSchema>;
export type ReadingListResponse = z.infer<typeof readingListResponseSchema>;
export type AddToReadingListPayload = z.infer<typeof addToReadingListPayloadSchema>;
export type RemoveFromReadingListPayload = z.infer<typeof removeFromReadingListPayloadSchema>;
export type MarkBookPayload = z.infer<typeof markBookPayloadSchema>;
export type SetRatingPayload = z.infer<typeof setRatingPayloadSchema>;
export type SetNotePayload = z.infer<typeof setNotePayloadSchema>;
