import { Link, useNavigate } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import "jquery-mask-plugin";
import { GetByIdCategory, UpdateCategory } from "@/Services/CategoryService";
import { ValidationSchemaCategory, validationSchemaCategoryUpdate } from "./Validations/SchemaUpdate";

function Update() {
  const { id } = useParams<{ id: string }>();

  const response = useQuery({
    queryKey: ["category"],
    queryFn: () => GetByIdCategory(id as string),
  });
  const category = response.data?.data;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const successToastId = useMemo(() => "successToastId", []);
  const errorToastId = useMemo(() => "errorToastId", []);

  const mutation = useMutation({
    mutationFn: UpdateCategory,
    onSuccess: () => {
      toast("Dados salvos com sucesso!", {
        toastId: successToastId,
        type: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["category"] });

      navigate("/Categorias");
    },
    onError: () => {
      toast("Ocorreu um erro interno!", {
        toastId: errorToastId,
        type: "error",
      });
    },
  });

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ValidationSchemaCategory>({
    resolver: zodResolver(validationSchemaCategoryUpdate),
    defaultValues: {
      Active: true,
      Recurrent: false,
    },
  });
  
  const onSubmit = async (data: any) => {
    const {Type, Id,...rest } = data;
    console.log(data);
    mutation.mutate({
      ...rest,
    Id,
    Type: parseInt(Type),
    });
  };

  const onError = (errors: any) => {
    console.log("form errors", errors);
  };

  useEffect(() => {
    if (category) {
      setValue("Id", category.id);
      setValue("Active", category.active);
      setValue("Recurrent", category.isRecurrent);
      setValue("Name", category.name);
      setValue("Type", String(category.type));

    }
  }, [category, setValue]);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between gap-12 mb-3">
        <h6 className="font-semibold">Gerenciamento de Categoria </h6>
        <Link
          to="/Categorias"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          Voltar
        </Link>
      </div>
      <Card className="p-5">
        <CardContent>
          <form
            className="flex h-full flex-col gap-5 "
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <div className="flex gap-4">
              <div className="w-[50%]">
                <div className="card ">
                  <div className="w-[5%] flex items-center gap-2">
                    <input
                      {...register("Active")}
                      type="checkbox"
                      checked={watch("Active")}
                    />
                    <p>{errors.Active?.message}</p>
                    <label className="font-semibold">Ativo</label>
                  </div>
                </div>

                <div className="card ">
                  <div className="w-[35%] flex items-center gap-2">
                    <input
                      {...register("Recurrent")}
                      type="checkbox"
                      checked={watch("Recurrent")}
                    />
                    <p>{errors.Active?.message}</p>
                    <label className="font-semibold">
                      Categoria Recorrente ?{" "}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-[50%]">
                <label className="font-semibold">Descrição *</label>
                <Input {...register("Name")} type="text" />
                <p className="text-red-500">{errors.Name?.message}</p>
              </div>

               <div className='w-[50%] flex flex-col items-left gap-2 mt-[-5px]'>
                    <label className='font-semibold'>Tipo *</label>
                                   
                        <div className="flex items-right gap-6">
                            <label className="flex items-center gap-1 cursor-pointer">
                                <Input 
                                type="radio"
                                value="1"
                                {...register('Type')}
                                />
                                Despesa
                            </label>

                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                type="radio"
                                value="2"
                                {...register("Type")}
                                />
                                Receita
                            </label>
                        </div>
                        <p className='text-red-500'>{errors.Type?.message}</p>  
               </div>
            </div>

            <div className="w-[100%] mt-3 flex justify-between">
              <Button type="submit" variant="secondary">
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Update;
