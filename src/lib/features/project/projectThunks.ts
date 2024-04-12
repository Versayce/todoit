import { createAsyncThunk } from "@reduxjs/toolkit";
import { Project } from "./projectSlice";

type ProjectApiResponse = Project[];

export const fetchAllUserProjects = createAsyncThunk(
    '/project/fetchAllProjects',
    async (id: string, { rejectWithValue }) => {
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
            const data: ProjectApiResponse = await response.json();

            return (data);
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('An error occurred.');
            }
        }
    }
)
