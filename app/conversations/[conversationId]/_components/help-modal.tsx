"use client";

import Button from "@/components/core/button";
import CodeLine from "@/components/core/code-line";
import Modal from "@/components/core/modal";

interface HelpModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
}) => {
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
            Selamat datang di halaman bantuan!
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            KiChat menyediakan fitur fitur yang berbeda dengan aplikasi chat lainnya.
          </p>

          <div className="space-y-1 mt-4 border p-2 rounded-lg">
            <h4>Buka fitur tambahan</h4>
            <p className="text-sm text-gray-600">
              Kamu bisa mengetikan kode dibawah ini di input teks pesan. Cobalah dan sesuatu yang keren akan muncul!
            </p>
            <CodeLine>{'&show -p "KataSandiAkun123"'}</CodeLine>
          </div>

          <div className="space-y-1 border p-2 rounded-lg mt-2">
            <h4>Sembunyikan fitur tambahan</h4>
            <p className="text-sm text-gray-600">
              Kamu bisa mengetikan kode dibawah ini di input teks pesan.
            </p>
            <CodeLine>{'&hidden'}</CodeLine>
          </div>

          <div className="border p-2 rounded-lg mt-2">
            <p className="text-sm text-gray-600">
              <b>Catatan:</b> Jika kode sudah sesuai format maka pesan tidak akan dikirimkan melainkan akan menjalankan program tambahan.
            </p>
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

export default HelpModal;