// parts/employeeReportShared.ts — Constants and types shared by the Employee report parts
export const LIST_PAGE_SIZE = 8   // rows per page in the All Employees modal

// EmployeeReportExportResult — feedback shown after Export PDF
export interface EmployeeReportExportResult { variant: string; title: string; message: string }
