import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Label } from "@/components/ui/label";
import { useQuery } from '@tanstack/react-query';
import { getLocation } from "@/Services/LoginLocationDataService";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

function LoginLocationData() {
    const locationsQuery = useQuery({
        queryKey: ['locations'],
        queryFn: getLocation,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });

    const mapContainerStyle = {
        width: "90%",
        height: "100%",
    };

    return (
        <div>
            <div className="gap-5">
                <h6 className="mb-5 font-semibold text-2xl">Atividades recentes</h6>
                <p className="text-gray-400">Você deve reconhecer cada uma dessas atividades recentes. Se alguma delas não for familiar, examine suas informações de segurança.</p>
            </div>

            <div className="mt-5">

                {locationsQuery.data?.data && locationsQuery.data.data.map((item: any) => (
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger deviceType={item.platform} status={item.isSuccess ? "success" : "error"}/>
                            <AccordionContent>
                                <div className="mt-5 flex flex-wrap gap-3 mb-5">                                    
                                    <div className="w-full sm:w-[20%] lg:w-[40%] mb-8">
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
                                        <div style={mapContainerStyle} className="bg-gray-100">
                                            <MapContainer
                                                center={[item.latitude, item.longitude]}
                                                zoom={13}
                                                scrollWheelZoom={false}
                                                style={{ width: "100%", height: "100%" }}
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                />
                                                <Marker position={[item.latitude, item.longitude]}>
                                                    <Popup>Localização</Popup>
                                                </Marker>
                                            </MapContainer>
                                        </div>
                                    </div>
                          
                                    <div className="w-full sm:w-[40%] lg:w-[40%]">
                                        <div>
                                            <Label className="text-xl font-semibold">Sistema Operacional</Label>
                                            <p className="text-gray-500 mt-1">{item.os}</p>
                                        </div>

                                        <div className="mt-5">
                                            <Label className="text-xl font-semibold">IP</Label>
                                            <p className="text-gray-500 mt-1">{item.ip}</p>
                                        </div>

                                        <div className="mt-5">
                                            <Label className="text-xl font-semibold">Conta</Label>
                                            <p className="text-gray-500 mt-1">{item.emailRequest}</p>
                                        </div>
                                    </div>
                                
                                    <div className="w-full sm:w-[40%] lg:w-[15%]">
                                        <div>
                                            <Label className="text-xl font-semibold">Navegador</Label>
                                            <p className="text-gray-500 mt-1">{item.browser}</p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}

            </div>
        </div>
    );
}

export default LoginLocationData;
