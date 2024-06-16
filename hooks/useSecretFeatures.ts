import { create } from "zustand";

interface SecretFeatures {
  showConfigButton: boolean;
  showSecretInput: boolean;
  showSecretMessage: boolean;
  showHelpButton: boolean;
  toggleConfigButton: () => void;
  toggleSecretInput: () => void;
  toggleSecretMessage: () => void;
  toggleHelpButton: () => void;
}

const useSecretFeatures = create<SecretFeatures>((set) => ({
  showConfigButton: false,
  showSecretInput: false,
  showSecretMessage: false,
  showHelpButton: true,
  toggleConfigButton: () => set((state) => ({ showConfigButton: !state.showConfigButton })),
  toggleSecretInput: () => set((state) => ({ showSecretInput: !state.showSecretInput })),
  toggleSecretMessage: () => set((state) => ({ showSecretMessage: !state.showSecretMessage })),
  toggleHelpButton: () => set((state) => ({ showHelpButton: !state.showHelpButton })),
}));

export default useSecretFeatures;
