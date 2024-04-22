import { ProjectApiResponse } from '@/../src/lib/features/project/requests'
import { Project } from '@/../src/lib/features/project/projectSlice'

export const translateProjectApiResponseToState = (apiResponse: ProjectApiResponse[]): Project[] => {
    return apiResponse.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        completionStatus: project.completionStatus,
        projectTasks: project.projectTasks ? project.projectTasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            completionStatus: task.completionStatus,
        })) : []
    }))
}
