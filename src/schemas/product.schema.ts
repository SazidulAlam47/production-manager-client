import moment from 'moment';
import z from 'zod';

export const productSchema = z.object({
    date: z
        .date({ required_error: 'Please select a date' })
        .transform((date) => moment(date).format('YYYY-MM-DD')),
    productName: z
        .string({ required_error: 'Please enter product name' })
        .min(1, 'Please enter product name'),
    productionPlan: z
        .union([
            z.string().min(1, 'Please enter production plan'),
            z.number().min(0, 'Production plan must be positive'),
        ])
        .transform((val) => Number(val))
        .refine((num) => !isNaN(num), {
            message: 'Production plan must be a valid number',
        })
        .refine((num) => num >= 0, {
            message: 'Production plan must be positive',
        }),
    manufacturingOrder: z
        .string({ required_error: 'Please enter manufacturing order' })
        .min(1, 'Please enter manufacturing order'),
});
