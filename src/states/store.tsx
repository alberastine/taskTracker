import { create } from "zustand";
import createTaskSlice, { TaskStore } from "./taskSlice";

export const useBoundStore = create<TaskStore>()((...a) =>({
    ...createTaskSlice(...a)
})) 
