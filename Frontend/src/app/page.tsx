"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  UploadIcon,
  RotateCcw,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const validTypes = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a GLTF/GLB model.');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    const url = URL.createObjectURL(file);
    setModelUrl(url);
    setIsLoading(false);
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const resetViewer = () => {
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl);
      setModelUrl(null);
    }
    setError(null);
  };
  
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          3D Model Viewer
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Model Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400"/>
                    <p className="mt-2 text-sm text-gray-600">
                       <span className="text-primary font-medium">
                        Click to upload
                       </span>
                       or drag and drop
                    </p>
                    <p>
                      GLB, GLTF, FBX, OBJ, STL, PLY, DAE(Max 100MB)
                    </p>
                    <input type="file" placeholder="Enter model URL" className="hidden" />
                  </div>
                </CardContent>
            </Card>
      </div>

      {/* this model should  commnet out*/}
      
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Model Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
              {error ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                  <p className="text-red-500">{error}</p>
                </div>
              ) : modelUrl ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <p className="text-gray-500">3D Model Preview Area</p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
                  <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No model uploaded. Click the button below to upload.</p>
                  <Button onClick={triggerFileUpload}>
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload 3D Model
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={!modelUrl}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Play
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetViewer}
                  disabled={!modelUrl}
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-rotate" 
                  checked={autoRotate}
                  onCheckedChange={setAutoRotate}
                  disabled={!modelUrl}
                />
                <Label htmlFor="auto-rotate">Auto Rotate</Label>
              </div>
              
              <div>
                <Label htmlFor="model-url">Model URL</Label>
                <Input 
                  id="model-url" 
                  value={modelUrl || ''} 
                  readOnly 
                  placeholder="No model loaded"
                />
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".gltf,.glb"
                className="hidden"
              />
              
              <Button 
                onClick={triggerFileUpload}
                className="w-full"
              >
                <UploadIcon className="mr-2 h-4 w-4" />
                Load Model
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {modelUrl ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Model loaded</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <span>No model loaded</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div> */}

       {/* this model should  commnet out*/}
    </div>
  );
}