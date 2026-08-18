import moment from 'moment';
import z from 'zod';

export const productSchema = z.object({
    date: z
        .date({ required_error: 'Please select a date' })
        .transform((date) => moment(date).format('YYYY-MM-DD')),
    productName: z
        .string({ required_error: 'Please enter product name' })
        .min(1, 'Please enter product name'),
    plannedQuantity: z
        .union([
            z.string().min(1, 'Please enter planned quantity'),
            z.number().min(0, 'Planned quantity must be positive'),
        ])
        .transform((val) => Number(val))
        .refine((num) => !isNaN(num), {
            message: 'Planned quantity must be a valid number',
        })
        .refine((num) => num >= 0, {
            message: 'Planned quantity must be positive',
        }),
    manufacturingOrder: z
        .string({ required_error: 'Please enter manufacturing order' })
        .min(1, 'Please enter manufacturing order'),
});
