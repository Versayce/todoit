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
        const response = await fetch('/api/project',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            }
        );
        if (!response.ok) {
            throw new Error(`ERROR: ${response.status}`);
        }
        const data: ProjectApiResponse = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('An unexpected error occurred.');
        }
    }
}
