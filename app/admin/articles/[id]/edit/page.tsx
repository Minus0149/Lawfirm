"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Category as PrismaCategory } from "@prisma/client";
import Image from "next/image";
import { urlToBase64 } from "@/lib/imageUtils";
import { Editor } from "@/components/editor";

interface Category extends PrismaCategory {
  children?: Category[];
}

export default function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category | undefined>(
    null as unknown as undefined
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageLink, setImageLink] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Helper function to flatten categories
    function flattenCategories(categories: Category[]): Category[] {
      return categories.reduce((acc: Category[], category: Category) => {
        acc.push(category);
        if (category.children && category.children.length > 0) {
          acc.push(...flattenCategories(category.children));
        }
        return acc;
      }, []);
    }

    // Fetch categories from your API or data source
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        const allCategories = flattenCategories(data);
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${params.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const article = await response.json();
        setTitle(article.title);
        setContent(article.content);
        setCategory(article.category);
        const existingImageUrl =
          article.imageUrl ||
          `data:image/jpeg;base64,${
            Array.isArray(article.imageFile)
              ? Buffer.from(article.imageFile).toString("base64")
              : article.imageFile
          }`;
        setImagePreview(existingImageUrl);
        setOriginalImageUrl(existingImageUrl);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("Failed to load article. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [params.id]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageLink("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLinkChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const link = e.target.value;
    setImageLink(link);
    setImageFile(null);
    if (link) {
      try {
        const base64 = await urlToBase64(link);
        setImagePreview(base64);
      } catch (error) {
        console.error("Error converting image to base64:", error);
        setImagePreview(null);
      }
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log("Sending content:", content);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryId", category?.id || "");

    // Only append image data if it has been changed
    if (imageFile) {
      formData.append("imageFile", imageFile);
    } else if (imageLink && imageLink !== "") {
      formData.append("imageLink", imageLink);
    }
    // If no new image is selected, don't send any image data to preserve existing image

    try {
      const response = await fetch(`/api/articles/${params.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success("Article updated successfully");
      router.push("/admin/articles?refresh=true");
    } catch (error) {
      console.error("Error updating article:", error);
      setError("Failed to update article. Please try again.");
      toast.error("Failed to update article. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={category?.id || undefined}
              onValueChange={(value) => setCategory({ id: value } as Category)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="imageFile">Image File</Label>
            <Input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="imageLink">Image Link</Label>
            <Input
              id="imageLink"
              type="url"
              value={imageLink}
              onChange={handleImageLinkChange}
              placeholder="https://example.com/image.jpg"
              className="w-full"
            />
          </div>
        </div>

        {imagePreview && (
          <div className="mt-4">
            <Label>Image Preview</Label>
            <div className="relative h-48 sm:h-56 md:h-64 w-full max-w-md mx-auto md:mx-0">
              <Image
                src={imagePreview}
                alt="Article image preview"
                fill
                className="object-contain rounded-md"
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="content">Content</Label>
          <div className="w-full">
            <Editor
              value={content}
              onChange={setContent}
              placeholder="Article content starts here..."
            />
          </div>
        </div>

        <div className="flex justify-center md:justify-start">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Updating..." : "Update Article"}
          </Button>
        </div>
      </form>
    </div>
  );
}
