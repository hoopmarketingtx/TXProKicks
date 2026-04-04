import { useState } from "react";
import { Upload, X, Loader2, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ImageUploader({ value, onChange, multiple = false }) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const urls = [];
    
    for (const file of files) {
      // Convert image to base64 so it can be stored in localStorage
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      urls.push(base64);
    }
    
    setUploading(false);

    if (multiple) {
      onChange([...(value || []), ...urls]);
    } else {
      onChange(urls[0]);
    }
  };

  const removeImage = (index) => {
    if (multiple) {
      const updated = [...value];
      updated.splice(index, 1);
      onChange(updated);
    } else {
      onChange("");
    }
  };

  const images = multiple ? (value || []) : value ? [value] : [];

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;
    
    if (multiple) {
      onChange([...(value || []), urlInput.trim()]);
    } else {
      onChange(urlInput.trim());
    }
    setUrlInput("");
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden bg-secondary border border-border group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-3 h-3 text-foreground" />
            </button>
          </div>
        ))}
      </div>
      
      {showUrlInput ? (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter image URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlAdd()}
            className="flex-1 bg-secondary border-border"
          />
          <Button type="button" onClick={handleUrlAdd} size="sm" disabled={!urlInput.trim()}>
            Add
          </Button>
          <Button type="button" onClick={() => { setShowUrlInput(false); setUrlInput(""); }} variant="outline" size="sm">
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleUpload}
              className="hidden"
            />
            <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
              <span>
                {uploading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="w-4 h-4 mr-2" /> Upload File</>
                )}
              </span>
            </Button>
          </label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => setShowUrlInput(true)}
          >
            <Link className="w-4 h-4 mr-2" /> Image URL
          </Button>
        </div>
      )}
    </div>
  );
}