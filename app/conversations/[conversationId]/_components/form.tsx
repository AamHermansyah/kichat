"use client";

import useConversation from "@/hooks/useConversation";
import axios, { AxiosError } from "axios";
import {
  FieldValues,
  SubmitHandler,
  useForm
} from "react-hook-form";
import { SendHorizonal, Image, Loader } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";

import MessageInput from "./message-input";
import toast from "react-hot-toast";
import useSecretFeatures from "@/hooks/useSecretFeatures";
import { hideSecretMessage } from "@/utils/stegcloack";
import { useState } from "react";

interface FormProps {
  hashedPassword: string | undefined;
}

const Form: React.FC<FormProps> = ({ hashedPassword }) => {
  const [hidingMessage, setHidingMessage] = useState(false);
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

  const clearForm = () => {
    setValue('message', '', { shouldValidate: true });
    setValue('secret', '', { shouldValidate: true });
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const message = data.message as string;
    const commandOpenRegex = /^&show -p ".*"$/gm;

    if (commandOpenRegex.test(message)) {
      clearForm();

      if (showConfigButton) {
        toast.success('Fitur sudah terbuka!')
      } else {
        const password = message.split(' ')[2].slice(1, -1);

        if (!password) {
          toast.error('Invalid kredensial');
          return;
        }

        // Cek apakah password benar atau tidak
        axios
          .post('/api/auth/verify-password', { password })
          .then(() => {
            toggleConfigButton();
            toast.success('Berhasil membuka fitur tambahan.');
          })
          .catch((error: AxiosError) => {
            if (error.response!.status === 400) {
              toast.error('Invalid kredensial');
            } else {
              toast.error('Internal Error');
            }
          })
      }

      return;
    }

    const commandCloseRegex = /^&hidden$/gm;

    if (commandCloseRegex.test(message)) {
      clearForm();

      if (!showConfigButton) {
        toast.success('Anda sudah berada di mode normal!');
      } else {
        toggleConfigButton();
        toast.success('Berhasil beralih ke mode normal.')
      }

      return;
    }

    if (!showSecretInput || !data.secret) {
      clearForm();

      axios.post('/api/messages', {
        ...data,
        conversationId
      });
    } else {
      if (!hashedPassword) {
        toast.error('Anda belum membuat kata sandi di akun anda!');
        return;
      }

      const secret = data.secret as string;
      const payload = {
        normalMessage: data.message as string,
        secretMessage: secret,
        password: hashedPassword,
      };

      setHidingMessage(true);

      axios.post('/api/zwc/encrypt', { payload })
        .then((res) => {
          clearForm();
          axios.post('/api/messages', {
            ...data,
            message: res.data,
            conversationId,
            isContainSecret: true
          });
        })
        .catch(() => toast.error('Pesan biasa minimal 2 kata'))
        .finally(() => setHidingMessage(false));
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
              placeholder="Pesan Rahasia"
            />
          )}
        </div>
        <button
          type="submit"
          disabled={hidingMessage}
          className="
            rounded-full
            p-2
            bg-purple-500
            cursor-pointer
            hover:bg-purple-600
            transition
            disabled:hover:bg-purple-500
            disabled:opacity-50
            disabled:cursor-default
          "
        >
          {hidingMessage ? (
            <Loader
              size={18}
              className="text-white animate-spin"
            />
          ) : (
            <SendHorizonal
              size={18}
              className="text-white"
            />
          )}
        </button>
      </form>
    </div>
  );
}

export default Form;