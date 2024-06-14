'use client'

import { useCallback, useState, useTransition } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Input from "../../../components/core/input"
import Button from "@/components/core/button"
import { LoaderIcon } from "lucide-react"
import toast from "react-hot-toast"
import { login } from "@/actions/login"
import { register as registerAction } from "@/actions/register"

type Variant = 'LOGIN' | 'REGISTER';

function AuthForm() {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isPending, startTransition] = useTransition();

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') setVariant('REGISTER');
    else setVariant('LOGIN');
  }, [variant]);

  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (variant === 'REGISTER') {
      startTransition(() => {
        registerAction({ name: data.name, email: data.email, password: data.password })
          .then((data) => {
            if (data?.error) toast.error(data.error);
            if (data?.success) {
              toast.success(data.success);
              toggleVariant();
            };
          });
      });
    }

    if (variant === 'LOGIN') {
      startTransition(() => {
        login({ email: data.email, password: data.password })
          .then((data) => {
            if (data?.error) toast.error(data.error);
            if (data?.success) toast.success(data.success);
          });
      });
    }
  }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {variant === 'REGISTER' && (
            <Input
              id="name"
              label="Name"
              register={register}
              errors={errors}
              disabled={isPending}
            />
          )}

          <Input
            id="email"
            label="Email"
            register={register}
            errors={errors}
            disabled={isPending}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isPending}
          />

          <div>
            <Button
              type="submit"
              fullWidth
              disabled={
                isPending ||
                !watch('email') ||
                !watch('password') ||
                (variant === 'LOGIN' ? false : !watch('name'))
              }
            >
              {isPending && <LoaderIcon className="w-4 h-4 animate-spin" />}
              {variant === 'LOGIN' ? 'Masuk' : 'Daftar'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="flex gap-2 justify-center text-sm px-2 text-gray-500">
            <span>
              {variant === 'LOGIN' ? 'Belum bergabung di KiChat?' : 'Sudah bergabung di KiChat?'}
            </span>
            <button
              type="button"
              onClick={toggleVariant}
              className="underline cursor-pointer"
              disabled={isPending}
            >
              {variant === 'LOGIN' ? 'Buat akun' : 'Masuk'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm