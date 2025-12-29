import { useState, useRef, useEffect } from "react";
import { User } from "@/data/dummyData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, Eye, EyeOff, Save, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { supabase } from "@/services/supabase";

interface ProfileSectionProps {
  user: User;
  onUserUpdate?: (updatedUser: User) => void;
}

export function ProfileSection({ user, onUserUpdate }: ProfileSectionProps) {
  const [currentUser, setCurrentUserState] = useState<User>(user);
  const [dragActive, setDragActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentUserState(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      occupation: user.occupation,
      companyName: user.companyName,
      password: "",
      confirmPassword: "",
    });
  }, [user.id]);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    occupation: user.occupation,
    companyName: user.companyName,
    password: "",
    confirmPassword: "",
  });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      let profilePictureUrl = currentUser.profilePicture;
      let userData = {};

      if (imageFile) {
        const uploadedUrl = await uploadProfilePicture();
        if (uploadedUrl) {
          profilePictureUrl = uploadedUrl;
        } else {
          toast.error("Failed to upload profile picture");
          setLoading(false);
          return;
        }
      }

      if (formData.password != "") {
        if (formData.confirmPassword != formData.password) {
          setPasswordMatch(true);
          setIsEditingPassword(true);
          setLoading(false);
          return;
        } else {
          setPasswordMatch(false);
        }
        userData = {
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Email: formData.email,
          Occupation: formData.occupation,
          CompanyName: formData.companyName,
          ProfilePicture: profilePictureUrl,
          Password: formData.password,
        };
      } else {
        userData = {
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Email: formData.email,
          Occupation: formData.occupation,
          CompanyName: formData.companyName,
          ProfilePicture: profilePictureUrl,
        };
      }

      const response = await api.users.update(currentUser.id, userData);
      console.log("Update successful:", response);

      if (response?.user) {
        setCurrentUserState(response.user);
        if (onUserUpdate) {
          onUserUpdate(response.user);
        }
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setIsEditingPassword(false);
      setPasswordMatch(false);
      setImageFile(null);
      setProfilePreview(null);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err: any) {
      console.error("Update failed:", err);
      const errorMessage = err.message || "Failed to update profile.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `profile-${currentUser.id}-${Date.now()}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("Project-Files")
      .upload(filePath, imageFile, {
        contentType: imageFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload failed:", uploadError);
      return null;
    }

    const { data } = await supabase.storage
      .from("Project-Files")
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  };

  const handleImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    const imgUrl = URL.createObjectURL(file);
    setProfilePreview(imgUrl);
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFiles(e.dataTransfer.files);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      occupation: currentUser.occupation,
      companyName: currentUser.companyName,
      password: "",
      confirmPassword: "",
    });
    setIsEditing(false);
    setIsEditingPassword(false);
    setPasswordMatch(false);
    setImageFile(null);
    setProfilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageFiles(e.target.files)}
              />
              <Avatar
                className={`h-24 w-24 cursor-pointer transition-all ${
                  isEditing ? "hover:ring-2 hover:ring-primary" : ""
                }`}
                onClick={handleAvatarClick}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <AvatarImage
                  src={profilePreview || currentUser.profilePicture}
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {currentUser.firstName[0]}
                  {currentUser.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {currentUser.firstName} {currentUser.lastName}
              </h3>
              <p className="text-muted-foreground">{currentUser.occupation}</p>
              <p className="text-sm text-muted-foreground">
                {currentUser.companyName}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={!isEditing}
                className="transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={!isEditing}
                className="transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing}
                className="transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) =>
                  setFormData({ ...formData, occupation: e.target.value })
                }
                disabled={!isEditing}
                className="transition-colors"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                disabled={!isEditing}
                className="transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving Changes in..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account security and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col border-b border-border pb-3">
            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col">
                <p className="font-medium text-foreground">Change Password</p>
                <p className="text-sm text-muted-foreground">
                  Update your password regularly for security
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditingPassword(!isEditingPassword)}
              >
                Change
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {(isEditingPassword || passwordMatch) && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          });
                          if (passwordMatch) {
                            setPasswordMatch(false);
                          }
                        }}
                        disabled={!isEditing && !isEditingPassword}
                        className="transition-colors pr-10"
                        placeholder="Enter new password"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {(isEditingPassword || passwordMatch) && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          });
                          // Clear error when user starts typing
                          if (passwordMatch) {
                            setPasswordMatch(false);
                          }
                        }}
                        disabled={!isEditing && !isEditingPassword}
                        className="transition-colors pr-10"
                        placeholder="Confirm new password"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            {passwordMatch && (
              <p className="text-red-600 mt-2 text-sm">
                Passwords don't match.
              </p>
            )}
            {isEditingPassword && (
              <>
                <div className="flex justify-end">
                  <Button
                    className="mt-3"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Save
                  </Button>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and data
              </p>
            </div>
            <Button variant="destructive">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
