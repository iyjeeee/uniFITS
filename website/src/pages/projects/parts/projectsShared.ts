// parts/projectsShared.ts — Constants and types shared by the Projects page parts
export const PROJECT_PAGE_SIZE = 10

// ProjectActionResult — feedback shown in the ResponseModal after edit/approve/reject/delete
export interface ProjectActionResult { variant: string; title: string; message: string }
