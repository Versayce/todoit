import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    allProjects: ProjectState[],
    currentProject: ProjectState,
    currentProjectId: string,
}

type ProjectState = {
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
    allProjects: [],
    currentProject: {} as ProjectState,
    currentProjectId: "",
} as InitialState

export const project = createSlice({
    name: "project",
    initialState,
    reducers: {
        setAllProjects: (state, action: PayloadAction<any>) => {
            state.allProjects = action.payload;
        },
        setCurrentProject: (state, action: PayloadAction<any>) => {
            state.currentProject = action.payload;
        },
        setCurrentProjectId: (state, action: PayloadAction<string>) => {
            state.currentProjectId = action.payload;
        },
    },
});

export const { setAllProjects, setCurrentProject, setCurrentProjectId } = project.actions;
