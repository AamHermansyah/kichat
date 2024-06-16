"use client";

import Button from "@/components/core/button";
import Modal from "@/components/core/modal";
import Toggle from "@/components/core/toggle";
import useSecretFeatures from "@/hooks/useSecretFeatures";

interface SecretFeaturesModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const SecretFeaturesModal: React.FC<SecretFeaturesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    showHelpButton,
    showSecretInput,
    showSecretMessage,
    toggleHelpButton,
    toggleSecretInput,
    toggleSecretMessage
  } = useSecretFeatures();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div className="border-b border-gray-900/10 pb-6 pt-4 sm:pt-0">
          <h2 className="
              text-base
              font-semibold
              leading-7
              text-gray-900
            ">
            Konfigurasi Rahasia
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Kamu bisa mengubah beberapa tampilan dan pengaturan rahasia.
          </p>

          <div className="mt-4 flex flex-col gap-6 max-h-[450px] overflow-y-auto">
            <div className="rounded-lg border">
              <div className="p-4">
                <h1 className="text-sm sm:text-base font-semibold sm:tracking-tight">
                  Tampilkan input pesan rahasia
                </h1>
                <p className="text-xs sm:text-sm">
                  Fitur ini akan menampilkan input pesan rahasia untuk menyembunyikan pesan yang ingin kita sampaikan. Input ini muncul berdampingan dengan input pesan biasa.
                </p>
              </div>
              <hr />
              <div className="p-4">
                <Toggle
                  id="secret-input-toggle"
                  label="Enabled"
                  defaultChecked={showSecretInput}
                  onChecked={() => {
                    toggleSecretInput();
                  }}
                />
              </div>
            </div>
            <div className="rounded-lg border">
              <div className="p-4">
                <h1 className="text-sm sm:text-base font-semibold sm:tracking-tight">
                  Tampilkan pesan rahasia daripada pesan biasa
                </h1>
                <p className="text-xs sm:text-sm">
                  Akan mengganti teks biasa pada kotak percakapan menjadi pesan rahasia yang anda tulis sebelumnya. Jika tidak ada pesan rahasia, pesan akan di kembalikan ke teks biasa.
                </p>
              </div>
              <hr />
              <div className="p-4">
                <Toggle
                  id="secret-display-toggle"
                  label="Enabled"
                  defaultChecked={showSecretMessage}
                  onChecked={() => {
                    toggleSecretMessage();
                  }}
                />
              </div>
            </div>
            <div className="rounded-lg border">
              <div className="p-4">
                <h1 className="text-sm sm:text-base font-semibold sm:tracking-tight">
                  Sembunyikan tombol bantuan
                </h1>
                <p className="text-xs sm:text-sm">
                  Tombol bantuan akan dihilangkan untuk menghindari kecurigaan dari orang orang.
                </p>
              </div>
              <hr />
              <div className="p-4">
                <Toggle
                  id="help-display-toggle"
                  label="Enabled"
                  defaultChecked={showHelpButton}
                  onChecked={() => {
                    toggleHelpButton();
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            flex
            items-center
            justify-end
            gap-x-6
          "
        >
          <Button onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </Modal>
  );
}

export default SecretFeaturesModal;