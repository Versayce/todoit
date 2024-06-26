import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserProjectsByUserId } from "./requests";

type Project = {
    id: string,
    title: string,
    description: string,
    completionStatus: boolean,
    authorId?: string,
    projectTasks?: {
        id: string,
        title: string,
        description: string,
        priority?: string,
        completionStatus: boolean,
        author?: {
            id: string,
            name: string,
            email: string,
        },
    }[]
}

export const getAllUserProjects = createAsyncThunk<Project[], string, { rejectValue: string }>(
    '/project/fetchAllProjects',
    async (id: string, { rejectWithValue }) => {
        try {
            const projects = await getUserProjectsByUserId(id);
            return projects;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('An error occurred.');
            }
        }
    }
)
