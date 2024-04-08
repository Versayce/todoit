import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProjectState } from "./projectSlice";

type projectApiResponse = ProjectState[];

export const fetchAllProjects = createAsyncThunk(
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
            const data: projectApiResponse = await response.json();
            // console.log('thunk data: ', data)
            return data;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('An error occurred.');
            }
        }
    }
)
