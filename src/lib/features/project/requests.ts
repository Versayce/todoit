type ProjectApiResponse = {
    id: string,
    title: string,
    description: string,
    completionStatus: boolean,
    projectTasks: {
        id: string,
        title: string,
        description: string,
        priority: string,
        completionStatus: boolean,
    }[]
}

export async function fetchUserProjectsById(id: string): Promise<ProjectApiResponse> {
    try {
        
    } catch (error) {

    }
}
