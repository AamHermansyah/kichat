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

const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });

    axios.post('/api/messages', {
      ...data,
      conversationId
    })
  };

  const handleUpload = (result: any) => {
    console.log(result?.info);
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
        <Image size={30} className="text-purple-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Tulis pesan"
        />
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