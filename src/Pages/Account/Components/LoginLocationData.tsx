import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Label } from "@/components/ui/label";
function LoginLocationData() {

    const mapContainerStyle = {
        width: "90%",
        height: "150px",
    };

    return (
        <div>
            <div className="gap-5">
                <h6 className="mb-5 font-semibold text-2xl">Atividades recentes</h6>
                <p className="text-gray-400">Você deve reconhecer cada uma dessas atividades recentes. Se alguma delas não for familiar, examine suas informações de segurança.</p>
            </div>

            <div className="mt-5">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger deviceType="monitor" status="success" />
                        <AccordionContent>
                            <div className="mt-5 flex gap-3">
                                <div className="w-[18%]">
                                    <p className="font-semibold text-xl">Localização</p>
                                    <div className="flex items-center">
                                        <p>São Paulo, BR</p>
                                        <Tooltip.Root>
                                            <Tooltip.Trigger asChild>
                                                <span className="ml-2 cursor-pointer">
                                                    <Info size="18px" />
                                                </span>
                                            </Tooltip.Trigger>
                                            <Tooltip.Content className="bg-white text-black border border-gray-300 rounded p-2 text-xs z-50">
                                                As informações de localização são aproximadas do endereço IP e podem não corresponder à localização física exata deste logon.
                                                <Tooltip.Arrow className="fill-white" />
                                            </Tooltip.Content>
                                        </Tooltip.Root>
                                    </div>
                                    <div style={mapContainerStyle} className="bg-gray-100"></div>
                                </div>

                                <div className=" text-start w-[40%]">
                                    <div>
                                        <Label className="text-xl font-semibold">Sistema Operacional</Label>
                                        <p className="text-gray-500 mt-1">Windows10</p>
                                    </div>

                                    <div className="mt-5">
                                        <Label className="text-xl font-semibold ">IP</Label>
                                        <p className="text-gray-500 mt-1">2804:58e8:8002:6500:91af:7c06:54f8:23b1</p>
                                    </div>

                                    <div className="mt-5">
                                        <Label className="text-xl font-semibold ">Conta</Label>
                                        <p className="text-gray-500 mt-1">teste@teste.com</p>
                                    </div>

                                </div>
                                <div className=" text-start w-[40%]">
                                    <div>
                                        <Label className="text-xl font-semibold">Navegador</Label>
                                        <p className="text-gray-500 mt-1">Google Chrome</p>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger deviceType="monitor" status="success" />
                        <AccordionContent>
                            <div className="mt-5 flex gap-3">
                                <div className="w-[18%]">
                                    <p className="font-semibold text-xl">Localização</p>
                                    <div className="flex items-center">
                                        <p>São Paulo, BR</p>
                                        <Tooltip.Root>
                                            <Tooltip.Trigger asChild>
                                                <span className="ml-2 cursor-pointer">
                                                    <Info size="18px" />
                                                </span>
                                            </Tooltip.Trigger>
                                            <Tooltip.Content className="bg-white text-black border border-gray-300 rounded p-2 text-xs z-50">
                                                As informações de localização são aproximadas do endereço IP e podem não corresponder à localização física exata deste logon.
                                                <Tooltip.Arrow className="fill-white" />
                                            </Tooltip.Content>
                                        </Tooltip.Root>
                                    </div>
                                    <div style={mapContainerStyle} className="bg-gray-100"></div>
                                </div>

                                <div className=" text-start w-[40%]">
                                    <div>
                                        <Label className="text-xl font-semibold">Sistema Operacional</Label>
                                        <p className="text-gray-500 mt-1">Windows10</p>
                                    </div>

                                    <div className="mt-5">
                                        <Label className="text-xl font-semibold ">IP</Label>
                                        <p className="text-gray-500 mt-1">2804:58e8:8002:6500:91af:7c06:54f8:23b1</p>
                                    </div>

                                    <div className="mt-5">
                                        <Label className="text-xl font-semibold ">Conta</Label>
                                        <p className="text-gray-500 mt-1">teste@teste.com</p>
                                    </div>

                                </div>
                                <div className=" text-start w-[40%]">
                                    <div>
                                        <Label className="text-xl font-semibold">Navegador</Label>
                                        <p className="text-gray-500 mt-1">Google Chrome</p>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}

export default LoginLocationData;
