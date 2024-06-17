import { create } from "zustand";

interface SecretFeatures {
  showConfigButton: boolean;
  showSecretInput: boolean;
  showSecretMessage: boolean;
  hiddenHelpButton: boolean;
  toggleConfigButton: () => void;
  toggleSecretInput: () => void;
  toggleSecretMessage: () => void;
  setHiddenButton: (open: boolean) => void;
}

const useSecretFeatures = create<SecretFeatures>((set) => ({
  showConfigButton: false,
  showSecretInput: false,
  showSecretMessage: false,
  hiddenHelpButton: true,
  toggleConfigButton: () => set((state) => ({ showConfigButton: !state.showConfigButton })),
  toggleSecretInput: () => set((state) => ({ showSecretInput: !state.showSecretInput })),
  toggleSecretMessage: () => set((state) => ({ showSecretMessage: !state.showSecretMessage })),
  setHiddenButton: (open) => set(() => ({ hiddenHelpButton: open })),
}));

export default useSecretFeatures;
