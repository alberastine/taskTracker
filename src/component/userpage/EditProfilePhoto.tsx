import { CameraOutlined } from "@ant-design/icons";
import { Modal, Button, message } from "antd";
import { useRef, useState } from "react";
import { useCallback, useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import { userApi } from "../../api/userApi";

import axios from "../../api/axios";

const EditProfilePhoto = () => {
  const [isModalOpenProfilePic, setIsModalOpenProfilePic] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, setUser } = useContext(UserContext);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get("/profile");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  }, [setUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (!user) {
    return <div>User not found</div>;
  }

  const showModalProfilePic = () => {
    setIsModalOpenProfilePic(true);
  };

  const handleCancel = () => {
    setIsModalOpenProfilePic(false);
    setPreviewUrl(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    }
  };

  const handleSubmitProfile = async () => {
    if (!file) return;

    try {
      await userApi.updateProfilePicture(file);
      await fetchUser();

      setIsModalOpenProfilePic(false);
      setFile(null);
      setPreviewUrl(null);
      message.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      message.error("Failed to update profile picture.");
    }
  };

  return (
    <>
      <div
        onClick={showModalProfilePic}
        className="absolute bottom-1 right-1 flex size-7 cursor-pointer items-center justify-center rounded-full border-2 bg-blue-500 p-1 text-white hover:bg-blue-300"
      >
        <CameraOutlined style={{ fontSize: "15px" }} />
      </div>
      <Modal
        title="Upload Profile Picture"
        open={isModalOpenProfilePic}
        onCancel={handleCancel}
        footer={[
          <div className="displayflex-flexend">
            <Button
              key="cancel"
              className="button-no-focus"
              onClick={handleCancel}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Cancel
            </Button>

            <Button
              key="submit"
              className="button-no-focus"
              onClick={handleSubmitProfile}
              disabled={!file}
              style={{
                backgroundColor: "rgb(14 116 144)",
                color: "white",
              }}
            >
              Save
            </Button>
          </div>,
        ]}
      >
        <div className="flex flex-col items-center gap-4">
          {previewUrl && (
            <div className="size-32 overflow-hidden rounded-full">
              <img
                src={previewUrl}
                alt="Preview"
                className="size-full object-cover"
              />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            name="profilePic"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500
                    file:mr-4 file:rounded-full file:border-0
                    file:bg-blue-50 file:px-4
                    file:py-2 file:text-sm
                    file:font-semibold file:text-blue-700
                    hover:file:bg-blue-100"
          />
        </div>
      </Modal>
    </>
  );
};

export default EditProfilePhoto;
