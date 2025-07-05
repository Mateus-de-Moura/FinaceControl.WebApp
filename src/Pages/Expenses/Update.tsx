import { Link, useNavigate } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  validationSchemaExpenseUpdate,
  ValidationSchemaExpenseUpdate,
} from "./Validations/schemaUpdate";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { GetCategories } from "@/Services/CategoryService";
import { GetById, UpdateExpense } from "@/Services/ExpenseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "jquery-mask-plugin";
import { Trash } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

function Update() {
  const { id } = useParams<{ id: string }>();

  const rolesQuery = useQuery({
    queryKey: ["category"],
    queryFn: GetCategories,
  });
  const response = useQuery({
    queryKey: ["expense"],
    queryFn: () => GetById(id as string),
  });
  const expense = response.data?.data;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const successToastId = useMemo(() => "successToastId", []);
  const errorToastId = useMemo(() => "errorToastId", []);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: UpdateExpense,
    onSuccess: () => {
      toast("Dados salvos com sucesso!", {
        toastId: successToastId,
        type: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["expense"] });

      navigate("/Despesas");
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
  } = useForm<ValidationSchemaExpenseUpdate>({
    resolver: zodResolver(validationSchemaExpenseUpdate),
    defaultValues: {
      Active: true,
      Recurrent: false,
      Status: 0,
    },
  });

  const statusValue = watch("Status");
  const statusString =
    statusValue !== undefined && statusValue !== null
      ? statusValue.toString()
      : "0";

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = async (data: any) => {
    mutation.mutate({
      ...data,
      ProofFile: proofFile,
    });
  };

  const onError = (errors: any) => {
    console.log("form errors", errors);
  };

  useEffect(() => {
    if (expense) {
      setValue("IdExpense", expense.id);
      setValue("Active", expense.active);
      setValue("Recurrent", expense.isRecurrent);
      setValue("Description", expense.description);
      setValue("CategoryId", expense.categoryId);
      setValue("Status", expense.status);
      setValue("DueDate", expense.dueDate);
      setValue("ProofFile", expense.proofFile);

      const date = new Date(expense.dueDate);
      const formattedDate = date.toISOString().split("T")[0];
      setValue("DueDate", formattedDate);

      setValue("Value", expense.value.toString());

      if (expense.status === 1 && expense.proofFile) {
        setPreviewUrl(expense.proofFile); // URL do backend
        setProofFile(null);
      }
    }
  }, [expense, setValue]);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between gap-12 mb-3">
        <h6 className="font-semibold">Gerenciamento de Despesas </h6>
        <Link
          to="/Despesas"
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
                      Despesa Recorrente ?{" "}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-[50%]">
                <label className="font-semibold">Descrição *</label>
                <Input {...register("Description")} type="text" />
                <p className="text-red-500">{errors.Description?.message}</p>
              </div>

              <div className="w-[50%]">
                <label className="font-semibold">Categoria *</label>
                <Select
                  value={watch("CategoryId")}
                  {...register("CategoryId")}
                  onValueChange={(value) => setValue("CategoryId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="0" value="0" disabled>
                      Selecione
                    </SelectItem>
                    {rolesQuery &&
                      rolesQuery.data?.map((role: Category) => {
                        return (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
                {errors.CategoryId && (
                  <p className="text-red-500">{errors.CategoryId.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-[24%]">
                <label className="font-semibold">Data de Vencimento *</label>
                <Input
                  {...register("DueDate")}
                  type="Date"
                  placeholder="Nickname do usuário"
                />
                <p className="text-red-500">{errors.DueDate?.message}</p>
              </div>

              <div className="w-[24%] gap-1">
                <label className="mb-1 font-semibold">Valor *</label>
                <Input
                  {...register("Value", { required: "Valor é obrigatório" })}
                  type="text"
                  className="money-mask"
                />
                <p className="text-red-500">{errors.Value?.message}</p>
              </div>
              <div className="w-48">
                <label className="font-semibold">Status </label>
                <Select
                  value={statusString}
                  onValueChange={(value) => setValue("Status", parseInt(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="0" value="0">
                      Pendente
                    </SelectItem>
                    <SelectItem key="1" value="1">
                      Pago
                    </SelectItem>
                    <SelectItem key="2" value="2">
                      Vencido
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {watch("Status") === 1 && (
                <div className="mt-0">
                  <label className="font-semibold block mb-2">
                    Comprovante de pagamento
                  </label>
                  <div className="relative w-40 h-40 bg-gray-100 border border-gray-300 rounded flex items-center justify-center overflow-hidden cursor-pointer">
                    <input
                      id="proof-upload"
                      type="file"
                      accept="application/pdf,image/*"
                      className="hidden"
                      onChange={handleProofChange}
                    />
                    <label
                      htmlFor="proof-upload"
                      className="w-full h-full flex items-center justify-center"
                    >
                      {previewUrl ? (
                        previewUrl.includes(".pdf") ? (
                          <span className="text-sm text-gray-600 text-center">
                            📄 PDF
                          </span>
                        ) : (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <span className="text-gray-500 text-center">
                          Clique para anexar
                        </span>
                      )}
                    </label>
                    {proofFile && (
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-gray-200"
                        onClick={() => {
                          setProofFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        <Trash className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                  {proofFile && (
                    <div className="mt-2 text-sm text-gray-700 text-center">
                      {proofFile.name}
                    </div>
                  )}
                </div>
              )}
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
  );
}

export default Update;
