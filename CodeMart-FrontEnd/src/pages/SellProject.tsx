import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Upload,
  X,
  Plus,
  DollarSign,
  Tag,
  FileText,
  Image,
  FolderArchive,
  Video,
  FileArchive,
  Loader2,
} from "lucide-react";
import { supabase } from "@/services/supabase";
import { toast } from "sonner";

const SellProject = () => {
  const [formData, setFormData] = useState<{
    Name: string;
    Category: string;
    Price: string;
    Description: string;
    PrimaryLanguages: string[];
    SecondaryLanguages: string[];
    features: string[];
  }>({
    Name: "",
    Category: "",
    Price: "",
    Description: "",
    PrimaryLanguages: [],
    SecondaryLanguages: [],
    features: [],
  });

  const zipInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [dragActive, setDragActive] = useState(false);
  const [newTech, setNewTech] = useState("");
  const [newTech2, setNewTech2] = useState("");
  const [zipFiles, setZipFiles] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Web Development",
    "Mobile Development",
    "AI/ML",
    "Desktop Apps",
    "APIs",
    "Games",
    "Data Science",
    "DevOps",
  ];

  const mapCategoryToEnum = (category: string): string => {
    const categoryMap: Record<string, string> = {
      "Web Development": "WebDevelopment",
      "Mobile Development": "MobileDevelopment",
      "AI/ML": "ArtificialIntelligence",
      "Desktop Apps": "DesktopApps",
      "APIs": "APIs",
      "Games": "GameDevelopment",
      "Data Science": "DataScience",
      "DevOps": "DevOps",
      "Artificial Intelligence": "ArtificialIntelligence"
    };
    return categoryMap[category] || category;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addTechnology = (primary = false) => {
    if (primary) {
      if (
        newTech.trim() &&
        !formData.PrimaryLanguages.includes(newTech.trim())
      ) {
        setFormData((prev) => ({
          ...prev,
          PrimaryLanguages: [...prev.PrimaryLanguages, newTech.trim()],
        }));
        setNewTech("");
      }
    } else {
      if (
        newTech2.trim() &&
        !formData.SecondaryLanguages.includes(newTech2.trim())
      ) {
        setFormData((prev) => ({
          ...prev,
          SecondaryLanguages: [...prev.SecondaryLanguages, newTech2.trim()],
        }));
        setNewTech2("");
      }
    }
  };

  const removeTechnology = (tech: string, primary = false) => {
    if (primary) {
      setFormData((prev) => ({
        ...prev,
        PrimaryLanguages: prev.PrimaryLanguages.filter((t) => t !== tech),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        SecondaryLanguages: prev.SecondaryLanguages.filter((t) => t !== tech),
      }));
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    if (files[0].type.startsWith("video/")) {
      handleVideoFiles(files);
    }
    else if (files[0].type.startsWith("image/")) {
      handleImageFiles(files);
    }
    else {
      handleZipFiles(files);
    }
  };

  const handleZipFiles = (files: FileList | null) => {
    const allowedExtensions = [
      ".zip",
      ".rar",
      ".7z",
      ".gz",
      ".tgz",
      ".bz2",
      ".xz",
      ".tar.gz",
      ".tar.bz2",
      ".tar.xz",
    ];

    if (!files) return;
    const uploaded = Array.from(files).filter((file) => {
      return allowedExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );
    });

    setZipFiles(uploaded.slice(0, 1));
  };

  const handleVideoFiles = (files: FileList | null) => {
    const allowedExtensions = [
      ".mp4",
      ".mov",
      ".avi",
      ".mkv",
      ".wmv",
      ".flv",
      ".webm",
      ".mpeg",
      ".mpg",
      ".m4v"
    ];

    if (!files) return;
    const uploaded = Array.from(files).filter((file) => {
      return allowedExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );
    });

    setVideoFile(uploaded.slice(0, 1));
  };

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    const imageFilesArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    setImageFiles((prev) => [...prev, ...imageFilesArray].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeZip = () => {
    setZipFiles([]);

    if (zipInputRef.current) {
      zipInputRef.current.value = "";
    }
  };

  const removevideo = () => {
    setVideoFile([]);

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  async function uploadToSupabase(file: File, isZip = false) {
    if (!file) return null;

    const filePath = `codemart.org/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("Project-Files")
      .upload(filePath, file, {
        contentType: isZip ? "application/zip" : file.type,
      });

    if (uploadError) {
      console.error(uploadError);
      return null;
    }
    if (isZip) {
      const { data, error } = await supabase.storage
        .from("Project-Files")
        .createSignedUrl(filePath, 60 * 60 * 24 * 7);
      if (error) {
        console.error(error);
        return null;
      }
      return data?.signedUrl;
    } else {
      const { data } = await supabase.storage
        .from("Project-Files")
        .getPublicUrl(filePath);

      return data?.publicUrl;
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.PrimaryLanguages.length === 0) {
      toast.error("Please add at least one primary language/technology");
      return;
    }
    
    if (formData.features.length === 0 || formData.features.some(f => f.trim() === "")) {
      toast.error("Please add at least one feature and ensure all features are filled");
      return;
    }
    
    if (zipFiles.length === 0) {
      toast.error("Please upload a project ZIP file");
      return;
    }
    
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one project image");
      return;
    }
    
    setLoading(true);

    try {
      let zipUrl = null;
      if (zipFiles.length > 0) {
        toast.info("Uploading project files...");
        zipUrl = await uploadToSupabase(zipFiles[0], true);
        if (!zipUrl) {
          toast.error("Failed to upload project file. Please try again.");
          setLoading(false);
          return;
        }
      }

      let videoUrl = null;
      if (videoFile.length > 0) {
        toast.info("Uploading video...");
        videoUrl = await uploadToSupabase(videoFile[0]);
        if (!videoUrl) {
          toast.error("Failed to upload video. Please try again.");
          setLoading(false);
          return;
        }
      }

      const uploadedImages: string[] = [];
      if (imageFiles.length > 0) {
        toast.info("Uploading images...");
        for (const img of imageFiles) {
          const url = await uploadToSupabase(img);
          if (url) uploadedImages.push(url);
        }
      }

      const categoryEnum = mapCategoryToEnum(formData.Category);

      const projectData = {
        Name: formData.Name,
        Category: categoryEnum,
        Description: formData.Description,
        Price: parseFloat(formData.Price) || 0,
        ProjectUrl: zipUrl || "",
        ImageUrls: uploadedImages,
        PrimaryLanguages: formData.PrimaryLanguages,
        SecondaryLanguages: formData.SecondaryLanguages,
        VideoUrl: videoUrl || "",
        Features: formData.features,
      };

      toast.info("Publishing project...");
      await api.projects.create(projectData);
      
      toast.success("Project published successfully!");
      
      // Redirect to home page on success
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: any) {
      console.error("Publish failed:", err);
      
      // Extract error message from various error formats
      let errorMessage = "Failed to publish project. Please try again.";
      
      try {
        if (err instanceof Error) {
          const errorData = JSON.parse(err.message);
          if (errorData.errors && typeof errorData.errors === 'object') {
            const validationErrors = Object.entries(errorData.errors)
              .map(([field, messages]: [string, any]) => {
                const msgArray = Array.isArray(messages) ? messages : [messages];
                return `${field}: ${msgArray.join(', ')}`;
              })
              .join('; ');
            errorMessage = validationErrors;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.title) {
            errorMessage = errorData.title;
          }
        }
      } catch (parseError) {
        // If parsing fails, use the error message as is
        if (err instanceof Error) {
          errorMessage = err.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-2xl border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sell Your Project
          </h1>
          <p className="text-gray-600">
            Share your amazing software project with the world
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-indigo-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your project title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="Category"
                  value={formData.Category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Provide a detailed description of your project, its features, and benefits..."
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <DollarSign className="h-6 w-6 mr-2 text-green-600" />
              Pricing
            </h2>

            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  name="Price"
                  value={formData.Price}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0"
                  min="1"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Set a competitive price for your project
              </p>
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Tag className="h-6 w-6 mr-2 text-purple-600" />
              Technologies Used
            </h2>

            {/* Primary Languages */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Languages *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Add Primary Languages (e.g., React, .NET)"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addTechnology(true))
                  }
                />
                <button
                  type="button"
                  onClick={() => addTechnology(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.PrimaryLanguages.map((tech, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech, true)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Secondary Languages */}
            <div className="mb-3 mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Languages (Optional)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTech2}
                  onChange={(e) => setNewTech2(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Add Secondary Languages (e.g., Python, Node.js)"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTechnology())
                  }
                />
                <button
                  type="button"
                  onClick={() => addTechnology()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.SecondaryLanguages.map((tech, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech, false)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Project Features *
            </h2>

            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter a feature"
                    required
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addFeature}
              className="mt-4 text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Feature
            </button>
          </div>

          {/* Project Files */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FileArchive className="h-6 w-6 mr-2 text-blue-600" />
              Project Zip File *
            </h2>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Upload project zip file
              </p>
              <p className="text-gray-600 mb-4">
                Drag and drop files here, or click to select files
              </p>
              <input
                ref={zipInputRef}
                type="file"
                multiple
                accept=".zip,.rar,.7z,.tar,.gz,.tgz,.bz2,.xz,.tar.gz,.tar.bz2,.tar.xz"
                onChange={(e) => handleZipFiles(e.target.files)}
                className="hidden"
                id="zip-upload"
              />
              <label
                htmlFor="zip-upload"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Select Files
              </label>
            </div>
          </div>

          {zipFiles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {zipFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative flex items-center p-4 border rounded-lg bg-gray-50"
                >
                  <FolderArchive className="h-10 w-10 text-indigo-600 mr-4" />

                  <div className="flex-1">
                    <p className="font-medium text-gray-800 truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeZip} // only 1 zip allowed in your code
                    className="ml-4 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Image className="h-6 w-6 mr-2 text-blue-600" />
              Project Images *
            </h2>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Upload project screenshots
              </p>
              <p className="text-gray-600 mb-4">
                Drag and drop images here, or click to select files
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageFiles(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Select Images
              </label>
            </div>

            {imageFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {imageFiles.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Video className="h-6 w-6 mr-2 text-blue-600" />
              Demonstration Video
            </h2>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Add a demonstration video
              </p>
              <p className="text-gray-600 mb-4">
                Drag and drop files here, or click to select files
              </p>
              <input
                ref={videoInputRef}
                type="file"
                multiple
                accept=".mp4,.mov,.avi,.mkv,.wmv,.flv,.webm,.mpeg,.mpg,.m4v"
                onChange={(e) => handleVideoFiles(e.target.files)}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Select Files
              </label>
            </div>
          </div>

          {videoFile.length > 0 && (
            <div className=" md:grid-cols-2 mt-6">
              {videoFile.map((file, index) => (
                <div
                  key={index}
                  className="relative flex items-center p-4 border rounded-lg bg-gray-50"
                >
                 <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="w-40 h-24 rounded-lg object-cover mr-4"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removevideo}
                    className="ml-4 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>

                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Project"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellProject;
