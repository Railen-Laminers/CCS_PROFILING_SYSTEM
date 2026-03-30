import XLSX from 'xlsx-js-style';

/**
 * Professional Excel Export Utility (Styled .xlsx)
 * Features: Colored Headers, Zebra Striping, Borders, and Auto-Widths.
 */

export const exportToExcel = (data, filename = 'Student_Management_Report.xlsx') => {
    if (!data || !data.length) return;

    // 1. Prepare worksheet data
    const headers = Object.keys(data[0]);
    const worksheetData = [
        headers, // Row 0
        ...data.map(row => headers.map(header => row[header])) // Subsequent rows
    ];

    // 2. Create the worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // 3. Define Styles
    const headerStyle = {
        fill: { fgColor: { rgb: "333333" } }, // Dark Gray
        font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
        }
    };

    const baseStyle = {
        alignment: { vertical: "center" },
        border: {
            top: { style: "thin", color: { rgb: "CCCCCC" } },
            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
            left: { style: "thin", color: { rgb: "CCCCCC" } },
            right: { style: "thin", color: { rgb: "CCCCCC" } }
        }
    };

    const zebraStyle = {
        ...baseStyle,
        fill: { fgColor: { rgb: "F9F9F9" } } // Very Light Gray
    };

    const centerAlignment = { horizontal: "center", vertical: "center" };

    // Columns that should be centered
    const centeredColumns = ["Student ID", "Year Level", "Section", "GPA", "Status", "Gender", "Birth Date"];

    // 4. Apply Styles to every cell
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            if (!worksheet[cellAddress]) continue;

            const headerName = headers[C];
            const isHeader = R === 0;
            const isEvenRow = R > 0 && R % 2 === 0;

            // Start with base or zebra style
            let style = isHeader ? { ...headerStyle } : (isEvenRow ? { ...zebraStyle } : { ...baseStyle });

            // Apply centering for specific columns
            if (!isHeader && centeredColumns.includes(headerName)) {
                style.alignment = { ...style.alignment, ...centerAlignment };
            }

            worksheet[cellAddress].s = style;
        }
    }

    // 5. Add Auto-Sizing Column Widths
    const colWidths = headers.map(header => {
        let maxLen = header.length;
        data.forEach(row => {
            const cellValue = row[header] ? String(row[header]) : "";
            if (cellValue.length > maxLen) {
                maxLen = cellValue.length;
            }
        });
        // Limit max width for readability, especially for Address
        return { wch: Math.min(40, maxLen + 2) };
    });
    worksheet['!cols'] = colWidths;

    // 6. Create Workbook and Download
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, filename);
};
