import { StateCreator } from "zustand";

export interface TaskStore {
    OnModalOpen: boolean
    setModalOpen:(modalOpen: boolean) => void
}

const createTaskSlice: StateCreator<TaskStore> = (set) => ({
    OnModalOpen: false,
    setModalOpen: (modalOpen: boolean) => set({ OnModalOpen: modalOpen })
});

export default createTaskSlice;
