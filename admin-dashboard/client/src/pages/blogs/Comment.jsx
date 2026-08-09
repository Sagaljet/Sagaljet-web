"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Comment() {
  const [saveInfo, setSaveInfo] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-4">Leave a Reply</h2>
      <p className="text-sm text-gray-500 mb-6">
        Your email address will not be published. Required fields are marked{" "}
        <span className="text-red-500">*</span>
      </p>

      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="comment">
            Comment <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="comment"
            required
            className="min-h-[150px] bg-gray-50"
            placeholder="Write your comment here..."
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input id="name" required className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input id="email" type="email" required className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" type="url" className="bg-gray-50" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="save-info"
            checked={saveInfo}
            onCheckedChange={(checked) => setSaveInfo(checked)}
          />
          <Label htmlFor="save-info" className="text-sm text-gray-600">
            Save my name, email, and website in this browser for the next time I
            comment.
          </Label>
        </div>

        <Button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white px-6"
        >
          Post Comment
        </Button>
      </form>
    </div>
  );
}
