import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllProjects } from "./projectThunks";
import { clear } from "console";

type InitialState = {
    allProjects: {[key: number]: ProjectState},
    currentProject: ProjectState,
    currentProjectId: string,
}

export type ProjectState = {
    id: number,
    title: string,
    description: string,
    completionStatus: boolean,
    projectTasks: ProjectTaskState[]
}

export type ProjectTaskState = {
    id: number,
    title: string,
    description: string,
    priority: string,
    completionStatus: boolean,
}

const initialState = {
    allProjects: {} ,
    currentProject: {},
    currentProjectId: ""
} as InitialState

export const project = createSlice({
    name: "project",
    initialState,
    reducers: {
        setAllProjects: (state, action: PayloadAction<{[key: number]: ProjectState}>) => {
            state.allProjects = action.payload;
        },
        clearAllProjects: (state) => {
            state.allProjects = {};
        },
        setCurrentProject: (state, action: PayloadAction<ProjectState>) => {
            state.currentProject = action.payload;
        },
        clearCurrentProject: (state) => {
            state.currentProject = {} as ProjectState;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllProjects.fulfilled, (state, action: PayloadAction<ProjectState[]>) => {
            const normalizedProjects = action.payload.reduce((acc, project) => {
                acc[project.id] = project;
                return acc;
            }, {} as {[key: number]: ProjectState});
            state.allProjects = normalizedProjects;
        });
    }
});

export const { setAllProjects, setCurrentProject, clearAllProjects, clearCurrentProject } = project.actions;
