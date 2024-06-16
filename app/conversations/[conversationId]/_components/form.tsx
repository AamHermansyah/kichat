"use client";

import useConversation from "@/hooks/useConversation";
import axios from "axios";
import {
  FieldValues,
  SubmitHandler,
  useForm
} from "react-hook-form";
import { SendHorizonal, Image } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";

import MessageInput from "./message-input";
import toast from "react-hot-toast";
import useSecretFeatures from "@/hooks/useSecretFeatures";

const Form = () => {
  const { conversationId } = useConversation();
  const { showConfigButton, toggleConfigButton, showSecretInput } = useSecretFeatures();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
      secret: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });

    const message = data.message as string;
    const commandOpenRegex = /^&open -p ".*"$/gm;

    if (commandOpenRegex.test(message)) {
      if (showConfigButton) {
        toast.success('Fitur sudah terbuka!')
      } else {
        // const password = message.split(' ')[2];
        // Cek apakah password benar atau tidak

        toggleConfigButton();
        toast.success('Berhasil membuka fitur tambahan.');
      }

      return;
    }

    const commandCloseRegex = /^&hidden$/gm;

    if (commandCloseRegex.test(message)) {
      if (!showConfigButton) {
        toast.success('Anda sudah berada di mode normal!');
      } else {
        // const password = message.split(' ')[2];
        // Cek apakah password benar atau tidak

        toggleConfigButton();
        toast.success('Berhasil beralih ke mode normal.')
      }

      return;
    }

    if (!showSecretInput) {
      console.log(message);
      // axios.post('/api/messages', {
      //   ...data,
      //   conversationId
      // })
    } else {
      const secret = data.secret as string;
      console.log(secret);
      // Handle ketika menggunakan pesan rahasia
    }
  };

  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result?.info?.secure_url,
      conversationId
    })
  }

  return (
    <div
      className="
        py-4
        px-4
        bg-white
        border-t
        flex
        items-center
        gap-2
        lg:gap-4
        w-full
      "
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset="zqbtsaj2"
      >
        <Image size={24} className="text-purple-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <div className="flex-auto flex flex-col sm:flex-row gap-2">
          <MessageInput
            id="message"
            register={register}
            errors={errors}
            required
            placeholder="Tulis pesan"
          />
          {showSecretInput && (
            <MessageInput
              id="secret"
              register={register}
              errors={errors}
              required={showSecretInput}
              placeholder="Pesan Rahasia"
            />
          )}
        </div>
        <button
          type="submit"
          className="
            rounded-full
            p-2
            bg-purple-500
            cursor-pointer
            hover:bg-purple-600
            transition
          "
        >
          <SendHorizonal
            size={18}
            className="text-white"
          />
        </button>
      </form>
    </div>
  );
}

export default Form;