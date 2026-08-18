import * as XLSX from 'xlsx';
import moment from 'moment';
import type { TBarcode, TProduct } from '../types';

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

export const exportProductBarcodesToExcel = (
    product: TProduct,
    barcodes: TBarcode[],
    fileName?: string,
) => {
    if (!product) {
        return;
    }

    const sheetData: (string | number)[][] = [
        // 1. Product Summary Headers
        [
            'Date',
            'Product Name',
            'Manufacturing Order',
            'Planned Quantity',
            'Production Quantity',
        ],
        // 2. Product Summary Values
        [
            moment(product.date).format('YYYY-MM-DD'),
            product.productName,
            product.manufacturingOrder,
            product.plannedQuantity,
            product.productionQuantity ?? 0,
        ],
        [], // Empty row separator
        // 3. Barcodes Header
        ['#', 'Barcode', 'Scanned / Created At'],
    ];

    // 4. Barcodes List
    if (barcodes && barcodes.length > 0) {
        barcodes.forEach((item, index) => {
            sheetData.push([
                index + 1,
                item.barcode,
                item.createdAt
                    ? moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                    : 'N/A',
            ]);
        });
    } else {
        sheetData.push(['No barcodes recorded yet']);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet['!cols'] = [
        { wch: 14 }, // Date / #
        { wch: 28 }, // Product Name / Barcode
        { wch: 25 }, // Manufacturing Order / Scanned At
        { wch: 18 }, // Planned Quantity
        { wch: 20 }, // Production Quantity
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Barcodes');

    const defaultFileName = `${product.productName.replace(/[^a-zA-Z0-9_-]/g, '_')}_barcodes`;
    const finalFileName = fileName || defaultFileName;
    const timestamp = moment().format('YYYYMMDD_HHmm');
    XLSX.writeFile(workbook, `${finalFileName}_${timestamp}.xlsx`);
};
