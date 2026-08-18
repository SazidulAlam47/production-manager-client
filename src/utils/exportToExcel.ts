import * as XLSX from 'xlsx';
import moment from 'moment';
import type { TProduct } from '../types';

export const exportProductsToExcel = (
    products: TProduct[],
    fileName = 'products_report',
) => {
    if (!products || products.length === 0) {
        return;
    }

    const formattedData = products.map((item) => ({
        Date: moment(item.date).format('YYYY-MM-DD'),
        'Product Name': item.productName,
        'Manufacturing Order': item.manufacturingOrder,
        'Planned Quantity': item.plannedQuantity,
        'Production Quantity': item.productionQuantity ?? 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Auto-fit column widths for clear spreadsheet viewing
    worksheet['!cols'] = [
        { wch: 14 }, // Date
        { wch: 25 }, // Product Name
        { wch: 22 }, // Manufacturing Order
        { wch: 18 }, // Planned Quantity
        { wch: 20 }, // Production Quantity
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    const timestamp = moment().format('YYYYMMDD_HHmm');
    XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`);
};
