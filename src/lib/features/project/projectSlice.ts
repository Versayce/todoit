import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllProjects } from "./projectThunks";

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

type ProjectTaskState = {
    id: number,
    title: string,
    description: string,
    priority: string,
    completionStatus: boolean,
}

const initialState = {
    allProjects: {},
    currentProject: {} as ProjectState,
    currentProjectId: "",
} as InitialState

export const project = createSlice({
    name: "project",
    initialState,
    reducers: {
        setAllProjects: (state, action: PayloadAction<ProjectState[]>) => {
            state.allProjects = action.payload;
        },
        setCurrentProject: (state, action: PayloadAction<any>) => {
            state.currentProject = action.payload;
        },
        setCurrentProjectId: (state, action: PayloadAction<string>) => {
            state.currentProjectId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllProjects.fulfilled, (state, action) => {
            // console.log("inside reducer: ", action.payload)
            const normalizedProjects = action.payload.reduce((acc, project) => {
                acc[project.id] = project;
                return acc;
            }, {} as {[key: number]: ProjectState});
            state.allProjects = normalizedProjects;
        });
    }
});

export const { setAllProjects, setCurrentProject, setCurrentProjectId } = project.actions;
