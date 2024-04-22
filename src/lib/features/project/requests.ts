import todoitFetch from "@/app/api/utils/fetch";

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
