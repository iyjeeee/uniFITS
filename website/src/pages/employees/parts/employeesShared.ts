// parts/employeesShared.ts — Constants and types shared by the Employees page parts
export const EMPLOYEE_PAGE_SIZE = 10

// EmployeeActionResult — feedback shown in the ResponseModal after save/delete
export interface EmployeeActionResult { variant: string; title: string; message: string }
