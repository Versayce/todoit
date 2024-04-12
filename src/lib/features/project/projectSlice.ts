import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllProjects } from "./projectThunks";

type State = {
    allProjects: {[key: string]: Project},
    currentProject?: Project,
}

export type Project = {
    id: string,
    title: string,
    description: string,
    completionStatus: boolean,
    projectTasks: Task[]
}

export type Task = {
    id: string,
    title: string,
    description: string,
    priority: string,
    completionStatus: boolean,
}

const initialState: State = {
    allProjects: {},
};

export const project = createSlice({
    name: "project",
    initialState,
    reducers: {
        setAllProjects: (state, action: PayloadAction<{[key: string]: Project}>) => {
            state.allProjects = action.payload;
        },
        clearAllProjects: (state) => {
            state.allProjects = {};
        },
        setCurrentProject: (state, action: PayloadAction<Project>) => {
            state.currentProject = action.payload;
        },
        clearCurrentProject: (state) => {
            state.currentProject = undefined;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
            const normalizedProjects = action.payload.reduce<{ [key: string]: Project }>((acc, project) => {
                acc[project.id] = project;
                return acc;
            }, {});
            state.allProjects = normalizedProjects;
        });
    }
});

export const { setAllProjects, setCurrentProject, clearAllProjects, clearCurrentProject } = project.actions;
