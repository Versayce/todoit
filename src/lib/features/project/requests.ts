type ProjectApiResponse = {
    id: string,
    title: string,
    description: string,
    completionStatus: boolean,
    projectTasks?: {
        id: string,
        title: string,
        description: string,
        priority?: string,
        completionStatus: boolean,
    }[]
}

const BASE_URL = 'https://todoit-task.vercel.app';

export async function todoitFetch(endpoint: string, options?: RequestInit): Promise<Response> {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...options?.headers,
    };

    const finalOptions = {
        ...options,
        headers,
    };

    return fetch(`${endpoint}`, finalOptions).then(async (response) => {
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        return response
    }).catch((error) => {
        throw error;
    });
}

export async function getUserProjectsByUserId(id: string): Promise<ProjectApiResponse[]> {
    const response = await todoitFetch('/api/project', {
        method: 'POST',
        body: JSON.stringify({ id }),
    });
    
    if (!response.ok) {
        console.log(response);
        throw new Error(`ERROR: ${response.status}`);
    } else {
        const data = await response.json();
        return data;
    }
}
