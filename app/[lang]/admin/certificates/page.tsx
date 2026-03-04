"use client";


import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Award, FileCheck, Wand2, Plus, PenTool } from "lucide-react";

import { toast } from "sonner";
export default function CertificatesPage() {
    const { t } = useLanguage();
    const c = t.adminPanel?.certificates || {};

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{c.title || "Certificates"}</h1>
                    <p className="text-muted-foreground">{c.subtitle}</p>
                </div>
                <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")} className="gap-2">
                    <Plus className="h-4 w-4" />
                    {c.templates?.create}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-4xl font-bold text-indigo-600">1,248</CardTitle>
                        <CardDescription>{c.stats?.totalIssued}</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-4xl font-bold text-green-600">88%</CardTitle>
                        <CardDescription>{c.stats?.avgScore}</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <Tabs defaultValue="templates" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="templates" className="gap-2">
                        <Award className="h-4 w-4" />
                        {c.tabs?.templates}
                    </TabsTrigger>
                    <TabsTrigger value="exams" className="gap-2">
                        <PenTool className="h-4 w-4" />
                        {c.tabs?.exams}
                    </TabsTrigger>
                    <TabsTrigger value="issued" className="gap-2">
                        <FileCheck className="h-4 w-4" />
                        {c.tabs?.issued}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Certificate Preview Card */}
                        <Card className="overflow-hidden group cursor-pointer hover:border-indigo-400 transition-colors">
                            <div className="aspect-video bg-slate-100 relative items-center justify-center flex border-b">
                                <div className="absolute inset-4 bg-white shadow-lg border-4 border-double border-orange-200 p-8 flex flex-col items-center justify-center text-center">
                                    <Award className="h-16 w-16 text-orange-400 mb-4" />
                                    <h3 className="font-serif text-2xl font-bold text-slate-800">{c.templates?.certificateTitle}</h3>
                                    <div className="w-full h-px bg-slate-200 my-4" />
                                    <p className="font-script text-xl text-indigo-600">{`{student_name}`}</p>
                                    <p className="text-xs text-muted-foreground mt-2">{c.templates?.completedCourse?.replace("{course}", "{course_name}")}</p>
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button onClick={() => toast.info("Generowanie podglądu na żywo...")} variant="secondary">{c.templates?.preview}</Button>
                                </div>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-base">{c.templates?.standardTitle}</CardTitle>
                                <CardDescription>{c.templates?.standardDesc}</CardDescription>
                            </CardHeader>
                        </Card>

                        {/* AI Generator Card */}
                        <Card className="border-dashed flex items-center justify-center min-h-[300px] hover:bg-muted/50 cursor-pointer transition-colors">
                            <div className="flex flex-col items-center gap-4 text-center p-6">
                                <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <Wand2 className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{c.templates?.aiGenerate}</h3>
                                    <p className="text-sm text-muted-foreground max-w-[200px]">
                                        {c.templates?.aiDesc}
                                    </p>
                                </div>
                                <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")} variant="outline">{c.templates?.createAi}</Button>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="exams">
                    <div className="text-center py-12 bg-muted/20 border-dashed border-2 rounded-xl">
                        <PenTool className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-bold text-lg">{c.exams?.create}</h3>
                        <p className="text-muted-foreground mb-4">{c.exams?.description}</p>
                        <Button onClick={() => toast.success("Akcja wykonana pomyślnie.")} variant="default" className="gap-2">
                            <Wand2 className="h-4 w-4" />
                            {c.exams?.createAi}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="issued">
                    <div className="rounded-md border">
                        <div className="p-4 text-sm text-center text-muted-foreground">
                            {c.issued?.empty}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
