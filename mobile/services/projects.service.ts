// services/projects.service.ts — Projects data service
// DEV: returns MOCK_PROJECTS
// PROD swap: replace with supabase.from('projects').select()

import { Project } from '@/types';
import { MOCK_PROJECTS } from '@/api/mockData';

export const projectsService = {
  /** getProjects — all projects, most recent first */
  getProjects: async (): Promise<Project[]> => {
    await new Promise((r) => setTimeout(r, 300));
    // PROD: const { data } = await supabase.from('projects').select('*').order('start_date', { ascending: false })
    return MOCK_PROJECTS;
  },

  /** getProjectById — single project by id */
  getProjectById: async (id: string): Promise<Project> => {
    await new Promise((r) => setTimeout(r, 200));
    // PROD: const { data } = await supabase.from('projects').select('*').eq('id', id).single()
    const item = MOCK_PROJECTS.find((p) => p.id === id);
    if (!item) throw new Error('Project not found.');
    return item;
  },
};
