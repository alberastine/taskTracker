import { create } from "zustand";
import createTaskSlice, { TaskStore } from "./TaskSlice";

export const useBoundStore = create<TaskStore>()((...a) =>({
    ...createTaskSlice(...a)
})) 
